import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  name: string;
  url: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

export const usePokemonStore = defineStore("pokemon", () => {
  const pokemonList = ref<Pokemon[]>([]);
  const detailedPokemonList = ref<PokemonDetails[]>([]);
  const searchQuery = ref<string>("");
  const selectedPokemon = ref<PokemonDetails | null>(null);
  const viewMode = ref<"grid" | "list">("grid");
  const limit = ref<number>(66);
  const totalPokemon = ref<number>(0);
  const currentPage = ref<number>(1);
  const isLoading = ref<boolean>(false);

  const fetchPokemon = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit.value}`);
      pokemonList.value = response.data.results;
      totalPokemon.value = response.data.count;
      
      const detailsPromises = response.data.results.map(async (pokemon: Pokemon) => {
        const detailsResponse = await axios.get(pokemon.url);
        return detailsResponse.data;
      });
      detailedPokemonList.value = await Promise.all(detailsPromises);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const filteredPokemon = computed(() =>
    detailedPokemonList.value.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.types.some(t => t.type.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  );

  const selectPokemon = (name: string) => {
    selectedPokemon.value = detailedPokemonList.value.find(p => p.name === name) || null;
  };

  const closeModal = () => {
    selectedPokemon.value = null;
  };

  const loadMore = async () => {
    if (limit.value < totalPokemon.value) {
      isLoading.value = true;
      limit.value = Math.min(limit.value + 66, totalPokemon.value)
      await fetchPokemon();
      isLoading.value = false;
    }
  };

  const paginatedPokemon = computed(() => {
    if (viewMode.value === "grid") {
      return filteredPokemon.value.slice((currentPage.value - 1) * 66, currentPage.value * 66);
    }
    return filteredPokemon.value.slice((currentPage.value - 1) * 5, currentPage.value * 5);
  });

  return {
    pokemonList,
    detailedPokemonList,
    searchQuery,
    fetchPokemon,
    filteredPokemon,
    selectedPokemon,
    selectPokemon,
    closeModal,
    loadMore,
    viewMode,
    limit,
    totalPokemon,
    currentPage,
    paginatedPokemon,
    isLoading
  };
});
