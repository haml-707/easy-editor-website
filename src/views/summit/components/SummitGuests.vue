<script setup lang="ts">
import { computed, ref } from 'vue';
import guest from '../data/guest';
const props = defineProps({
  lecturerList: {
    type: Object,
    required: true,
    default: () => null,
  },
  shape: {
    type: String,
    default: 'circle',
  },
  webColumnsNum: {
    type: Number,
    default: 4,
  },
  mobileColumnsNum: {
    type: Number,
    default: 2,
  },
});
const lecturerList = ref(guest.guestListKv.guestList);
const summitStyle = computed(() => {
  return {
    '--shape': props.shape,
    '--webColumnsNum':
      props.webColumnsNum < 1
        ? 4
        : props.webColumnsNum > 8
        ? 8
        : props.webColumnsNum,
    '--mobileColumnsNum':
      props.mobileColumnsNum < 1
        ? 1
        : props.mobileColumnsNum > 2
        ? 2
        : props.mobileColumnsNum,
  };
});
</script>

<template>
  <h2>操作系统产业峰会嘉宾</h2>
  <div class="lecturer-list" :style="(summitStyle as any)">
    <div
      v-for="item in lecturerList"
      :key="item.name"
      class="lecturer-list-item"
    >
      <div
        :class="
          summitStyle['--shape'] === 'square'
            ? 'lecturer-list-item-square'
            : 'lecturer-list-item-circle'
        "
      >
        <img :src="item.img" />
      </div>
      <p>{{ item.name }}</p>
      <div
        v-for="titleItem in item.position"
        :key="titleItem"
        class="lecturer-list-item-title"
      >
        <p>{{ titleItem }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dark img {
  filter: brightness(0.8) grayscale(0.2) contrast(1.2);
}
h2 {
  text-align: center;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
}
.lecturer-list {
  margin: var(--o-spacing-h2) auto;
  display: flex;
  flex-wrap: wrap;
  // grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  @media (max-width: 780px) {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
  .lecturer-list-item {
    width: 354px;
    padding-bottom: 24px;
    @media (max-width: 780px) {
      width: 100%;
      margin: 0 auto;
    }
    .lecturer-list-item-square {
      display: block;
      height: 130px;
      width: 130px;
      overflow: hidden;
      position: relative;
      left: 10%;
      img {
        width: 190px;
        height: 190px;
        position: relative;
        bottom: 20%;
        right: 25%;
      }
    }
    .lecturer-list-item-circle {
      img {
        width: 120px;
        height: 120px;
        margin: 0 auto;
        display: block;
        @media (max-width: 780px) {
          width: 95px;
          height: 95px;
        }
      }
    }
    // &:nth-of-type(1){
    //   margin-top: 20px;
    // }
    p {
      font-size: var(--o-spacing-h5);
      color: var(--o-color-brand1);
      text-align: center;
      margin-top: 8px;
      @media (max-width: 780px) {
        margin-top: 6px;
      }
    }
    .lecturer-list-item-title {
      margin-bottom: var(--o-spacing-h8);
      &:nth-last-of-type(1) {
        margin-bottom: var(--o-spacing-h4);
      }
      p {
        color: var(--o-color-text1);
        font-size: var(--o-font-size-text);
        font-weight: 400;
        line-height: var(--o-line-height-text);
        @media (max-width: 780px) {
          font-size: var(--o-font-size-tip);
          line-height: var(--o-line-height-tip);
        }
      }
      @media (max-width: 780px) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
