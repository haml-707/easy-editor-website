<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconCancel from '~icons/app/icon-close.svg';

import { useVersionData } from '@/stores';

import { getReleaseVersion } from '@/api/api-easy-edit';

interface VersionData {
  statusCode: number;
  data: number[];
}

const route = useRoute();
const { locale } = useI18n();

const sigDetailName = ref(route.params.name as string);
const versionData = ref<number[]>();

const path = ref(
  `https://www.openeuler.org/${locale.value}/sig/sig-detail/?name=${sigDetailName.value}`
);

function getVersionData() {
  getReleaseVersion(path.value).then((res: VersionData) => {
    if (res.statusCode === 200) {
      versionData.value = res.data.reverse();
      versionData.value.unshift(-1);
    }
  });
}
getVersionData();
const activeVersion = ref();

const emit = defineEmits(['change-switch', 'change-select']);
const isPreviewMode = ref(false);
function handleChangeSwitch() {
  emit('change-switch', isPreviewMode.value);
  if (useVersionData().isCoverLatest && isPreviewMode.value) {
  } else {
    console.log('show diglog');
  }
}
function handleChangeSelect() {
  useVersionData().setVersionData(activeVersion.value);
  if (activeVersion.value !== -1) {
    isPreviewMode.value = true;
    handleChangeSwitch();
    useVersionData().setCoverData(false);
  }
}
handleChangeSwitch();
</script>
<template>
  <div class="edit-dispaly-zone">
    <div class="empty"></div>
    <div class="control-box">
      <div class="edit-switch">
        <span :class="!isPreviewMode ? 'active-switch' : ''">编辑模式</span
        ><el-switch
          v-model="isPreviewMode"
          @change="handleChangeSwitch"
        ></el-switch
        ><span :class="isPreviewMode ? 'active-switch' : ''">预览模式</span>
      </div>
      <div class="revision-history">
        <span class="label">历史版本回退</span>
        <el-select v-model="activeVersion" @change="handleChangeSelect">
          <el-option
            v-for="(item, index) in versionData"
            :key="item"
            :label="index === 0 ? 'Latest' : `Version ${item}`"
            :value="item"
          >
            <div class="customer-option">
              <span class="version">{{
                index === 0 ? 'Latest' : `Version ${item}`
              }}</span>
              <span class="time"></span>
            </div>
          </el-option>
        </el-select>
      </div>
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
  justify-content: space-between;
  .empty {
    width: 154px;
  }
  .control-box {
    .revision-history {
      margin-top: 16px;
      display: flex;
      align-items: center;
      color: var(--o-color-white);
      .label {
        margin-right: 8px;
      }
      .el-select {
        width: 288px;
        .el-input__wrapper {
          padding: 3px 16px;
        }
      }
    }
    .edit-switch {
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
