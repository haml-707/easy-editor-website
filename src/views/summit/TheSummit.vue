<script lang="ts" setup>
import { ref } from 'vue';
import SummitSchedule from './components/SummitSchedule.vue';
import AppEditTemplate from '@/components/AppEditTemplate.vue';
import { usePageData } from '@/stores';

import data from '@/data';

// const scheduleData = ref(
//   usePageData().pageData.get('schedule')?.content
//     ? JSON.parse(usePageData().pageData.get('schedule').content)
//     : data
// );
// const scheduleData1 = ref(
//   usePageData().pageData.get('schedule')?.content
//     ? JSON.parse(usePageData().pageData.get('schedule1').content)
//     : data
// );
</script>
<template>
  <AppEditTemplate>
    <div class="edit-summit">
      <h3>会议日程</h3>

      <SummitSchedule schedule-name="schedule-20" />
      <SummitSchedule schedule-name="schedule" />
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
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
  @media (max-width: 1680px) {
    max-width: 1300px;
  }
  h3 {
    position: relative;
    text-align: center;
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
  }
}
</style>
