<script lang="ts" setup>
import { ref } from 'vue';

// import { useRoute } from 'vue-router';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconCancel from '~icons/app/icon-close.svg';

const emit = defineEmits(['switch-change']);
const isPreviewMode = ref(false);
function handleChange() {
  emit('switch-change', isPreviewMode.value);
}
handleChange();
</script>
<template>
  <div class="edit-dispaly-zone">
    <div class="edit-switch">
      <span :class="!isPreviewMode ? 'active-switch' : ''">编辑模式</span
      ><el-switch v-model="isPreviewMode" @change="handleChange"></el-switch
      ><span :class="isPreviewMode ? 'active-switch' : ''">预览模式</span>
    </div>
    <div class="edit-close">
      <router-link to="/">
        <OButton
          >退出编辑
          <template #suffixIcon>
            <OIcon>
              <IconCancel />
            </OIcon>
          </template>
        </OButton>
      </router-link>
      <p>退出编辑将不保存任何修改</p>
    </div>
  </div>
</template>

<style lang="scss">
.edit-dispaly-zone {
  display: flex;
  padding: 0 44px;
  max-width: 1504px;
  margin: 20px auto 26px;
  // @media (max-width: 1680px) {
  //   max-width: 1300px;
  // }
  .edit-switch {
    margin-left: 154px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--o-color-info3);
    span {
      transition: color 0.3;
    }
    .el-switch {
      margin: 0 8px;
      --el-switch-on-color: #e5e8f0;
      --el-switch-off-color: #feb32a;
    }
  }
  .active-switch {
    color: var(--o-color-text2);
  }
  .edit-close {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: var(--o-font_size-tip1);
    color: var(--o-color-text2);
    .o-button {
      color: var(--o-color-white);
      border-color: var(--o-color-white);
    }
    p {
      margin-top: 8px;
    }
  }
}
</style>
