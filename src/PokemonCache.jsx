// services/PokemonCache.js

/**
 * Serviço de cache para Pokémons da PokéAPI
 * Implementa cache em memória + localStorage conforme regra da API
 */
export class PokemonCache {
  static storage = new Map();
  static CACHE_DURATION = 3600000; // 1 hora em millisegundos
  
  /**
   * Busca um Pokémon no cache
   * @param {number} id - ID do Pokémon
   * @returns {Object|null} - Dados do Pokémon ou null se não encontrado/expirado
   */
  static get(id) {
    // Primeiro verifica cache em memória
    const cached = this.storage.get(id);
    if (cached && this.isValid(cached)) {
      return cached.data;
    }
    
    // Se não encontrou na memória, tenta localStorage
    const fromStorage = this.loadFromLocalStorage(id);
    if (fromStorage) {
      return fromStorage;
    }
    
    return null;
  }
  
  /**
   * Salva um Pokémon no cache
   * @param {number} id - ID do Pokémon
   * @param {Object} data - Dados do Pokémon
   */
  static set(id, data) {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    
    // Salva na memória
    this.storage.set(id, cacheEntry);
    
    // Salva no localStorage para persistência
    try {
      localStorage.setItem(
        `pokemon_${id}`, 
        JSON.stringify(cacheEntry)
      );
    } catch (error) {
      console.warn('Não foi possível salvar no localStorage:', error);
    }
  }
  
  /**
   * Verifica se um item do cache ainda é válido
   * @param {Object} cached - Item do cache com timestamp
   * @returns {boolean} - true se ainda válido
   */
  static isValid(cached) {
    return (Date.now() - cached.timestamp) < this.CACHE_DURATION;
  }
  
  /**
   * Carrega um Pokémon do localStorage
   * @param {number} id - ID do Pokémon
   * @returns {Object|null} - Dados do Pokémon ou null
   */
  static loadFromLocalStorage(id) {
    try {
      const stored = localStorage.getItem(`pokemon_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.isValid(parsed)) {
          // Se válido, coloca na memória também
          this.storage.set(id, parsed);
          return parsed.data;
        } else {
          // Se expirado, remove do localStorage
          localStorage.removeItem(`pokemon_${id}`);
        }
      }
    } catch (error) {
      console.warn(`Erro ao carregar pokemon ${id} do localStorage:`, error);
      // Remove item corrompido
      localStorage.removeItem(`pokemon_${id}`);
    }
    return null;
  }
  
  /**
   * Obtém estatísticas do cache
   * @returns {Object} - Estatísticas do cache
   */
  static getStats() {
    return {
      memoryCache: this.storage.size,
      localStorageItems: Object.keys(localStorage).filter(key => 
        key.startsWith('pokemon_')
      ).length,
      cacheHitRate: this.calculateHitRate()
    };
  }
  
  /**
   * Calcula taxa de acertos do cache (aproximada)
   */
  static calculateHitRate() {
    // Implementação simples - você pode melhorar isso
    const total = this.storage.size;
    return total > 0 ? Math.min(total / 100, 1) * 100 : 0;
  }
  
  /**
   * Limpa cache expirado
   */
  static cleanExpired() {
    const now = Date.now();
    
    // Limpa cache da memória
    for (const [id, cached] of this.storage.entries()) {
      if (!this.isValid(cached)) {
        this.storage.delete(id);
      }
    }
    
    // Limpa localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('pokemon_')) {
        try {
          const stored = JSON.parse(localStorage.getItem(key));
          if (!this.isValid(stored)) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove itens corrompidos
          localStorage.removeItem(key);
        }
      }
    });
    
    console.log('🧹 Cache expirado limpo');
  }
  
  /**
   * Limpa todo o cache
   */
  static clear() {
    this.storage.clear();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('pokemon_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Cache completamente limpo');
  }
}