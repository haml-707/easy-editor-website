<script setup lang="ts">
import {
  ref,
  nextTick,
  onMounted,
  computed,
  reactive,
  PropType,
  watch,
} from 'vue';

import { isValidKey, isBrowser } from '@/shared/utils';
import { TableData, DayData } from '@/shared/@types/type-calendar';
import { useI18n } from 'vue-i18n';
import { usePageData } from '@/stores';

import { OButton } from '@/components/button';
import MdStatement from '@/components/MdStatement.vue';
import OIcon from '@/components/OIcon.vue';

import IconArrowRight from '~icons/app/icon-arrow-right.svg';
import IconDown from '~icons/app/icon-chevron-down.svg';
import IconDone from '~icons/app/icon-done.svg';
import IconClose from '~icons/app/icon-close.svg';

import notFoundImg from '@/assets/common/404/404.png';

import useWindowResize from '@/components/hooks/useWindowResize';
import { getSigMember } from '@/api/api-sig';

const props = defineProps({
  tableData: {
    type: Array as PropType<TableData[]>,
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

const textareaRef = ref();
const emit = defineEmits(['update:modelValue']);
const tempData = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const previewShown = ref(true);

async function hanleChangePreview(val: boolean, isFallback?: boolean) {
  console.log(6);
  console.log(isFallback);

  if (isFallback) {
    try {
      tempData.value = JSON.parse(
        JSON.stringify(usePageData().tempData.get('meeting'))
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

const { t } = useI18n();

let currentMeet = reactive<TableData>({
  date: '',
  timeData: [],
});

const renderData = ref<TableData>({
  date: '',
  timeData: [],
});

const currentDay = ref('');
const activeName = ref('');
const isCollapse = ref(false);

const detailItem = [
  { text: '会议详情', key: 'detail', isLink: false },
  { text: '发起人', key: 'creator', isLink: false },
  { text: '会议日期', key: 'date', isLink: false },
  { text: '会议时间', key: 'duration_time', isLink: false },
  { text: '会议ID', key: 'meeting_id', isLink: false },
  { text: '会议链接', key: 'join_url', isLink: true },
  { text: 'Etherpad链接', key: 'etherpad', isLink: true },
  { text: '活动介绍', key: 'synopsis', isLink: false },
  { text: '起始日期', key: 'start_date', isLink: false },
  { text: '结束日期', key: 'end_date', isLink: false },
  { text: '活动形式', key: 'activity_type', isLink: false },
  { text: '线上链接', key: 'online_url', isLink: true },
  { text: '报名链接', key: 'register_url', isLink: true },
  { text: '活动地点', key: 'address', isLink: false },
  { text: '回放链接', key: 'replay_url', isLink: true },
  { text: '回放链接', key: 'video_url', isLink: true },
];
const activityType = ['线下', '线上', '线上 + 线下'];

const windowWidth = ref(useWindowResize());

function setMeetingDay() {
  currentMeet = JSON.parse(JSON.stringify(props.tableData)).pop();
  if (currentMeet && currentMeet.date) {
    renderData.value = currentMeet;
    currentDay.value = resolveDate(currentMeet.date);
  }
}
// 判断会议时间修改提示
const isActive = ref(false);

function handleTimeTip(item: DayData) {
  const startTime = new Date(
    currentMeet.date + ' ' + item.startTime + ':00'
  ).getTime();
  const endTime = new Date(
    currentMeet.date + ' ' + item.endTime + ':00'
  ).getTime();
  const newDate = new Date().getTime();
  if (newDate > startTime && newDate < endTime) {
    isActive.value = true;
    return '正在进行';
  } else if (newDate < startTime) {
    isActive.value = true;
    return '即将开始';
  } else {
    isActive.value = false;
    return '精彩回顾';
  }
}
onMounted(() => {
  setMeetingDay();
});
function goDetail(index: number) {
  window.open(
    `/zh/interaction/event-list/detail/?id=${renderData.value.timeData[index].id}&isMini=1`
  );
}
function changeCollapse() {
  isCollapse.value = !isCollapse.value;
}
const resolveDate = (date: string) => {
  const reg = /(\d{4})\-(\d{2})\-(\d{2})/;
  date = date.replace(reg, '$1年$2月$3日');
  if (date.charAt(5) === '0') {
    date = date.substring(6);
  } else {
    date = date.substring(5);
  }
  return date;
};
const sigDetailName = ref('');
const oldEmail = ref('');
function getOldEmail() {
  const param = {
    community: 'openeuler',
    sig: sigDetailName.value,
  };
  getSigMember(param)
    .then((res: any) => {
      if (res?.data[0]) {
        oldEmail.value = res.data[0].mailing_list;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}
function getUrlParam(paraName: any) {
  const url = document.location.toString();
  const arrObj = url.split('?');
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&');
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');
      if (arr !== null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return '';
  } else {
    return '';
  }
}
onMounted(() => {
  sigDetailName.value = getUrlParam('name');
  getOldEmail();
});
const watchData = watch(
  () => props.tableData.length,
  () => {
    if (isBrowser()) {
      nextTick(() => {
        const activeBoxs = document.querySelector(
          '.is-today .out-box'
        ) as HTMLElement;
        if (activeBoxs) {
          activeBoxs.click();
          watchData();
        }
        textareaRef.value.focus();
      });
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="meeting">
    <h2>
      <span class="title-bg">{{
        t('sig.SIG_DETAIL.ORGANIZING_MEETINGS_BG')
      }}</span>
      <span class="title-text">{{
        t('sig.SIG_DETAIL.ORGANIZING_MEETINGS')
      }}</span>
    </h2>
    <div class="main-body">
      <div class="communication-info">
        <div class="info-head">
          {{ t('sig.SIG_DETAIL.COMMUNICATION_INFO') }}
        </div>
        <div class="info-body">
          <h5>{{ t('sig.SIG_DETAIL.MAIL_LIST') }}</h5>
          <p class="email">
            <span>{{ t('sig.SIG_DETAIL.MAIL_LIST') }}:</span>
            <a
              :href="
                oldEmail ? `mailto:${oldEmail}` : `mailto:dev@openeuler.org`
              "
              >{{ oldEmail || 'dev@openeuler.org' }}</a
            >
          </p>
          <h5 class="meeting-title">{{ t('sig.SIG_DETAIL.MEETING_TITLE') }}</h5>
          <div class="meeting-tip">
            <div v-show="isEditStyle && previewShown" class="edit-box">
              <el-input
                ref="textareaRef"
                v-model="tempData.content"
                :autofocus="true"
                :readonly="!isEditStyle"
                :autosize="{ minRows: 2, maxRows: 3 }"
                placeholder="输入markdown编辑页面"
                maxlength="1000"
                show-word-limit
                type="textarea"
                @focus="hanleChangePreview(true)"
              >
              </el-input>
            </div>
            <MdStatement
              v-show="!(isEditStyle && previewShown)"
              :statement="tempData.content"
              :class="isEditStyle ? 'border' : ''"
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
            <OButton class="view-history" animation type="text"
              >查看历史会议纪要
              <template #suffixIcon>
                <OIcon>
                  <IconArrowRight></IconArrowRight>
                </OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>
      <div class="detail-list">
        <div class="detail-head">
          {{ t('sig.SIG_DETAIL.LATEST_MEETING') + ':' }}
          <span>{{ currentDay }}</span>
        </div>
        <div class="meeting-list">
          <div
            v-if="
              (renderData.timeData.length && renderData.date) ||
              renderData.timeData.length
            "
            class="demo-collapse"
          >
            <el-collapse
              v-model="activeName"
              accordion
              @change="changeCollapse()"
            >
              <div
                v-for="(item, index) in renderData.timeData"
                :key="item.id"
                class="collapse-box"
              >
                <el-collapse-item :name="index">
                  <template #title>
                    <div class="meet-item">
                      <div class="meet-left">
                        <div class="left-top">
                          <p class="meet-name">{{ item.name || item.title }}</p>
                          <p
                            class="time-tip"
                            :class="{ 'active-tip': isActive }"
                          >
                            {{ handleTimeTip(item) }}
                          </p>
                        </div>
                        <div
                          v-if="item.group_name"
                          class="group-name more-detail"
                        >
                          {{ t('sig.SIG_DETAIL.SIG_GROUP') }}
                          {{ item.group_name }}
                        </div>
                        <div v-else class="group-name more-detail">
                          openEuler
                        </div>
                      </div>
                      <div class="item-right">
                        <OButton
                          v-if="item.schedules"
                          animation
                          type="text"
                          @click.stop="goDetail(index)"
                        >
                          {{ t('sig.SIG_DETAIL.LEARN_MORE') }}
                          <template #suffixIcon>
                            <OIcon><icon-arrow-right></icon-arrow-right></OIcon>
                          </template>
                        </OButton>
                        <div class="detail-time">
                          <span class="start-time"
                            ><i v-if="!item.schedules">{{ item.startTime }}</i>
                            <i v-else>{{ item.schedules[0].start }}</i></span
                          >
                          <span v-if="windowWidth < 768">-</span>
                          <span class="end-time">
                            <i v-if="!item.schedules">{{ item.endTime }}</i>
                            <i v-else>{{
                              item.schedules[item.schedules.length - 1].end
                            }}</i>
                          </span>
                        </div>
                        <div class="extend">
                          <OIcon
                            :class="{
                              reversal:
                                isCollapse && activeName == index.toString(),
                            }"
                          >
                            <icon-down></icon-down>
                          </OIcon>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="meet-detail">
                    <template v-for="keys in detailItem" :key="keys.key">
                      <div
                        v-if="isValidKey(keys.key, item) && item[keys.key]"
                        class="meeting-item"
                      >
                        <div class="item-title">{{ keys.text }}:</div>
                        <p
                          v-if="
                            !keys.isLink &&
                            keys.key !== 'activity_type' &&
                            keys.key !== 'date'
                          "
                        >
                          {{ item[keys.key] }}
                        </p>
                        <p
                          v-else-if="
                            keys.isLink &&
                            item[keys.key] &&
                            !(item[keys.key] as string).startsWith('http')
                          "
                        >
                          {{ item[keys.key] }}
                        </p>
                        <a
                          v-else-if="keys.isLink"
                          :href="item[keys.key]"
                          target="_blank"
                          >{{ item[keys.key] }}</a
                        >
                        <p
                          v-else-if="
                            keys.key === 'activity_type' && item.activity_type
                          "
                        >
                          {{ activityType[item.activity_type - 1] }}
                        </p>
                        <p v-else>{{ currentDay }}</p>
                      </div>
                    </template>
                    <div v-if="item.schedules" class="mo-learn-more">
                      <OButton
                        animation
                        size="mini"
                        type="outline"
                        @click.stop="goDetail(index)"
                      >
                        {{ t('sig.SIG_DETAIL.LEARN_MORE') }}
                        <template #suffixIcon>
                          <OIcon><icon-arrow-right></icon-arrow-right></OIcon>
                        </template>
                      </OButton>
                    </div>
                  </div>
                </el-collapse-item>
              </div>
            </el-collapse>
          </div>
          <div v-else class="empty">
            <img :src="notFoundImg" alt="" />
            <p>{{ t('sig.SIG_DETAIL.EMPTY_TEXT') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isEditStyle" class="edit-mask"></div>
  </div>
</template>
<style lang="scss" scoped>
.edit-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #fff, $alpha: 0.72);
}
@mixin title {
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
    font-weight: 400;
    position: absolute;
    // z-index: 1;
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
h2 {
  @include title;
}
.meeting {
  position: relative;
}

:deep(.el-textarea) {
  textarea {
    padding: 16px;
    min-height: 56px !important;
    &[readonly] {
      min-height: 21px !important;
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
.border {
  &:hover {
    border: 1px solid var(--o-color-brand1);
  }
}
.meeting-tip {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: relative;
  // max-height: 80px;
  .edit-box {
    z-index: 1;
  }
  .icon-box {
    position: absolute;
    top: 0;
    right: -48px;
    gap: 8px 0;
    z-index: 1;

    display: flex;
    flex-direction: column;
    .o-icon {
      position: relative;
      cursor: pointer;
      &:hover {
        span {
          display: block;
        }
      }

      // TODO:
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      font-size: 24px;
      border: 1px solid #555;
      &:hover {
        color: inherit;
      }
      &:first-child {
        background-color: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
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
.o-icon .calendar-title {
  text-align: center;
  font-size: var(--o-font-size-h3);
  font-weight: 400;
}
.left-title {
  display: flex;
  margin-bottom: var(--o-spacing-h2);
  align-items: center;
  height: 40px;
  font-size: var(--o-font-size-h8);
  .disable {
    cursor: not-allowed;
    color: var(--o-color-text5);
    &:hover {
      color: var(--o-color-text5);
    }
  }
  .o-icon {
    font-size: var(--o-font-size-h5);
    color: var(--o-color-text1);
  }
}
.month-date {
  color: var(--o-color-text1);
  padding: 0 var(--o-spacing-h8);
}
@media screen and (max-width: 768px) {
  .month-date {
    font-size: var(--o-font-size-tip);
  }
  .left-title {
    display: none;
  }
}
:deep(.title-list) {
  display: flex;
  .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  }
  .el-tabs__item {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .title-item {
    cursor: pointer;
    padding: 12px;
    &:hover {
      color: var(--o-color-brand1);
    }
  }
  .active {
    background-color: var(--o-color-brand1);
    color: var(--o-color-text2) !important;
  }
}
.o-icon {
  cursor: pointer;
  font-size: var(--o-font-size-h7);
  transition: color 0.2s;
  &:hover {
    // color: var(--o-color-brand1);
    // svg {
    //   color: var(--o-color-brand2);
    //   fill: var(--o-color-brand2);
    // }
  }
}
.markdown-main {
  position: relative;
  z-index: 11;
  min-height: 24px;
  border: 1px solid transparent;
}
.main-body {
  margin-top: 40px;
  display: flex;
  box-shadow: var(--o-shadow-l2);
  .communication-info {
    max-width: 456px;
    width: 100%;
    background-color: var(--o-color-bg2);
    @media screen and (max-width: 768px) {
      max-width: 100%;
    }
    .info-head {
      line-height: 21px;
      padding: var(--o-spacing-h6);
      text-align: center;
      color: var(--o-color-text4);
      background-color: var(--o-color-bg4);
      @media screen and (max-width: 768px) {
        padding: var(--o-spacing-h8) 0;
        font-size: var(--o-font-size-tip);
      }
    }
    .info-body {
      padding: var(--o-spacing-h4) 24px;
      background-color: var(--o-color-bg2);
      // overflow-y: scroll;
      min-height: 274px;
      @media screen and (max-width: 768px) {
        padding: var(--o-spacing-h5);
        font-size: var(--o-font-size-tip);
        min-height: 0;
      }
      h5 {
        padding: 0 16px;
        font-size: var(--o-font-size-h6);
        line-height: var(--o-line-height-h6);
        font-weight: 400;
        color: var(--o-color-text1);
        @media screen and (max-width: 768px) {
          font-size: var(--o-font-size-text);
          line-height: var(--o-line-height-text);
        }
      }

      p,
      .meeting-tip {
        margin-top: var(--o-spacing-h5);
        font-size: var(--o-font-size-text);
        line-height: var(--o-line-height-tip);
        color: var(--o-color-text4);
        @media screen and (max-width: 768px) {
          margin-top: var(--o-spacing-h8);
          font-size: var(--o-font-size-tip);
          line-height: var(--o-line-height-tip);
        }
      }
      .meeting-tip {
        margin-top: 0;
      }
      p {
        padding: 0 16px;
      }
      .view-history {
        padding: 0 16px;
        .o-icon {
          color: var(--o-color-brand1);
        }
      }
      .meeting-title {
        margin-top: var(--o-spacing-h4);
        @media screen and (max-width: 768px) {
          margin-top: var(--o-spacing-h6);
        }
      }
    }
  }

  :deep(.el-calendar) {
    --el-calendar-border: 1px solid var(--o-color-border2);
    background-color: var(--o-color-bg1);
    .el-collapse-item__content {
      padding: 0;
      background-color: transparent;
    }
    .el-calendar__header {
      display: block;
      padding: 0;
      border: none;
      @media screen and (max-width: 768px) {
        background-color: var(--o-color-bg2);
        .left-title {
          margin: 0;
        }
      }
    }
    .el-calendar__body {
      background-color: var(--o-color-bg2);
      th {
        color: var(--o-color-text4);
      }
    }
  }

  .collapse-box-mo {
    .left-title {
      display: none;
    }
  }
  @media screen and (max-width: 768px) {
    display: block;
    .collapse-box-mo {
      margin: var(--o-spacing-h6) 0;
      :deep(.el-collapse-item) {
        background-color: var(--o-color-bg2);
        padding: 0 var(--o-spacing-h8);
        .el-icon {
          font-size: var(--o-font-size-text);
          font-weight: 700;
          transform: rotate(90deg);
          color: var(--o-color-text1);
        }
        .el-icon.is-active {
          transform: rotate(270deg);
        }
        .el-collapse-item__header {
          height: 34px;
          border: none;
          background-color: var(--o-color-bg2);
        }
        .el-collapse-item__wrap {
          background-color: #e5e8f0;
          border: 0;
          .el-collapse-item__content {
            padding: 0;
          }
        }
        .meet-detail {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .left-title {
            display: flex;
            padding: var(--o-spacing-h8) var(--o-spacing-h1);
            align-items: center;
            justify-content: space-between;
            svg {
              cursor: pointer;
              width: 16px;
            }
          }
        }
      }
      .mo-collapse {
        display: flex;
        align-items: center;
        width: 100%;
        .o-icon {
          color: inherit;
          color: var(--o-color-text1);
          font-size: var(--o-font-size-h8);
        }
        .month-date {
          padding-left: 8px;
          font-size: var(--o-font-size-tip);
          line-height: 16px;
        }
      }
    }
  }
  :deep(.calendar) {
    width: 100%;
    max-width: 500px;
    flex-shrink: 0;
    text-align: center;
    thead {
      th {
        text-align: center;
      }
      background-color: var(--o-color-bg4);
    }
    @media screen and (max-width: 1100px) {
      max-width: 400px;
    }
    @media screen and (max-width: 768px) {
      max-width: 100%;
      display: none;
    }

    .is-today {
      .el-calendar-day {
        .day-box {
          color: var(--o-color-text4);
          background-color: var(--o-color-bg4);
        }
      }
    }

    .el-calendar__body {
      padding: 0;
      thead {
        height: 44px;
      }
      tbody {
        box-shadow: var(--o-shadow-l2);
      }
      .el-calendar-table__row {
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        font-size: var(--o-font-size-tip);
        .is-selected {
          background-color: transparent;
          .el-calendar-day {
            .day-box {
              background-color: var(--o-color-brand1);
              .date-calender {
                color: var(--o-color-text2);
              }
            }
          }
        }

        .el-calendar-day {
          display: flex;
          justify-content: center;
          padding: 0;
          height: 66px;
          &:hover {
            background-color: var(--o-color-bg1);
          }
          @media screen and (max-width: 768px) {
            background-color: inherit !important;
          }
          .out-box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          .be-active {
            position: relative;
            overflow: hidden;
          }
          .be-active::after {
            position: absolute;
            top: -6px;
            right: -6px;
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 0 0 0 20px;
            background-color: var(--o-color-brand2);
            @media screen and (max-width: 768px) {
              width: 12px;
              height: 12px;
              top: -4px;
              right: -4px;
              border-radius: 0 0 0 12px;
            }
          }
          .day-box {
            display: flex;
            box-sizing: border-box;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            align-items: center;
            .date-calender {
              line-height: var(--o-line-height-text);
              font-size: var(--o-font-size-h8);
              color: var(--o-color-text1);
            }
          }
        }
        @media screen and (max-width: 768px) {
          .el-calendar-day {
            height: 100%;
            .day-box {
              .date-calender {
                font-size: var(--o-font-size-tip);
              }
            }
          }
          .el-calendar-day::after {
            display: block;
            padding-top: 100%;
            content: '';
          }
        }
      }
    }
  }
  :deep(.detail-list) {
    flex: 1;
    background-color: var(--o-color-bg2);
    .right-title {
      display: flex;
      height: 40px;
      margin-bottom: var(--o-spacing-h2);
      justify-content: flex-end;
      @media screen and (max-width: 768px) {
        margin-bottom: 0;
        padding-bottom: var(--o-spacing-h5);
        justify-content: center;
        background-color: var(--o-color-bg2);
      }
      .el-tabs__header {
        margin: 0;
      }
    }
    .detail-head {
      line-height: 21px;
      padding: var(--o-spacing-h6);
      text-align: center;
      color: var(--o-color-text4);
      background-color: var(--o-color-bg4);
      @media screen and (max-width: 768px) {
        padding: var(--o-spacing-h8) 0;
        font-size: var(--o-font-size-tip);
      }
    }

    .meeting-list {
      padding: var(--o-spacing-h8) 0 0 var(--o-spacing-h8);
      min-height: 274px;
      background-color: var(--o-color-bg2);
      .el-collapse {
        border: none;
        --el-collapse-header-height: 96px;
        .collapse-box:last-child {
          .el-collapse-item {
            margin-bottom: 0;
          }
        }
        .el-collapse-item {
          margin-bottom: var(--o-spacing-h8);
          .el-collapse-item__header {
            padding-left: 0;
            border: none;
            height: 100%;
          }
        }
        .el-collapse-item__wrap {
          border: none;
          padding: var(--o-spacing-h6) var(--o-spacing-h5);
          background-color: #e5e8f0;
          @media screen and (max-width: 768px) {
            padding: var(--o-spacing-h6);
            background-color: var(--o-color-bg1);
            .el-collapse-item__content {
              background-color: var(--o-color-bg1);
            }
          }
        }
      }
      @media screen and (max-width: 768px) {
        padding: var(--o-spacing-h8);
        height: fit-content;
        overflow: auto;
      }
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
      .el-collapse-item__arrow {
        display: none;
      }
      .el-collapse-item__content {
        padding: 0;
        @media screen and (max-width: 768px) {
          font-size: var(--o-font-size-tip);
        }
      }
      .meet-item {
        display: flex;
        justify-content: space-between;
        padding: var(--o-spacing-h5);
        width: 100%;
        height: 100%;
        background-color: var(--o-color-bg3);
        border: 1px solid var(--o-color-bg3);
        border-left: 2px solid var(--o-color-brand1);
        .meet-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          .left-top {
            display: flex;
            align-items: center;
            .meet-name {
              margin-right: var(--o-spacing-h5);
              max-width: 400px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: var(--o-font-size-h7);
              color: var(--o-color-text1);
              line-height: var(--o-line-height-h7);
            }

            .time-tip {
              background-color: var(--o-color-neutral9);
              color: var(--o-color-black);
              font-size: var(--o-font-size-tip);
              line-height: var(--o-line-height-tip);
              white-space: nowrap;
              padding: 0 8px;
              &.active-tip {
                background-color: var(--o-color-yellow5);
              }
            }
            .el-collapse-item__content {
              padding: 0 20px;
            }
            p {
              margin: 0;
              height: fit-content;
              justify-content: center;
              align-items: center;
              line-height: normal;
            }
          }
          .more-detail {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            width: fit-content;
            height: 24px;
            font-size: var(--o-font-size-h8);
            line-height: var(--o-line-height-h8);
            @media screen and (max-width: 768px) {
              font-size: var(--o-font-size-text);
            }
            .o-icon {
              margin: 0 5px;
              color: var(--o-color-brand1);
              font-size: var(--o-font-size-h5);
              transition: all 0.3s;
              svg {
                color: var(--o-color-brand1);
              }
            }
            &:hover {
              .o-icon {
                transform: translateX(5px);
              }
            }
          }
        }
        .item-right {
          display: flex;
          font-size: var(--o-font-size-text);
          .o-button {
            flex-shrink: 0;
            padding: 0;
            .o-icon {
              color: var(--o-color-brand1);
              font-size: var(--o-font-size-h5);
            }
            &:hover {
              color: var(--o-color-brand1);
            }
            @media screen and (max-width: 768px) {
              display: none;
            }
          }

          .detail-time {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 var(--o-spacing-h5);
            font-weight: normal;
            text-align: center;
            font-size: var(--o-font-size-h8);
            span {
              line-height: var(--o-line-height-h8);
              i {
                font-style: normal;
              }
            }
          }
          .extend {
            display: flex;
            align-items: center;
            width: 24px;
            .o-icon {
              font-size: var(--o-font-size-h5);
              color: var(--o-color-text1);
              transition: all 0.3s;
            }
            .reversal {
              transform: rotate(180deg);
            }
          }
        }
        @media screen and (max-width: 768px) {
          background-color: var(--o-color-bg2);
          padding: var(--o-spacing-h6);
          border: 1px solid var(--o-color-division1);
          border-left: 2px solid var(--o-color-brand1);
          .meet-left {
            max-width: 200px;
            .left-top {
              .meet-name {
                font-size: var(--o-font-size-text);
                font-weight: 700;
              }
            }
            .group-name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: var(--o-font-size-tip);
              color: var(--o-color-text4);
            }
          }
          .item-right {
            .detail-time {
              flex-direction: row;
              align-items: flex-end;
              padding: 0 var(--o-spacing-h8);
              font-size: var(--o-font-size-tip);
            }
            .extend {
              align-items: flex-end;
              .o-icon {
                display: inline-block;
                height: var(--o-line-height-h8);
                line-height: var(--o-line-height-h8);
                font-size: var(--o-font-size-h8);
                svg {
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
      .meet-detail {
        color: var(--o-color-text4);
        .meeting-item {
          display: flex;
          padding-bottom: var(--o-spacing-h8);
          line-height: var(--o-line-height-tip);
          word-break: break-all;
          .item-title {
            flex-shrink: 0;
            width: 90px;
          }
          .creator {
            display: flex;
            align-items: center;
            .head-logo {
              width: 60px;
              border-radius: 50%;
              overflow: hidden;
            }
            .creator-name {
              padding-left: var(--o-spacing-h5);
              font-size: var(--o-font-size-text);
            }
          }
        }
        .mo-learn-more {
          display: none;
          @media screen and (max-width: 768px) {
            display: flex;
            justify-content: center;
            padding-top: var(--o-spacing-h8);
            border-top: 1px solid var(--o-color-division1);
            padding: var(--o-spacing-h5) 0 var(--o-spacing-h10);
            .o-button {
              padding: 3px var(--o-spacing-h6);
              .o-icon {
                font-size: var(--o-font-size-tip);
              }
            }
          }
        }
      }
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--o-color-text1);
      font-size: var(--o-font-size-h8);
      img {
        height: 186px;
      }
      p {
        margin-top: var(--o-spacing-h5);
      }
      @media screen and (max-width: 768px) {
        img {
          margin-top: var(--o-spacing-h5);
        }
        p {
          padding-bottom: var(--o-spacing-h5);
          font-size: var(--o-font-size-tip);
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .head-title {
    flex-direction: column;
    padding: 0;
  }
  .main-body {
    margin: 0 auto;
    align-items: center;
    flex-direction: column;
    background-color: var(--o-color-bg2);
  }
}
</style>
