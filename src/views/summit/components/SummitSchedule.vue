<script lang="ts" setup>
import { ref, onMounted, Ref, inject, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// import { getPageData } from '@/api/api-easy-edit';
import { modifyFloorData } from '@/api/api-easy-edit';

import OIcon from '@/components/OIcon.vue';
import { OButton } from '@/components/button';

import IconAdd from '~icons/app/icon-add.svg';
import IconTime from '~icons/app/icon-time.svg';
import IconWarn from '~icons/edit/icon-warn.svg';

import { ElMessage } from 'element-plus';

import { usePageData } from '@/stores';

const { locale } = useI18n();

const modeType = inject('modeType') as Ref<boolean>;

const isEditStyle = computed(() => {
  return !modeType.value;
});

const scheduleDataTemp: any = ref({
  title: '12月28日 操作系统产业峰会 2022',
  content: [
    {
      lable: '上午：主论坛',
      id: window.crypto.randomUUID(),
      content: [
        {
          id: window.crypto.randomUUID(),
          name: '请填写标题',
          content: [
            {
              id: window.crypto.randomUUID(),
              time: ['14:00', '14:05'],
              desc: '',
              person: [
                {
                  id: window.crypto.randomUUID(),
                  name: '姓名',
                  post: 'XXX成员',
                },
                {
                  id: window.crypto.randomUUID(),
                  name: '姓名',
                  post: 'XXX成员',
                },
              ],
              detail: '描述5555',
            },
          ],
        },
      ],
    },
    {
      lable: '下午：分论坛',
      id: 1,
      content: [
        {
          id: 0,
          name: '麒麟软件',
          content: [
            {
              id: window.crypto.randomUUID(),
              time: ['14:00', '14:10'],
              desc: '欧拉社区领导致辞',
              person: [
                {
                  name: '冯冠霖',
                  post: '开放原子开源基金会秘书长',
                },
              ],
              detail: '描述',
            },
          ],
        },
        {
          id: 1,
          name: '麒麟信安',
          content: [
            {
              id: window.crypto.randomUUID(),
              time: ['14:00', '14:10'],
              desc: '致辞',
              person: [
                {
                  name: '任启',
                  post: '麒麟信安高级副总裁',
                },
              ],
              detail: '描述',
            },
          ],
        },
      ],
    },
  ],
});
const scheduleData = ref(
  usePageData().pageData.get('schedule')?.content
    ? JSON.parse(usePageData().pageData.get('schedule').content)
    : scheduleDataTemp.value
);

const dialogTopicTitle = ref('');

const dialogTopicContnet = ref('');
watch(
  () => usePageData().pageData.get('schedule'),
  () => {
    scheduleData.value = JSON.parse(
      usePageData().pageData.get('schedule').content
    );
  },
  {
    deep: true,
  }
);
const param = {
  content: '',
  name: 'schedule',
  description: '',
  path: 'https://www.openeuler.org/zh/interaction/summit-list/devday2023/',
  title: '',
  isPrivate: false,
  type: 'event',
  locale: locale.value,
  contentType: 'application/json;charset=UTF-8',
};

const delRowDialogVisiable = ref(false);

const delTabDialogVisiable = ref(false);

const agendaDialogVisiable = ref(false);

const delIndex = ref(0);
// 控制分论坛的详情弹窗显示
const indexShow: any = ref(-1);
const idShow: any = ref(-1);
function changeIndexShow(id: number, index: number) {
  idShow.value = id;
  indexShow.value = index;
}
// 控制主论坛及各个分论坛的显示
const tabType = ref(0);

const otherTabType = ref(0);
function tabClick() {
  otherTabType.value = 0;
}

function addSubtitle() {
  scheduleData.value.content.push({
    lable: '请输入论坛名称',
    id: window.crypto.randomUUID(),
    content: [
      {
        id: window.crypto.randomUUID(),
        name: '填写标题',
        content: [
          {
            id: window.crypto.randomUUID(),
            time: ['14:00', '14:05'],
            desc: 'XXX领导致辞',
            person: [
              {
                id: window.crypto.randomUUID(),
                name: '姓名',
                post: '',
              },
            ],
            detail: '描述',
          },
        ],
      },
    ],
  });
}
function delSubtitle(index: number) {
  scheduleData.value.content.splice(index, 1);
  tabType.value = 0;
}
// 增加一行表格
function addContent() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value
  ].content.push({
    time: ['14:00', '14:05'],
    desc: 'XXX领导致辞',
    person: [
      {
        name: '姓名',
        post: '',
      },
    ],
    detail: '描述',
  });
}
// 删除一行表格
function delContent(index: number) {
  delIndex.value = index;
  toggleDelDlg(true);
}
// 新增附属信息
function addPersonData(index: number) {
  scheduleData.value.content[tabType.value].content[otherTabType.value].content[
    index
  ].person.push({
    name: '',
    post: '',
  });
}
// 删除附属信息
function delPersonData(subIndex: number, personIndex: number) {
  if (
    scheduleData.value.content[tabType.value].content[otherTabType.value]
      .content[subIndex].person.length === 1
  ) {
    return false;
  }
  scheduleData.value.content[tabType.value].content[otherTabType.value].content[
    subIndex
  ].person.splice(personIndex, 1);
}
function confirmDelContent() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value
  ].content.splice(delIndex.value, 1);
  toggleDelDlg(false);
}
function confirmDelTab() {
  scheduleData.value.content[tabType.value].content.splice(delIndex.value, 1);
  otherTabType.value = delIndex.value === 0 ? 0 : delIndex.value - 1;
  toggleDelTabDlg(false);
}
// 删除分论坛标题
function delSubtitle2(index: number) {
  delIndex.value = index;
  toggleDelTabDlg(true);
}
// 增加分论坛标题
function addSubtitle2() {
  scheduleData.value.content[tabType.value].content.push({
    id: window.crypto.randomUUID(),
    name: '请填写标题',
    content: [
      {
        id: window.crypto.randomUUID(),
        time: ['14:00', '18:30'],
        desc: 'xxx领导致辞',
        person: [
          {
            id: window.crypto.randomUUID(),
            name: 'xxx',
            post: '',
          },
          {
            id: window.crypto.randomUUID(),
            name: 'xxx',
            post: '',
          },
        ],
        detail: '描述',
      },
    ],
  });
  const index = scheduleData.value.content[tabType.value].content.length;
  otherTabType.value = index === 0 ? 0 : index - 1;
}
// 保持页面数据
function savePageData() {
  param.content = JSON.stringify(scheduleData.value);
  modifyFloorData(param)
    .then((res: { statusCode: number }) => {
      if (res?.statusCode !== 200) {
        // 修改出错内容回显
        // getSingleFloorData(param.path, param.name).then((res: any) => {
        //   param.content = res?.data?.content;
        //   param.title = res?.data?.title;
        //   usePageData().pageData.set(param.name, param);
        // });
      } else {
        ElMessage({
          type: 'success',
          message: '保持成功',
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function toggleDelDlg(val: boolean) {
  delRowDialogVisiable.value = val;
}
function toggleAgendaDlg(val: boolean, listIndex?: number) {
  if (listIndex || listIndex === 0) {
    const targetData =
      scheduleData.value.content[tabType.value].content[otherTabType.value]
        .content[listIndex];
    dialogTopicContnet.value = targetData.detail;
    dialogTopicTitle.value = targetData.desc;
    idShow.value = listIndex;
  }
  agendaDialogVisiable.value = val;
}
function confirmSaveAgenda() {
  scheduleData.value.content[tabType.value].content[otherTabType.value].content[
    idShow.value
  ].detail = dialogTopicContnet.value;
  toggleAgendaDlg(false);
}
function toggleDelTabDlg(val: boolean) {
  delTabDialogVisiable.value = val;
}
// function createNewPage() {
//   createPage(param).then(() => {
//     ElMessage({
//       type: 'success',
//       message: '成功',
//     });
//   });
// }
onMounted(() => {
  // handleGetPageData();
});
</script>

<template>
  <div class="schedule" :class="isEditStyle ? 'is-edit' : ''">
    <h3>会议日程</h3>
    <h4 class="meeting-title">
      <el-input
        v-model="scheduleData.title"
        :readonly="!isEditStyle"
        type="text"
      />
    </h4>
    <el-tabs
      v-model.number="tabType"
      class="schedule-tabs"
      @tab-click="tabClick"
    >
      <template v-if="scheduleData.content?.length >= 2">
        <el-tab-pane
          v-for="(itemList, index) in scheduleData.content"
          :key="itemList.id"
          :name="index"
        >
          <template #label>
            <div class="one-level-tabs">
              <el-input
                v-model="itemList.lable"
                :readonly="!isEditStyle"
                type="text"
              />

              <span
                v-show="isEditStyle"
                class="icon-del del-title"
                @click.stop="delSubtitle(index)"
              ></span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane v-if="isEditStyle">
          <template #label>
            <OIcon
              class="icon-add"
              :class="scheduleData.content?.length ? 'margin-left' : ''"
              @click.stop="addSubtitle"
            >
              <IconAdd />
            </OIcon>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <el-container :level-index="1">
      <template
        v-for="(scheduleItem, index) in scheduleData.content"
        :key="scheduleItem.id"
      >
        <div
          v-show="tabType == index && scheduleItem?.content[0].content"
          class="schedule-item other"
        >
          <el-tabs
            v-if="isEditStyle || scheduleItem.content[1]"
            v-model.number="otherTabType"
            class="other-tabs"
          >
            <template v-if="scheduleItem.content[1]">
              <el-tab-pane
                v-for="(itemList, scheduleIndex) in scheduleItem.content"
                :key="itemList.id"
                :name="scheduleIndex"
              >
                <template #label>
                  <div class="time-tabs">
                    <el-input
                      v-model="itemList.name"
                      :readonly="!isEditStyle"
                      type="text"
                    />
                    <span
                      v-show="isEditStyle"
                      class="icon-del del-title"
                      @click.stop="delSubtitle2(scheduleIndex)"
                    ></span>
                  </div>
                </template>
              </el-tab-pane>
            </template>

            <el-tab-pane v-if="isEditStyle">
              <template #label>
                <OIcon
                  class="icon-add"
                  :class="scheduleItem.content.length ? 'margin-left' : ''"
                  @click.stop="addSubtitle2"
                >
                  <IconAdd />
                </OIcon>
              </template>
            </el-tab-pane>
          </el-tabs>
          <div
            v-for="(itemList, listIndex) in scheduleItem.content"
            v-show="tabType == index && otherTabType == listIndex"
            :key="itemList.id"
            class="content"
          >
            <!-- <h4 v-if="itemList.title || isEditStyle" class="other-title">
              <el-input
                v-model="itemList.title"
                :readonly="!isEditStyle"
                type="text"
                
              />
            </h4> -->
            <div class="content-list">
              <div
                v-for="(subItem, subIndex) in itemList.content"
                :key="subItem.id"
                class="content-item"
                :class="{
                  'show-detail': indexShow === subIndex && idShow === listIndex,
                }"
              >
                <span class="time">
                  <!-- <el-time-picker
                    v-model="subItem.time"
                    is-range
                    value-format="HH:mm"
                    :readonly="!isEditStyle"
                    format="HH:mm"
                    start-placeholder="Start"
                    end-placeholder="End"
                    @change="handleClose"
                  /> -->
                  <!-- {{ subItem.time }} -->
                  <IconTime />
                  <el-input
                    v-model="subItem.time[0]"
                    class="el-input-time"
                    :readonly="!isEditStyle"
                    type="text"
                  />
                  -
                  <el-input
                    v-model="subItem.time[1]"
                    class="el-input-time"
                    :readonly="!isEditStyle"
                    type="text"
                  />
                  <!-- {{ subItem.time[0] + '-' + subItem.time[1] }} -->
                </span>
                <span
                  class="desc"
                  :class="{ 'exit-detail': subItem.detail[0] }"
                  @click="
                    !isEditStyle
                      ? changeIndexShow(listIndex, subIndex as any)
                      : ''
                  "
                >
                  <el-input
                    v-model="subItem.desc"
                    :readonly="!isEditStyle"
                    type="text"
                  />
                  <OIcon
                    v-show="isEditStyle"
                    class="icon-add"
                    @click="toggleAgendaDlg(true, subIndex)"
                  >
                    <IconAdd />
                  </OIcon>
                </span>
                <div v-if="subItem.person[0]" class="name-box">
                  <div
                    v-for="(personItem, personIndex) in subItem.person"
                    :key="personItem.id"
                    class="name-item"
                  >
                    <span v-show="personItem.name" class="name">
                      <el-input
                        v-model="personItem.name"
                        :readonly="!isEditStyle"
                        placeholder="输入名称"
                        type="text"
                      />
                    </span>
                    <span class="post">
                      <label :for="`textarea${personIndex}`"></label>
                      <el-input
                        :id="`textarea${personIndex}`"
                        v-model="personItem.post"
                        :readonly="!isEditStyle"
                        :autosize="{ minRows: 1, maxRows: 10 }"
                        maxlength="100"
                        type="textarea"
                      />
                    </span>
                    <span
                      v-show="isEditStyle"
                      class="icon-del"
                      @click="delPersonData(subIndex, personIndex)"
                      ><span class="tip">删除附属信息</span></span
                    >
                  </div>
                  <OIcon
                    v-show="isEditStyle"
                    class="icon-add"
                    @click="addPersonData(subIndex)"
                  >
                    <span class="tip">新增附属信息</span>
                    <IconAdd />
                  </OIcon>
                </div>
                <div v-if="subItem.detail" class="detail">
                  <p>
                    <span>议题名称：</span><span> {{ subItem.desc }}</span>
                  </p>
                  <p v-if="subItem.detail">
                    <span>议题简介：</span
                    ><span
                      ><span class="detail-text">
                        {{ subItem.detail }}
                      </span></span
                    >
                  </p>
                  <!-- <p v-if="subItem.person[0]">
                    <span>发言人：</span>
                    <span
                      v-for="personItem in subItem.person"
                      :key="personItem.id"
                      >{{ personItem.name }}
                      <template v-if="personItem.post[0]">
                        <span>(</span>
                        <span>{{ personItem.post.split('\n') }}</span>
                        <span>)</span>
                      </template>
                    </span>
                  </p> -->
                </div>
                <div
                  v-show="
                    indexShow !== -1 && subItem.detail && idShow === listIndex
                  "
                  class="mask"
                  @click="changeIndexShow(-1, -1)"
                ></div>
                <span
                  v-if="isEditStyle"
                  class="icon-del del-content"
                  @click="delContent(subIndex)"
                ></span>
              </div>
            </div>
            <OIcon
              v-if="isEditStyle"
              class="icon-add add-content"
              @click="addContent"
            >
              <IconAdd />
            </OIcon>
          </div>
        </div>
      </template>
    </el-container>
  </div>
  <el-dialog
    v-model="agendaDialogVisiable"
    class="agenda-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <h3>编辑议题简介</h3>
    </template>
    <div class="line-input">
      <span class="label">议题名称</span>
      <el-input readonly v-model="dialogTopicTitle"></el-input>
    </div>
    <div class="line-input">
      <span class="label">议题简介</span>
      <el-input
        v-model="dialogTopicContnet"
        type="textarea"
        maxlength="300"
        show-word-limit
        :autosize="{ minRows: 12, maxRows: 20 }"
      ></el-input>
    </div>
    <template #footer>
      <o-button size="small" @click="toggleAgendaDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmSaveAgenda()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <el-dialog
    v-model="delRowDialogVisiable"
    class="publish-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <OIcon class="danger1">
        <IconWarn />
      </OIcon>
    </template>
    <h3>
      是否确认
      <span class="danger1">删除</span>
      本行
    </h3>
    <template #footer>
      <o-button size="small" @click="toggleDelDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmDelContent()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <el-dialog
    v-model="delTabDialogVisiable"
    class="publish-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <OIcon class="danger1">
        <IconWarn />
      </OIcon>
    </template>
    <h3>
      是否确认
      <span class="danger1">删除</span>
      本分论坛所有日程
    </h3>
    <template #footer>
      <o-button size="small" @click="toggleDelTabDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmDelTab()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <div class="contoral-box">
    <el-button @click="savePageData">保存</el-button>
  </div>
</template>

<style lang="scss" scoped>
.danger1 {
  color: #e02020;
}

:deep(.el-input) {
  .el-input__wrapper {
    border: 1px solid transparent;
    &:not(.is-focus) {
      box-shadow: none;
    }
    input {
      &[readonly] {
        cursor: text;
        padding: 0;
        box-shadow: none;
        border: 1px solid transparent;
        &:focus-visible {
          border: 1px solid transparent;
          box-shadow: none;
          outline: none;
        }
      }
    }
  }
}

.el-date-editor.el-input__wrapper {
  background-color: transparent;
}
.schedule {
  h3 {
    position: relative;
    text-align: center;
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
  }
  .meeting-title {
    margin-top: 40px;
    font-weight: 400;
    color: var(--o-color-text1);
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      line-height: 22px;
    }
    :deep(.el-input__inner) {
      font-size: var(--o-font-size-h6);
      text-align: center;
    }
  }
  :deep(.el-tabs) {
    .el-tabs__header.is-top .el-tabs__item.is-top {
      padding: 0;
    }
  }
  .schedule-tabs {
    position: relative;
    text-align: center;
    margin-top: 24px;
    :deep(.el-tabs__content) {
      overflow: visible;
      .el-button {
        position: absolute;
        left: 0;
        top: -75px;
        z-index: 1;
      }
    }
    :deep(.el-tabs__nav) {
      float: none;
      display: inline-block;
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__item {
        padding: 0;
      }
    }
    .time-tabs {
      display: inline-block;
      margin: 0 0 24px;
      cursor: pointer;
      border: 1px solid var(--o-color-border2);
      color: var(--o-color-text1);
      text-align: center;
      background: var(--o-color-bg2);
      font-size: 14px;
      line-height: 38px;
      padding: 0 16px;
      @media (max-width: 1100px) {
        line-height: 28px;
        font-size: 12px;
        padding: 0 12px;
      }
    }

    .one-level-tabs {
      background: var(--o-color-bg2);
      border-color: var(--o-color-primary2);
      :deep(.el-input) {
        cursor: pointer;
        .el-input__inner {
          cursor: pointer;
          width: min-content;
          color: var(--o-color-text1);
          text-align: center;
        }
      }
    }
    .is-active {
      .one-level-tabs {
        background: var(--o-color-primary1);
        :deep(.el-input) {
          .el-input__inner {
            width: min-content;
            color: var(--o-color-text2);
            text-align: center;
          }
        }
      }
    }
  }
  .schedule-item {
    width: 100%;
    padding: 24px;
    background-color: var(--o-color-bg2);
    @media (max-width: 1100px) {
      padding: 16px;
    }
    &.other {
      .del-title {
        left: inherit;
        right: -8px;
        width: 16px;
        height: 16px;
        top: -18px;
        &::after {
          height: 2px;
          width: calc(100% - 6px);
        }
      }
      :deep(.el-tabs) {
        margin-bottom: 24px;
        .el-tabs__header.is-top .el-tabs__item.is-top {
          // padding: 10px 20px 10px 0;
          @media (max-width: 1100px) {
            height: auto;
            padding: 6px 18px 6px 0;
            line-height: 22px;
          }
        }
        .el-tabs__nav {
          float: none;
          display: inline-block;
          @media (max-width: 1100px) {
            line-height: 44px;
          }
        }
        .el-tabs__header {
          text-align: center;
          margin: 0;
          .el-tabs__nav-wrap {
            overflow: visible;
            .el-tabs__nav-scroll {
              overflow: visible;
            }
          }
          .el-tabs__item {
            @media (max-width: 1100px) {
              font-size: 12px;
              line-height: 18px;
            }
          }
        }
      }
      :deep(.el-tabs__nav-scroll) {
        text-align: center;
      }
      :deep(.el-tabs__content) {
        overflow: visible;
        @media (max-width: 1100px) {
          margin-top: 16px;
        }
      }
      :deep(.el-tabs__nav) {
        float: none;
        display: inline-block;
        @media (max-width: 1100px) {
          line-height: 44px;
        }
      }
      .other-text {
        margin: 24px auto 0 auto;
        color: var(--o-color-text1);
        font-size: 18px;
        line-height: 26px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        @media (max-width: 1100px) {
          font-size: 14px;
          line-height: 22px;
          margin: 16px 0;
        }
        svg {
          margin-right: 8px;
        }
      }
      .other-title {
        margin: 24px auto;
        color: var(--o-color-text1);
        font-size: 18px;
        line-height: 26px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
        @media (max-width: 1100px) {
          font-size: 14px;
          line-height: 22px;
          margin: 16px 0;
        }
      }
      :deep(.content-list) {
        .detail {
          display: none;
        }
        .show-detail {
          .detail {
            display: block;
          }
        }
      }
      .exit-detail {
        cursor: pointer;
      }
    }
    :deep(.detail) {
      display: none;
    }
  }
  .add-content {
    margin-top: 16px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}
.is-edit {
  :deep(.el-input__wrapper) {
    &:hover {
      border: 1px solid var(--o-color-brand1);
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
    }
  }
  :deep(.el-input) {
    .is-focus {
      border: 1px solid transparent;
      box-shadow: 0 0 0 1px var(--o-color-brand1) inset;
    }
  }
  .name-item {
    position: relative;
    border: 1px solid transparent;
    transition: all 0.3s;
    &:hover {
      border: 1px solid var(--o-color-brand1);
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      .name {
        display: inline-block !important;
      }
    }
    &:focus-within {
      border: 1px solid var(--o-color-brand1);
      box-shadow: none;
      .post {
        border-left: 1px solid var(--o-color-brand1);
      }
    }
  }
}
.icon-del {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -36px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: 1px solid #e02020;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    border-radius: 1px;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 3px;
    width: calc(100% - 10px);
    background-color: #e02020;
  }
}
.icon-add {
  margin: 0 auto;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--o-font-size-text);
  border-radius: 50%;
  border: 1px solid var(--o-color-brand1);
  color: var(--o-color-brand1);
}
.margin-left {
  margin-left: 40px;
}
.content-list {
  @media screen and (max-width: 1100px) {
    position: relative;
  }
  .content-item {
    display: grid;
    grid-template-columns: 192px 580px 400px;
    padding: 20px 0;
    transition: all 0.25s ease;
    align-items: center;
    min-height: 64px;
    position: relative;
    border-bottom: 1px solid var(--o-color-border2);

    @media screen and (max-width: 1328px) {
      grid-template-columns: 192px 450px 400px;
    }
    @media screen and (max-width: 1100px) {
      grid-template-columns: 80px auto;
      padding: 6px 0;
      min-height: 36px;
      position: static;
    }
    .name-box {
      position: relative;
      .icon-add,
      .icon-del {
        position: relative;
        width: 16px;
        height: 16px;
        right: -8px;
        background-color: var(--o-color-bg2);
        &:hover {
          .tip {
            display: block;
          }
        }
        .tip {
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
      .icon-add {
        position: absolute;
        bottom: -8px;
      }
      .icon-del {
        position: absolute;
        top: 0;
        left: inherit;
        &::after {
          height: 2px;
          border-radius: 1px;
          width: calc(100% - 6px);
        }
      }
      @media screen and (max-width: 1100px) {
        grid-column-end: 3;
      }
      div {
        display: flex;
        align-items: center;
        @media screen and (max-width: 1100px) {
          grid-column-start: 2;
          grid-column-end: 3;
          display: block;
        }
      }
    }
    .del-content {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -36px;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      border: 1px solid #e02020;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        border-radius: 1px;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 3px;
        width: calc(100% - 10px);
        background-color: #e02020;
      }
    }
    .desc {
      position: relative;
      font-size: 18px;
      line-height: 26px;
      color: var(--o-color-text1);
      display: inline-block;
      margin-right: 36px;
      cursor: default;
      &:focus-within {
        .o-icon {
          display: block;
        }
      }
      .o-icon {
        position: absolute;
        right: -8px;
        top: -8px;
        width: 16px;
        height: 16px;
        background-color: var(--o-color-bg2);
      }
      @media (max-width: 1100px) {
        margin-right: 0;
        font-size: 12px;
        line-height: 18px;
      }
    }

    .name {
      width: 100px;
      display: inline-block;
      color: var(--o-color-text3);
      font-size: 16px;
      line-height: 24px;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border: 1px solid transparent;
      }
      @media (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    .post {
      width: 100%;
      display: inline-block;
      color: var(--o-color-text3);
      font-size: 16px;
      line-height: 24px;
      flex: 1;
      border-left: 1px solid transparent;
      transition: all 0.3s;
      :deep(.el-textarea) {
        textarea {
          resize: none;
          min-height: 38px !important;
          padding: 8px 14px !important;
          cursor: text;
          padding: 0;
          box-shadow: none;
          border: 1px solid transparent;
          resize: none;
          &:focus-visible {
            border: 1px solid transparent;
            box-shadow: none;
            outline: none;
          }
        }
      }
      @media (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    .post-more {
      width: 345px;
      @media screen and (max-width: 1100px) {
        width: 100%;
      }
    }
    .time {
      width: 192px;
      font-size: 18px;
      line-height: 26px;
      color: var(--o-color-text3);
      display: flex;
      align-items: center;
      @media screen and (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
        width: 80px;
      }
      svg {
        width: 18px;
        height: 18px;
        color: var(--o-color-text4);
        margin-right: 6px;
        @media screen and (max-width: 1100px) {
          display: none;
        }
      }
      .el-input-time {
        width: 40px;
        text-align: center;
        :deep(.el-input__wrapper) {
          padding: 0;
          .el-input__inner {
            color: var(--o-color-text4);
          }
        }
      }
    }
    .info .desc {
      width: 460px;
      margin-right: 40px;
      display: inline-block;
    }
    .detail {
      width: 75%;
      padding: 40px;
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      background-color: var(--o-color-bg2);
      box-shadow: var(--o-shadow-l4);
      max-height: 300px;
      overflow: auto;
      @media (max-width: 1100px) {
        padding: 24px;
        top: 50% !important;
        transform: translateX(-50%) translateY(-50%);
      }
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      // display: none;
      p {
        display: flex;
        & + p {
          margin-top: 8px;
        }
        > span {
          font-size: 14px;
          line-height: 22px;
          color: var(--o-color-text1);
          display: inline-block;
          @media (max-width: 1100px) {
            font-size: 12px;
            line-height: 18px;
          }
          &:nth-of-type(1) {
            display: inline-block;
            width: 110px;
            @media (max-width: 1100px) {
              width: 80px;
            }
          }
          &:nth-of-type(2) {
            flex: 1;
          }
          .detail-text {
            display: block;
          }
        }
      }
    }
    &:nth-last-of-type(1),
    &:nth-last-of-type(2),
    &:nth-last-of-type(3) {
      .detail {
        top: auto;
        bottom: 68px;
        @media (max-width: 1100px) {
          top: auto;
          bottom: 72px;
        }
      }
    }
    &:nth-last-of-type(4) {
      .detail {
        top: 80px;
      }
    }
  }
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .sub-container {
    .content-item {
      grid-template-columns: 192px auto 96px 410px;
    }
  }
}
</style>
<style lang="scss">
.agenda-dialog {
  h3 {
    font-size: 24px;
    font-weight: 400;
    color: var(--o-color-text1);
    line-height: 32px;
    text-align: center;
  }
  .line-input {
    display: flex;
    align-items: center;
    .el-input {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px #cccccc inset;
        .el-input__inner {
          color: #999999;
          cursor: not-allowed;
        }
      }
    }
    &:not(:first-child) {
      margin-top: 16px;
    }

    .label {
      font-size: var(--o-font-size-text);
      color: var(--o-color-text4);
      flex-shrink: 0;
      width: fit-content;
      margin-right: 40px;
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    .o-button:first-child {
      margin-right: 16px;
    }
  }
}
</style>
