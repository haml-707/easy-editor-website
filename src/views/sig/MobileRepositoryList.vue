<script setup lang="ts">
import { useLangStore } from '@/stores';
import { useI18n } from 'vue-i18n';

defineProps({
  data: {
    type: Array as () => any[],
    default: () => [],
  },
});

const lang = useLangStore().lang;

const { t } = useI18n();
</script>
<template>
  <div
    v-for="(item, index) in data"
    :key="item.repo"
    class="block-content"
    :class="index % 2 ? '' : 'bg-color'"
  >
    <div class="block-detail">
      <p>{{ t('sig.SIG_DETAIL.REPOSITORY_NAME') }}:</p>
      <a :href="`https://gitee.com/${item.repo}`">
        {{ item.repo }}
      </a>
      <p>Maintainer:</p>
      <p>{{ item.maintainers.join(lang === 'zh' ? '、' : ',&nbsp;') }}</p>
      <p>Committer:</p>
      <p>{{ item.gitee_id.join(lang === 'zh' ? '、' : ',&nbsp;') }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.block-content {
  padding: var(--o-spacing-h5);
  font-size: var(--o-font-size-tip);
  line-height: var(--o-line-height-tip);
  .block-detail {
    display: grid;
    grid-template-columns: 70px auto;
    grid-row-gap: var(--o-spacing-h8);
  }
}
.bg-color {
  background-color: var(--o-color-bg4);
}
</style>
