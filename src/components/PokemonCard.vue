<script setup lang="ts">
defineProps<{
  pokemon: {
    name: string;
    url: string;
  };
}>();
</script>

<template>
  <div class="card">
    <h3>{{ pokemon.name }}</h3>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.171);
}
</style>
