<script setup lang="ts">
import { usePokemonStore } from "~/store/pokemon";
import { onMounted } from "vue";

const store = usePokemonStore();

onMounted(() => {
  store.fetchPokemon();
});
</script>

<template>
  <div class="container">
    <input v-model="store.searchQuery" placeholder="Pokemon search..." class="search" />

    <button @click="store.toggleFAQ()" class="faq-button">FAQ</button>

    <div v-if="store.showFAQ" class="modal">
      <div class="modal-content">
        <h2>How to use the search?</h2>
        <p><strong>By name:</strong> enter the name of the Pokémon (for example, <code>pikachu</code>).</p>
        <p><strong>By type:</strong> enter the type (for example, <code>grass</code>, <code>fire</code>).</p>
        <p><strong>By ability:</strong> enter the name of the ability (for example, <code>overgrow</code>).</p>
        <p><strong>By stats:</strong> use <code>stat: value</code> (for example, <code>speed: 100</code>).</p>
        <p><strong>By height:</strong> <code>height: value</code> (for example, <code>height: 7</code>).</p>
        <p><strong>By weight:</strong> <code>weight: value</code> (for example, <code>weight: 90</code>).</p>
        <p><strong>Combined search:</strong> list the parameters separated by commas (for example,
          <code>fire, speed: 120</code>).
        </p>
        <button @click="store.toggleFAQ()" class="close-button">Close</button>
      </div>
    </div>

    <div class="buttons">
      <button @click="store.viewMode = 'grid'; store.currentPage = 1">Grid</button>
      <button @click="store.viewMode = 'list'; store.currentPage = 1">List</button>
    </div>

    <strong>Loaded Pokemon: {{ store.pokemonList.length }} из {{ store.totalPokemon }}</strong>

    <div class="pagination">
      <button :disabled="store.currentPage <= 1" @click="store.currentPage--">←</button>
      <strong style="margin: 5px;">{{ store.currentPage }}</strong>
      <button :disabled="store.currentPage * (store.viewMode === 'grid' ? 66 : 5) >= store.pokemonList.length"
        @click="store.currentPage++">→</button>
      <button v-if="store.pokemonList.length != store.totalPokemon" @click="store.loadMore()">Upload another page (66
        pokemons)</button>
    </div>

    <div :class="store.viewMode">
      <PokemonCard v-for="pokemon in store.paginatedPokemon" :key="pokemon.name" :pokemon="pokemon"
        @click="store.selectPokemon(pokemon.name)" />
    </div>


    <div v-if="store.isLoading" class="loading-indicator">
      <div class="spinner" />
    </div>

    <Modal v-if="store.selectedPokemon" :show="true" @close="store.closeModal">
      <h2>{{ store.selectedPokemon.name }}</h2>
      <img :src="store.selectedPokemon.sprites.front_default" :alt="store.selectedPokemon.name" />

      <h3>Attributes:</h3>
      <p><strong>Weight:</strong> {{ store.selectedPokemon.weight }}</p>
      <p><strong>Height:</strong> {{ store.selectedPokemon.height }}</p>
      <p><strong>Types:</strong> {{ store.selectedPokemon.types.map(t => t.type.name).join(', ') }}</p>

      <h3>Stats:</h3>
      <ul>
        <li v-for="stat in store.selectedPokemon.stats" :key="stat.stat.name">
          <strong>{{ stat.stat.name }}</strong>: {{ stat.base_stat }}
        </li>
      </ul>

      <h3>Abilities:</h3>
      <ul>
        <li v-for="ability in store.selectedPokemon.abilities" :key="ability.ability.name">
          {{ ability.ability.name }}
        </li>
      </ul>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

$border-radius: 10px;
$primary-color: #ffcc00;
$danger-color: #ff4444;

.container {
  padding: 20px;
}

.search {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: $border-radius;
}

.buttons {
  margin-bottom: 10px;

  button {
    padding: 10px;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: color.adjust($primary-color, $lightness: 10%);
    }
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    padding: 8px 12px;
    border-radius: $border-radius;
    background-color: $primary-color;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: color.adjust($primary-color, $lightness: -10%);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}

.faq-button {
  margin-left: 10px;
  padding: 10px;
  border-radius: $border-radius;
  background-color: $primary-color;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  &-content {
    background: white;
    padding: 20px;
    border-radius: $border-radius;
    width: 400px;
  }
}

.close-button {
  margin-top: 10px;
  padding: 10px;
  border-radius: $border-radius;
  background-color: $danger-color;
  cursor: pointer;
  color: white;
}

.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .spinner {
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-top: 8px solid #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>