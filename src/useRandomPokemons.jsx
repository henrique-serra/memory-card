// hooks/useRandomPokemons.js

import { useState, useEffect } from 'react';
import { PokemonCache } from './PokemonCache';

/**
 * Custom hook para buscar Pokémons aleatórios com cache e sem duplicatas
 * @param {number} count - Número de Pokémons para buscar (padrão: 12)
 * @param {Object} options - Opções do hook
 * @returns {Object} - Estado e funções do hook
 */
export function useRandomPokemons(count = 12, options = {}) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: count });
  
  const {
    autoFetch = true,           // Se deve buscar automaticamente no mount
    enableProgress = false,     // Se deve reportar progresso
    maxRetries = 20,           // Máximo de tentativas sequenciais
    batchSize = 15             // Tamanho do lote inicial
  } = options;

  /**
   * Busca um único Pokémon, verificando cache e evitando duplicatas
   */
  const fetchSinglePokemon = async (excludeIds = new Set(), abortSignal) => {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      if (abortSignal?.aborted) return null;
      
      const randomId = Math.floor(Math.random() * 1025) + 1;
      
      // Se este ID já foi coletado, tenta outro
      if (excludeIds.has(randomId)) {
        attempts++;
        continue;
      }
      
      try {
        // 1. Verifica cache primeiro
        let pokemon = PokemonCache.get(randomId);
        
        if (!pokemon) {
          // 2. Se não está no cache, faz requisição
          if (abortSignal?.aborted) return null;
          
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${randomId}`,
            { signal: abortSignal }
          );
          
          if (!response.ok) {
            attempts++;
            continue;
          }
          
          const rawPokemon = await response.json();
          
          if (abortSignal?.aborted) return null;
          
          // 3. Processa e estrutura os dados
          pokemon = {
            id: rawPokemon.id,
            name: rawPokemon.name,
            types: rawPokemon.types.map(type => type.type.name),
            height: rawPokemon.height,
            weight: rawPokemon.weight,
            stats: rawPokemon.stats.map(stat => ({
              name: stat.stat.name,
              base_stat: stat.base_stat
            })),
            abilities: rawPokemon.abilities.map(ability => ability.ability.name),
            images: {
              official: rawPokemon.sprites.other?.['official-artwork']?.front_default,
              classic: rawPokemon.sprites.front_default,
              shiny: rawPokemon.sprites.front_shiny,
              animated: rawPokemon.sprites.other?.showdown?.front_default,
            }
          };
          
          // 4. Salva no cache
          PokemonCache.set(randomId, pokemon);
        }
        
        return pokemon;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          return null;
        }
        
        console.warn(`Falha ao buscar Pokémon ${randomId}:`, error.message);
        attempts++;
      }
    }
    
    return null;
  };

  /**
   * Coleta os Pokémons únicos
   */
  const collectPokemons = async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);
      setProgress({ current: 0, total: count });
      
      const validPokemons = [];
      const collectedIds = new Set();
      
      // Primeira fase: busca em lote
      const initialPromises = Array(batchSize).fill().map(() => 
        fetchSinglePokemon(collectedIds, abortSignal)
      );
      
      const results = await Promise.allSettled(initialPromises);
      
      if (abortSignal?.aborted) return;
      
      // Processa resultados evitando duplicatas
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const pokemon = result.value;
          
          if (!collectedIds.has(pokemon.id)) {
            collectedIds.add(pokemon.id);
            validPokemons.push(pokemon);
            
            if (enableProgress) {
              setProgress({ 
                current: Math.min(validPokemons.length, count), 
                total: count 
              });
            }
            
            // Update progressivo da UI
            setPokemons([...validPokemons.slice(0, count)]);
          }
        }
      }
      
      // Segunda fase: busca sequencial para completar
      let sequentialAttempts = 0;
      
      while (validPokemons.length < count && 
             sequentialAttempts < maxRetries && 
             !abortSignal?.aborted) {
        
        const extraPokemon = await fetchSinglePokemon(collectedIds, abortSignal);
        
        if (extraPokemon && !collectedIds.has(extraPokemon.id)) {
          collectedIds.add(extraPokemon.id);
          validPokemons.push(extraPokemon);
          
          if (enableProgress) {
            setProgress({ 
              current: Math.min(validPokemons.length, count), 
              total: count 
            });
          }
          
          setPokemons([...validPokemons]);
        }
        
        sequentialAttempts++;
      }
      
      // Resultado final
      const finalPokemons = validPokemons.slice(0, count);
      setPokemons(finalPokemons);
      
      if (enableProgress) {
        setProgress({ current: finalPokemons.length, total: count });
      }
      
      console.log(`✅ Coletados ${finalPokemons.length} Pokémons únicos`);
      
    } catch (error) {
      if (!abortSignal?.aborted) {
        console.error('Erro ao coletar Pokémons:', error);
        setError(error.message);
      }
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  };

  /**
   * Função para buscar novos Pokémons manualmente
   */
  const refetch = () => {
    setPokemons([]);
    collectPokemons();
  };

  /**
   * Função para adicionar mais Pokémons aos existentes
   */
  const fetchMore = async (additionalCount = count) => {
    const currentIds = new Set(pokemons.map(p => p.id));
    
    setLoading(true);
    
    try {
      const newPokemons = [];
      let attempts = 0;
      const maxAttempts = additionalCount * 2;
      
      while (newPokemons.length < additionalCount && attempts < maxAttempts) {
        const pokemon = await fetchSinglePokemon(currentIds);
        
        if (pokemon && !currentIds.has(pokemon.id)) {
          currentIds.add(pokemon.id);
          newPokemons.push(pokemon);
          setPokemons(prev => [...prev, pokemon]);
        }
        
        attempts++;
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Effect principal
  useEffect(() => {
    if (!autoFetch) return;
    
    const abortController = new AbortController();
    collectPokemons(abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [count, autoFetch]);

  return {
    // Estados
    pokemons,
    loading,
    error,
    progress,
    
    // Funções
    refetch,
    fetchMore,
    
    // Utilitários
    cacheStats: PokemonCache.getStats(),
    clearCache: PokemonCache.clear,
    cleanExpiredCache: PokemonCache.cleanExpired
  };
}