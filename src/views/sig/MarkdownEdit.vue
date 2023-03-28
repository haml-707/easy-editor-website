<script setup lang="ts">
import { computed, ref, inject, Ref, nextTick } from 'vue';

import { usePageData } from '@/stores';

import OIcon from '@/components/OIcon.vue';

import IconDone from '~icons/app/icon-done.svg';
import IconClose from '~icons/app/icon-close.svg';

const props = defineProps({
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
  markdownId: {
    type: String,
    default: '',
  },
});

const modeType = inject('modeType') as Ref<boolean>;
const isEditStyle = computed(() => {
  return !modeType.value;
});
const textareaRef = ref();
const previewShown = ref('');

const emit = defineEmits(['update:modelValue', 'handle-del', 'auto-save']);

// computed
const tempData = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

function hanleChangePreview(val: string, isFallback: boolean) {
  if (
    JSON.stringify(usePageData().tempData.get(props.markdownId)) !==
      JSON.stringify(usePageData().pageData.get(props.markdownId)) &&
    !val
  ) {
    // 内容有修改且和原数据不同自动保存
    emit('auto-save');
  }
  if (!isFallback) {
    try {
      tempData.value[val] = JSON.parse(
        JSON.stringify(usePageData().tempData.get(props.markdownId)[val])
      );
    } catch (error) {
      console.log(error);
    }
  }
  if (!previewShown.value) {
    nextTick(() => {
      textareaRef.value.focus();
    });
  }
  previewShown.value = val;
}
function delFloor() {
  emit('handle-del');
}
function onBlurEvent() {
  setTimeout(() => {
    hanleChangePreview('', true);
  }, 200);
}
</script>
<template>
  <div class="markdown-edit editable-floor">
    <div class="markdown-title" @click="hanleChangePreview('title', true)">
      <h2 class="title" :class="isEditStyle ? 'is-edit' : ''">
        <span class="title-text">
          <el-input
            v-model="tempData.title"
            :readonly="!isEditStyle || previewShown !== 'title'"
            placeholder="输入楼层标题"
            maxlength="100"
            @blur="hanleChangePreview('', true)"
          >
          </el-input>
        </span>
      </h2>
      <div v-if="previewShown === 'title' && isEditStyle" class="icon-box">
        <OIcon>
          <IconDone />
          <span class="save">保存修改</span>
        </OIcon>
        <OIcon @click.stop="hanleChangePreview('title', false)">
          <IconClose /> <span class="close">放弃修改</span>
        </OIcon>
      </div>
    </div>
    <div class="markdown-body">
      <div
        v-show="isEditStyle && previewShown === 'content'"
        class="edit-textarea"
        @click="hanleChangePreview('content', true)"
      >
        <el-input
          ref="textareaRef"
          v-model="tempData.content"
          :readonly="!isEditStyle"
          :autosize="{ minRows: 4, maxRows: 20 }"
          placeholder="输入markdown编辑页面"
          maxlength="1000"
          show-word-limit
          type="textarea"
          @blur="onBlurEvent"
          @focus="hanleChangePreview('content', true)"
        >
        </el-input>
      </div>
      <MdStatement
        v-show="!(isEditStyle && previewShown === 'content')"
        class="markdown-main"
        :class="isEditStyle ? 'border' : ''"
        :statement="modelValue.content"
        @click="isEditStyle ? hanleChangePreview('content', true) : ''"
      ></MdStatement>
      <div v-if="previewShown === 'content' && isEditStyle" class="icon-box">
        <OIcon>
          <IconDone />
          <span class="save">保存修改</span>
        </OIcon>
        <OIcon @click="hanleChangePreview('content', false)">
          <IconClose />
          <span class="close">放弃修改</span>
        </OIcon>
      </div>
      <div v-show="isEditStyle" class="del-dox" @click="delFloor"></div>
    </div>
  </div>
</template>

<style lang="scss">
.del-dox {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(calc(-50%));
  right: -140px;
  width: 48px;
  height: 48px;
  background-color: var(--o-color-bg2);
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
    box-shadow: none !important;
    input {
      min-height: 56px !important;
      &[readonly] {
        cursor: text;
        padding: 0;
        box-shadow: none;
        border: none;
        &:focus-visible {
          border: none;
          box-shadow: none;
          outline: none;
        }
      }
    }
  }
}

.markdown-body {
  position: relative;
  padding: 24px;
  margin-top: 40px;
  background-color: var(--o-color-bg2);
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);

  .markdown-main {
    padding: 16px;
    border: 1px solid transparent;
    height: 100%;
    overflow: auto;
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
      background: #ccc;
    }
  }
}
.border {
  transition: all 0.3s;
  &:hover {
    border: 1px solid var(--o-color-brand1);
  }
}

.markdown-edit {
  .markdown-title {
    position: relative;
    .el-input {
      .el-input__wrapper {
        box-shadow: none;
      }
    }
  }
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
    background-color: var(--o-color-bg2);
    .el-textarea {
      textarea {
        overflow: auto;
        padding: 16px;
        padding-right: 100px;
        &::-webkit-scrollbar-track {
          border-radius: 4px;
        }

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #ccc;
        }
      }
    }
  }
  .icon-box {
    position: absolute;
    right: -48px;
    gap: 8px 0;

    display: flex;
    flex-direction: column;
    .o-icon {
      position: relative;
      cursor: pointer;
      // TODO:
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      font-size: 24px;
      border: 1px solid #555;
      &:hover {
        color: inherit;
        span {
          display: block;
        }
      }
      &:first-child {
        background-color: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
      .save,
      .close {
        display: none;
        position: absolute;
        transform: translate(100%, -50%);
        color: #555;
        width: max-content;
        right: -8px;
        top: 50%;
        font-size: var(--o-font-size-tip);
        padding: 4px 8px;
        background-color: var(--o-color-bg2);
        box-shadow: var(--o-shadow-1);
      }
    }
  }
}
.markdown-title {
  .is-edit {
    .el-input {
      .el-input__wrapper {
        &:hover {
          border: 1px solid var(--o-color-brand1);
          box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
        }
      }
      .is-focus {
        border: none !important;
        box-shadow: 0 0 0 1px var(--o-color-brand1) inset !important;
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
    font-size: 40px;
    font-weight: 300;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: none;
    &:hover {
      z-index: 10;
    }
    .el-input__inner {
      color: var(--o-color-neutral10) !important;
    }
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
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    @media screen and (max-width: 768px) {
      top: 8px;
      font-size: var(--o-font-size-h8);
      line-height: var(--o-line-height-h8);
    }
  }
}
</style>
