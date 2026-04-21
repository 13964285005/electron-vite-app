<template>
  <div class="home-container">
    <MapView />
    <div class="overlay-panel" :class="{ collapsed: isCollapsed }">
      <div class="panel-content">
        <SensorChart />
      </div>
      <button class="collapse-btn" @click="toggleCollapse" :title="isCollapsed ? '展开' : '收起'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline v-if="!isCollapsed" points="15 18 9 12 15 6"></polyline>
          <polyline v-else points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapView from '../components/MapView.vue'
import SensorChart from '../components/SensorChart.vue'

const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.overlay-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 380px;
  z-index: 100;
  pointer-events: auto;
  transition: transform 0.5s ease;
}

.overlay-panel.collapsed {
  transform: translateX(-360px);
}

.panel-content {
  width: calc(100% - 36px);
}

.collapse-btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 36px;
  height: 48px;
  background: rgba(10, 25, 41, 0.9);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 0 12px 12px 0;
  color: #00e5ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(0, 229, 255, 0.2);
}
</style>