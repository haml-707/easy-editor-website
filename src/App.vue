<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { watch, computed } from 'vue';
import AppHeader from './components/AppHeader.vue';
import { useRoute } from 'vue-router';

import { useLangStore } from '@/stores';
import EditDisplayZone from '@/views/edit/EditDisplayZone.vue';

const route = useRoute();
const { locale } = useI18n();
const langStore = useLangStore();
const isEditPage = computed(() => {
  return route.name === 'edit';
});

watch(
  () => langStore.lang,
  (val) => {
    locale.value = val;
  }
);
</script>

<template>
  <div id="app">
    <header><AppHeader /></header>
    <main :class="isEditPage ? 'edit-page' : ''">
      <EditDisplayZone />
      <RouterView class="content"></RouterView>
    </main>
    <footer></footer>
  </div>
</template>

<style lang="scss" scoped>
#app {
  background-position: center top;
  background-size: 100% auto;
  background-repeat: repeat;
  background-color: var(--o-color-bg1);

  background-image: url(./assets/common/bg/bg.jpg);
}

main {
  position: relative;
  margin: 40px auto 0;
  max-width: 1416px;
  width: calc(100% - 88px);
  height: 100%;
  min-height: calc(100vh - 80px);
  overflow: hidden;

  @media (max-width: 1100px) {
    margin-top: 48px;
  }
}
.edit-page {
  max-width: 100%;
  width: 100%;
  background-color: var(--o-color-bg1);
  > .content {
    max-width: 1504px;
    margin: 0 auto;
    // padding: 0 40px;
  }
}
</style>
