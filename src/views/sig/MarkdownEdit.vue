<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePageData } from '@/stores';

import IconEdit from '~icons/app/icon-edit.svg';
import OIcon from '@/components/OIcon.vue';

import IconDone from '~icons/app/icon-done.svg';
import IconClose from '~icons/app/icon-close.svg';

const props = defineProps({
  markdownData: {
    type: Object as any,
    default: () => {
      return {};
    },
  },
  modelValue: {
    type: Object as any,
    default: () => {
      return {};
    },
  },
  isEditStyle: {
    type: Boolean,
    default: false,
  },
});
const previewShown = ref('');

const editType = ref({
  title: false,
  content: false,
});

const emit = defineEmits(['update:modelValue', 'handle-del']);

const tempData = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});
function hanleChangePreview(val: string, isFallback: boolean) {
  if (!isFallback) {
    tempData.value[val] = JSON.parse(
      JSON.stringify(usePageData().tempData.get('markdown')[val])
    );
  }
  previewShown.value = val;
}
function delFloor() {
  emit('handle-del');
}
</script>
<template>
  <div class="markdown-edit editable-floor">
    <div class="markdown-title">
      <el-input
        v-model="tempData.title"
        :class="!isEditStyle || previewShown === 'title' ? 'is-edit' : ''"
        :readonly="!isEditStyle || previewShown === 'title'"
        placeholder="输入楼层标题"
      >
      </el-input>
      <div class="icon-box">
        <OIcon>
          <IconEdit
            v-if="previewShown === 'title'"
            @click="hanleChangePreview('', true)"
          />
          <IconDone v-else @click="hanleChangePreview('title', true)" />
        </OIcon>
        <OIcon @click="hanleChangePreview('title', false)">
          <IconClose />
        </OIcon>
      </div>
    </div>
    <div class="markdown-body">
      <MdStatement
        v-if="!isEditStyle || previewShown === 'content'"
        class="markdown-main"
        :statement="modelValue.content"
      ></MdStatement>
      <div v-else class="edit-textarea">
        <el-input
          v-model="tempData.content"
          :readonly="!isEditStyle"
          :autosize="{ minRows: 20, maxRows: 25 }"
          placeholder="输入markdown编辑页面"
          type="textarea"
        >
        </el-input>
      </div>
      <div class="icon-box">
        <OIcon>
          <IconEdit
            v-if="previewShown === 'content'"
            @click="hanleChangePreview('', true)"
          />
          <IconDone v-else @click="hanleChangePreview('content', true)" />
        </OIcon>
        <OIcon @click="hanleChangePreview('content', false)">
          <IconClose />
        </OIcon>
      </div>
    </div>

    <!-- <div
        v-show="!modeType"
        class="edit-floor square"
        @click="EditFloor(true, 'markdown')"
      >
        <OIcon>
          <IconEdit />
        </OIcon>
      </div> -->
    <!-- </div> -->
    <!-- <div v-else class="markdown-edit"></div> -->

    <div v-if="isEditStyle" class="icon-box"></div>
    <!-- <AppEditor v-model.string="tempData.content"> </AppEditor> -->
  </div>
  <div class="del-dox" @click="delFloor"></div>
</template>

<style lang="scss">
.el-dialog {
  background-color: var(--o-color-bg1);
}
.del-dox {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 40px;
  width: 64px;
  height: 64px;
  border: 1px solid #e02020;
  box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
  &::after {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    content: '';
    height: 4px;
    width: calc(100% - 36px);
    background-color: #e02020;
  }
}
:deep(.el-input) {
  .el-input__wrapper {
    input {
      min-height: 56px !important;
      &[readonly] {
        min-height: 21px !important;
        cursor: text;
        padding: 0;
        box-shadow: none;
        border: none;
        resize: none;
        &:focus-visible {
          border: none;
          box-shadow: none;
          outline: none;
        }
      }
    }
  }
}
.is-edit {
  .el-input__wrapper {
    box-shadow: none !important;
  }
}
.markdown-body {
  position: relative;
  .markdown-main {
    margin-top: 40px;
    padding: 40px;
  }
}
.markdown-edit {
  .el-input {
    height: 64px;
    font-size: 36px;
    .el-input__inner {
      height: 64px !important;
      text-align: center;
      font-weight: 300;
    }
  }
  .edit-textarea {
    margin-top: 40px;
    background-color: var(--o-color-bg2);
    .el-textarea {
      textarea {
        &::-webkit-scrollbar-track {
          border-radius: 4px;
          background-color: var(--o-color-bg2);
        }

        &::-webkit-scrollbar {
          width: 6px;
          background-color: var(--o-color-bg2);
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: var(--o-color-division1);
        }
      }
    }
  }
  .icon-box {
    position: absolute;
    top: 0;
    right: -48px;
    gap: 8px 0;

    display: flex;
    flex-direction: column;
    .o-icon {
      // TODO:
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      font-size: 40px;
      border: 1px solid #555;
      &:hover {
        color: inherit;
      }
      &:first-child {
        background-color: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
    }
  }
}
.title {
  display: flex;
  align-items: center;
  font-weight: 300;
  text-align: center;
  position: relative;
  height: 64px;
  @media screen and (max-width: 768px) {
    height: 30px;
  }
  .title-bg {
    color: var(--o-color-neutral10);
    font-size: 40px;
    font-weight: 300;
    @media screen and (max-width: 768px) {
      font-size: var(--o-font-size-h8);
    }
  }
  .title-text {
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
    position: absolute;
    z-index: 1;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    @media screen and (max-width: 768px) {
      top: 8px;
      font-size: var(--o-font-size-h8);
      line-height: var(--o-line-height-h8);
    }
  }
}
</style>
