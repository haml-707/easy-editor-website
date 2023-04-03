<script lang="ts" setup>
import SummitSchedule from './components/SummitSchedule.vue';
import AppEditTemplate from '@/components/AppEditTemplate.vue';
</script>
<template>
  <AppEditTemplate>
    <div class="edit-summit">
      <SummitSchedule />
    </div>
  </AppEditTemplate>
</template>

<style scoped lang="scss">
.edit-summit {
  position: relative;
  z-index: 11;
  padding: var(--o-gap-7) 0;
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-5) 0;
  overflow: hidden;
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
  @media (max-width: 1680px) {
    max-width: 1300px;
  }
}
</style>
