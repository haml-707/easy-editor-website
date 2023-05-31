<script setup lang="ts">
import { useAttrs, ref } from 'vue';
import partner from '../data/partner';

const attrs = useAttrs();
const props = withDefaults(
  defineProps<{
    row?: number;
  }>(),
  {
    row: 4,
  }
);
const linkList: any = ref(partner.partnerList[0].logoList);
</script>

<template>
  <h2>{{ partner.partnerList[0].subTitle }}</h2>
  <div class="picture-panel" v-bind="attrs">
    <img
      v-for="item in linkList"
      :key="item.img"
      class="link-item"
      :src="item.img"
    />
  </div>
</template>

<style scoped lang="scss">
h2 {
  text-align: center;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
}
.picture-panel {
  display: grid;
  grid-template-columns: repeat(v-bind('props.row'), minmax(82px, 1fr));
  column-gap: 0;
  row-gap: 0;
  .link-item {
    background-color: var(--o-color-bg2);
    max-height: 120px;
    overflow: hidden;
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid var(--o-color-division1);
  }
  @media screen and (max-width: 1416px) {
    grid-template-columns: repeat(v-bind('(props.row)-1'), minmax(82px, 270px));
    justify-content: center;
    .link-item {
      min-height: 40px;
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(v-bind('(props.row)-2'), minmax(82px, 270px));
  }
}
</style>
