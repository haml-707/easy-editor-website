<script lang="ts" setup>
import SummitBanner from './components/SummitBanner.vue';
import SummitLive from './components/SummitLive.vue';
import SummitSchedule from './components/SummitSchedule.vue';
import SummitGuests from './components/SummitGuests.vue';
import SummitPartner from './components/SummitPartner.vue';
</script>
<template>
  <div class="demo">
    <SummitBanner />
    <SummitLive />
    <SummitSchedule />
    <SummitGuests />
    <SummitPartner/>
  </div>
</template>

<style scoped lang="scss">
.demo {
  padding: var(--o-gap-7) 0;
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-5) 0;
  overflow: hidden;
}
</style>
