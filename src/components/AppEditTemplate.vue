<script lang="ts" setup>
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppFooter from '@/components/AppFooter.vue';

import { getAllDataByPath } from '@/api/api-easy-edit';
import { usePageData } from '@/stores';

const route = useRoute();

const sigDetailName = ref(route.params.name as string);

const path = ref(
  `https://www.openeuler.org/zh/sig/sig-detail/?name=${sigDetailName.value}`
);

const modeType = inject('modeType');
getAllDataByPath(path.value).then((res) => {
  usePageData().setPageData(res.data);
});
</script>
<template>
  <div class="edit-template">
    <slot></slot>
    <AppFooter />
    <div id="edit-dialog" :class="!modeType ? 'mask' : ''"></div>
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
  background: rgba($color: #fff, $alpha: 0.24);
}
</style>
