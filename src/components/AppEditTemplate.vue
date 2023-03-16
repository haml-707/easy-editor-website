<script lang="ts" setup>
import { inject } from 'vue';
import AppFooter from '@/components/AppFooter.vue';

import { getAllDataByPath } from '@/api/api-easy-edit';
import { usePageData } from '@/stores';

const modeType = inject('modeType');
getAllDataByPath(
  'https://www.openeuler.org/zh/sig/sig-detail/?name=sig-OpenDesign'
).then((res) => {
  usePageData().setPageData(res.data);
});
</script>
<template>
  <div class="edit-template">
    <slot></slot>
    <AppFooter />
    <div :class="!modeType ? 'mask' : ''"></div>
    <div id="dialog" width="100%">555</div>
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
