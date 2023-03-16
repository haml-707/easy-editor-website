<script lang="ts" setup>
import { inject } from 'vue';
import AppFooter from '@/components/AppFooter.vue';

const modeType = inject('modeType');
</script>
<template>
  <div class="edit-template">
    <slot></slot>
    <AppFooter />
    <div :class="!modeType ? 'mask' : ''"></div>
  </div>
</template>

<style scoped lang="scss">
.edit-template {
  position: relative;
}
.mask {
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba($color: #fff, $alpha: 0.44);
}
</style>
