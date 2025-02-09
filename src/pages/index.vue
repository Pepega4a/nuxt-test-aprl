<script setup lang="ts">
import { usePokemonStore } from "~/store/pokemon";
import { onMounted } from "vue";

const store = usePokemonStore();

onMounted(() => {
  store.fetchPokemon();
});

const setViewMode = (mode: "grid" | "list") => {
  store.viewMode = mode;
  store.currentPage = 1;
}
</script>

<template>
  <div class="container">
    <input v-model="store.searchQuery" placeholder="Поиск покемонов..." class="search" />

    <div class="buttons">
      <button @click="setViewMode('grid')">Сетка</button>
      <button @click="setViewMode('list')">Список</button>
    </div>

    <strong>Загружено покемонов: {{ store.pokemonList.length }} из {{ store.totalPokemon }}</strong>

    <div class="pagination">
      <button v-if="store.currentPage > 1" @click="store.currentPage--">Назад</button>
      <strong style="margin: 5px;">{{ store.currentPage }}</strong>
      <button v-if="store.currentPage * (store.viewMode === 'grid' ? 66 : 5) < store.totalPokemon && (store.viewMode === 'grid' ? store.limit > 66 * store.currentPage : true)"
        @click="store.currentPage++">Вперед</button>
      <button @click="store.loadMore()">Загрузить ещё одну страницу</button>
    </div>

    <div :class="store.viewMode">
      <PokemonCard v-for="pokemon in store.paginatedPokemon" :key="pokemon.name" :pokemon="pokemon"
        @click="store.selectPokemon(pokemon.name)" />
    </div>


    <div v-if="store.isLoading" class="loading-indicator">
      <div class="spinner"/>
    </div>

    <Modal v-if="store.selectedPokemon" :show="true" @close="store.closeModal">
      <h2>{{ store.selectedPokemon.name }}</h2>
      <img :src="store.selectedPokemon.sprites.front_default" :alt="store.selectedPokemon.name" />

      <h3>Атрибуты:</h3>
      <p><strong>Вес:</strong> {{ store.selectedPokemon.weight }}</p>
      <p><strong>Рост:</strong> {{ store.selectedPokemon.height }}</p>
      <p><strong>Тип:</strong> {{ store.selectedPokemon.types.map(t => t.type.name).join(', ') }}</p>

      <h3>Статы:</h3>
      <ul>
        <li v-for="stat in store.selectedPokemon.stats" :key="stat.stat.name">
          <strong>{{ stat.stat.name }}</strong>: {{ stat.base_stat }}
        </li>
      </ul>

      <h3>Способности:</h3>
      <ul>
        <li v-for="ability in store.selectedPokemon.abilities" :key="ability.ability.name">
          {{ ability.ability.name }}
        </li>
      </ul>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.search {
  width: 300px;
  padding: 8px;
  margin-bottom: 20px;
}

.buttons {
  margin-bottom: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.list {
  display: flex;
  flex-direction: column;
}

.pagination {
  margin-top: 20px;
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
}

.spinner {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
