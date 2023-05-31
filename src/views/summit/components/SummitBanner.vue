<script setup lang="ts">
import bannerSummitMo from '../img/banner-summit_mo.jpg';
import bannerSummitPc from '../img/banner-summit_pc.jpg';
</script>
<template>
  <div class="banner">
    <div
      class="summit-banner-pc"
      :style="{ backgroundImage: `url(${bannerSummitPc})` }"
    ></div>
    <img :src="bannerSummitMo" alt="" />
  </div>
</template>
<style scoped lang="scss">
.banner {
  width: 100%;
  height: 380px;
  .summit-banner-pc {
    height: 380px;
    margin: 0 auto;
    background: no-repeat center/cover;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  img {
    width: 100%;
    display: none;
    @media screen and (max-width: 768px) {
      display: inline-block;
    }
  }
}
</style>
