<template>
  <div class="home-container">
    <MapView />
  </div>
</template>

<script setup lang="ts">
import MapView from '../components/MapView.vue'
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>