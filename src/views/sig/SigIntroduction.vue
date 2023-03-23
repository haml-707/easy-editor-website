<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@/stores';

import OIcon from '@/components/OIcon.vue';

import IconDone from '~icons/app/icon-done.svg';
import IconClose from '~icons/app/icon-close.svg';
import IconGitee from '~icons/app/icon-gitee.svg';

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
});

const textareaRef = ref();
const emit = defineEmits(['update:modelValue']);
const tempData = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const previewShown = ref(true);

function hanleChangePreview(val: boolean, isFallback?: boolean) {
  if (isFallback) {
    console.log(isFallback);

    try {
      tempData.value = JSON.parse(
        JSON.stringify(usePageData().tempData.get('introduction'))
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
function onBlurEvent() {
  setTimeout(() => {
    hanleChangePreview(false);
  }, 200);
}
const route = useRoute();
const sigDetailName = ref(route.params.name as string);
</script>
<template>
  <div class="brief-introduction">
    <h2 class="brief-introduction-title">
      {{ sigDetailName }}
      <a
        :href="`https://gitee.com/openeuler/community/tree/master/sig/${sigDetailName}`"
        target="_blank"
      >
        <OIcon class="icon"> <IconGitee /> </OIcon
      ></a>
    </h2>
    <div class="sig-introduction">
      <div v-show="isEditStyle && previewShown" class="edit-box">
        <el-input
          ref="textareaRef"
          v-model="tempData.content"
          :readonly="!isEditStyle"
          :autosize="{ minRows: 2, maxRows: 20 }"
          placeholder="输入markdown编辑页面"
          maxlength="1000"
          show-word-limit
          type="textarea"
          @blur="onBlurEvent"
          @focus="hanleChangePreview(true)"
        >
        </el-input>
      </div>
      <MdStatement
        v-show="!(isEditStyle && previewShown)"
        :class="isEditStyle ? 'border' : ''"
        :statement="tempData.content"
        class="markdown-main"
        @click.stop="isEditStyle ? hanleChangePreview(true) : ''"
      ></MdStatement>
      <div v-if="isEditStyle && previewShown" class="icon-box">
        <OIcon>
          <IconDone @click="hanleChangePreview(false)" />
          <span class="save">保存修改</span>
        </OIcon>
        <OIcon @click="hanleChangePreview(false, true)">
          <IconClose /> <span class="close">放弃修改</span>
        </OIcon>
      </div>
    </div>
    <div v-if="isEditStyle" class="edit-mask"></div>
  </div>
</template>

<style lang="scss">
.edit-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #fff, $alpha: 0.72);
}
.border {
  &:hover {
    border: 1px solid var(--o-color-brand1);
  }
}
@mixin section-box {
  margin-top: var(--o-spacing-h2);
  background-color: var(--o-color-bg2);
  padding: var(--o-spacing-h2);
  @media screen and (max-width: 768px) {
    margin-top: var(--o-spacing-h5);
    padding: var(--o-spacing-h5);
  }
}
.markdown-main {
  min-height: 24px;
  border: 1px solid transparent;
  padding: 16px;
}
.el-dialog {
  background-color: var(--o-color-bg1);
}
.icon-box {
  position: absolute;
  top: 0;
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
.brief-introduction {
  position: relative;
  box-shadow: var(--o-shadow-l2);
  @include section-box;
  .brief-introduction-title {
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
    display: flex;
    align-items: center;
    padding: 0 16px;
    @media screen and (max-width: 768px) {
      font-size: var(--o-font-size-h8);
      line-height: var(--o-line-height-h8);
    }
    a {
      margin-left: var(--o-spacing-h4);
      font-size: var(--o-font-size-h5);
      display: flex;
      align-items: center;
      @media screen and (max-width: 768px) {
        margin-left: var(--o-spacing-h6);
        font-size: var(--o-font-size-h8);
      }
    }
  }
  .sig-introduction {
    position: relative;
    margin-top: var(--o-spacing-h5);
    font-size: var(--o-font-size-text);
    line-height: 22px;
    color: var(--o-color-text3);
    position: relative;
    z-index: 11;
    textarea {
      padding: 16px;
    }
    @media screen and (max-width: 768px) {
      margin-top: var(--o-spacing-h6);
      font-size: var(--o-font-size-tip);
      line-height: var(--o-line-height-tip);
    }
  }
}
</style>
