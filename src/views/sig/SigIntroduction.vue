<script setup lang="ts">
import { computed, ref } from 'vue';
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
    tempData.value = JSON.parse(
      JSON.stringify(usePageData().tempData.get('introduction'))
    );
  }
  previewShown.value = val;
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
      <div v-if="isEditStyle && previewShown" class="edit-box">
        <el-input
          v-model="tempData.content"
          :readonly="!isEditStyle"
          :autosize="{ minRows: 2, maxRows: 20 }"
          placeholder="输入markdown编辑页面"
          maxlength="100"
          type="textarea"
        >
        </el-input>
      </div>
      <MdStatement
        v-else
        :class="isEditStyle ? 'border' : ''"
        :statement="tempData.content"
        class="markdown-main"
        @click="isEditStyle ? hanleChangePreview(true) : ''"
      ></MdStatement>
      <div v-if="isEditStyle && previewShown" class="icon-box">
        <OIcon>
          <IconDone @click="hanleChangePreview(false)" />
        </OIcon>
        <OIcon @click="hanleChangePreview(false, true)">
          <IconClose />
        </OIcon>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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
    @media screen and (max-width: 768px) {
      margin-top: var(--o-spacing-h6);
      font-size: var(--o-font-size-tip);
      line-height: var(--o-line-height-tip);
    }
  }
}
</style>
