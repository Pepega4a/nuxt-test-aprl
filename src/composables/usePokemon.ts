import { ref, computed } from 'vue';
import axios from 'axios';

export function usePokemon() {
  const pokemonList = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPokemon = async () => {
    loading.value = true;
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
      pokemonList.value = response.data.results;
    } catch (err) {
      error.value = 'Ошибка загрузки данных';
    } finally {
      loading.value = false;
    }
  };

  return {
    pokemonList,
    loading,
    error,
    fetchPokemon,
  };
}
