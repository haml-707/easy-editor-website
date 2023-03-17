<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import IconTime from '~icons/app/icon-time.svg';

import { modifyFloorData, getPageData } from '@/api/api-easy-edit';

import { ElMessage } from 'element-plus';

// const value1 = ref<[Date, Date]>([
//   new Date(2016, 9, 10, 8, 40),
//   new Date(2016, 9, 10, 9, 40),
// ]);
// const value1 = ref<any>(['15:55', '15:59']);

const isEditor = ref(false);

const scheduleData: any = ref({
  title: '输入标题',
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
              desc: 'XXX领导致辞',
              person: [
                {
                  id: window.crypto.randomUUID(),
                  name: '姓名',
                  post: ['XXX成员'],
                },
              ],
              detail: [''],
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
              time: ['14:00', '14:10'],
              desc: '欧拉社区领导致辞',
              person: [
                {
                  name: '冯冠霖',
                  post: ['开放原子开源基金会秘书长'],
                },
              ],
              detail: ['EEEEEE'],
            },
          ],
        },
        {
          id: 1,
          name: '麒麟信安',
          content: [
            {
              time: ['14:00', '14:10'],
              desc: '致辞',
              person: [
                {
                  name: '任启',
                  post: ['麒麟信安高级副总裁'],
                },
              ],
              detail: [''],
            },
          ],
        },
        {
          id: 2,
          name: '统信软件',
          content: [
            {
              time: ['14:00', '14:05'],
              desc: '欢迎致辞',
              person: [
                {
                  name: '张木梁',
                  post: ['统信软件生态中心副总经理'],
                },
              ],
              detail: [''],
            },
          ],
        },
        {
          id: 3,
          name: '软通动力',
          title: '',
          content: [
            {
              time: ['14:00', '14:10'],
              desc: '欧拉社区领导致辞',
              person: [
                {
                  name: '冯冠霖',
                  post: ['开放原子开源基金会秘书长'],
                },
              ],
              detail: ['3333333'],
            },
          ],
        },
        {
          id: 4,
          name: '中科创达',
          title: '开放融合创新 崛起数智行业',
          content: [
            {
              time: ['14:00', '14:05'],
              desc: '欧拉社区领导致辞',
              person: [
                {
                  name: '熊伟',
                  post: ['开放原子开源基金会TOC委员'],
                },
              ],
              detail: [''],
            },
          ],
        },
      ],
    },
  ],
});
// 控制分论坛的详情弹窗显示
const indexShow: any = ref(-1);
const idShow: any = ref(-1);
function changeIndexShow(id: number, index: number) {
  idShow.value = id;
  indexShow.value = index;
}
// 控制主论坛及各个分论坛的显示
const tabType = ref(0);
console.log(tabType.value);

const otherTabType = ref(0);
function tabClick() {
  otherTabType.value = 0;
}

function handleGetPageData() {
  getPageData(6).then((res) => {
    try {
      scheduleData.value = JSON.parse(res.data.content);
    } catch (error) {
      console.error(error);
    }
  });
}

function handleInputBlur() {
  console.log('失焦事件');
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
                post: ['XXX成员'],
              },
            ],
            detail: [''],
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
function addContent() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value
  ].content.push({
    time: ['14:00', '14:05'],
    desc: 'XXX领导致辞',
    person: [
      {
        name: '姓名',
        post: ['XXX成员'],
      },
    ],
    detail: [''],
  });
}
function delContent(index: number) {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value
  ].content.splice(index, 1);
}
function delSubtitle2(index: number) {
  scheduleData.value.content[tabType.value].content.splice(index, 1);
}
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
            post: ['开放原子开源基金会秘书长'],
          },
        ],
        detail: ['EEEEEE'],
      },
    ],
  });
}
function savePageData() {
  modifyFloorData(6).then(() => {
    ElMessage({
      type: 'success',
      message: '保存成功',
    });
  });
}
// function createNewPage() {
//   createPage(JSON.stringify(scheduleData.value)).then(() => {
//     ElMessage({
//       type: 'success',
//       message: '保存成功',
//     });
//   });
// }
onMounted(() => {
  handleGetPageData();
});
</script>

<template>
  <div class="schedule">
    <h4 class="meeting-title">
      <input
        v-model="scheduleData.title"
        :readonly="!isEditor"
        type="text"
        @blur="handleInputBlur"
      />
    </h4>
    <el-tabs
      v-model.number="tabType"
      class="schedule-tabs"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="(itemList, index) in scheduleData.content"
        :key="itemList.id"
        :name="index"
      >
        <template #label>
          <div class="time-tabs">
            <input
              v-model="itemList.lable"
              :readonly="!isEditor"
              type="text"
              @blur="handleInputBlur"
            />
            <span v-if="isEditor" title="删除" @click.stop="delSubtitle(index)"
              >X</span
            >
          </div>
        </template>
      </el-tab-pane>
      <el-button v-if="isEditor" @click="addSubtitle">增加副标题</el-button>
    </el-tabs>
    <el-button v-if="isEditor" @click="addSubtitle2">增加三级标题</el-button>

    <el-container :level-index="1">
      <template
        v-for="(scheduleItem, index) in scheduleData.content"
        :key="scheduleItem.id"
      >
        <div
          v-show="tabType == index && scheduleItem.content[0].content"
          class="schedule-item other"
        >
          <el-tabs
            v-if="scheduleItem.content[1]"
            v-model.number="otherTabType"
            class="other-tabs"
          >
            <el-tab-pane
              v-for="(itemList, scheduleIndex) in scheduleItem.content"
              :key="itemList.id"
              :name="scheduleIndex"
            >
              <template #label>
                <div class="time-tabs">
                  <input
                    v-model="itemList.name"
                    :readonly="!isEditor"
                    type="text"
                    @blur="handleInputBlur"
                  />
                  <span v-show="isEditor" @click="delSubtitle2(scheduleIndex)"
                    >X</span
                  >
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
          <div
            v-for="(itemList, listIndex) in scheduleItem.content"
            v-show="tabType == index && otherTabType == listIndex"
            :key="itemList.id"
            class="content"
          >
            <!-- <h4 v-if="itemList.title || isEditor" class="other-title">
              <input
                v-model="itemList.title"
                :readonly="!isEditor"
                type="text"
                @blur="handleInputBlur"
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
                    :readonly="!isEditor"
                    format="HH:mm"
                    start-placeholder="Start"
                    end-placeholder="End"
                    @change="handleClose"
                  /> -->
                  <!-- {{ subItem.time }} -->
                  <IconTime />
                  <input
                    v-model="subItem.time[0]"
                    class="input-time"
                    :readonly="!isEditor"
                    type="text"
                    @blur="handleInputBlur"
                  />
                  -
                  <input
                    v-model="subItem.time[1]"
                    class="input-time"
                    :readonly="!isEditor"
                    type="text"
                    @blur="handleInputBlur"
                  />
                  <!-- {{ subItem.time[0] + '-' + subItem.time[1] }} -->
                </span>
                <span
                  class="desc"
                  :class="{ 'exit-detail': subItem.detail[0] }"
                  @click="changeIndexShow(listIndex, subIndex as any)"
                >
                  <input
                    v-model="subItem.desc"
                    :readonly="!isEditor"
                    type="text"
                    @blur="handleInputBlur"
                /></span>
                <div v-if="subItem.person[0]" class="name-box">
                  <div
                    v-for="personItem in subItem.person"
                    :key="personItem.id"
                  >
                    <span class="name">
                      <input
                        v-model="personItem.name"
                        :readonly="!isEditor"
                        type="text"
                        @blur="handleInputBlur"
                      />
                    </span>
                    <span
                      v-for="(postItem, postIndex) in personItem.post"
                      :key="postIndex"
                      class="post"
                    >
                      <input
                        v-model="personItem.post[postIndex]"
                        :readonly="!isEditor"
                        type="text"
                        @blur="handleInputBlur"
                      />
                    </span>
                  </div>
                </div>
                <div v-if="subItem.detail[0]" class="detail">
                  <p>
                    <span>议题名称：</span><span> {{ subItem.desc }}</span>
                  </p>
                  <p v-if="subItem.detail[0]">
                    <span>议题简介：</span
                    ><span
                      ><span
                        v-for="(itemDetail, detailIndex) in subItem.detail"
                        :key="detailIndex"
                        class="detail-text"
                      >
                        <input
                          v-model="subItem.detail[detailIndex]"
                          :readonly="!isEditor"
                          type="text"
                          @blur="handleInputBlur"
                        /> </span
                    ></span>
                  </p>
                  <p v-if="subItem.person[0]">
                    <span>发言人：</span>
                    <span
                      v-for="personItem in subItem.person"
                      :key="personItem.id"
                      >{{ personItem.name }}
                      <template v-if="personItem.post[0]">
                        <span>(</span>
                        <span
                          v-for="(postItem, postIndex) in personItem.post"
                          :key="postIndex"
                          >{{ postItem }}</span
                        >
                        <span>)</span>
                      </template>
                    </span>
                  </p>
                </div>
                <div
                  v-show="
                    indexShow !== -1 && subItem.detail && idShow === listIndex
                  "
                  class="mask"
                  @click="changeIndexShow(-1, -1)"
                ></div>
                <span
                  v-if="isEditor"
                  class="del-content"
                  @click="delContent(subIndex)"
                  >X</span
                >
              </div>
            </div>
            <el-button v-if="isEditor" class="add-content" @click="addContent">
              增加日程
            </el-button>
          </div>
        </div>
      </template>
    </el-container>
  </div>
  <div class="contoral-box">
    <el-button @click="isEditor = !isEditor">{{
      isEditor ? '预览' : '编辑'
    }}</el-button
    ><el-button @click="savePageData">保存</el-button>
    <!-- <el-button @click="createNewPage">新建</el-button> -->
  </div>
</template>

<style lang="scss" scoped>
.el-button {
  border-radius: 0;
}

input {
  padding: 4px;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  border: 1px solid #707070;
  max-width: 100%;
  &:focus-visible {
    box-shadow: none;
    outline: none;
    border: 1px solid var(--o-color-primary1);
  }
}
input[readonly] {
  cursor: pointer;
  padding: 0;
  text-align: center;
  border: none;
  &:focus-visible {
    border: none;
    box-shadow: none;
    outline: none;
  }
}
.el-date-editor.el-input__wrapper {
  background-color: transparent;
}
.schedule {
  margin-top: 20px;
  .meeting-title {
    font-weight: 400;
    color: var(--o-color-text1);
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      line-height: 22px;
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

    .is-active .time-tabs {
      color: #fff;
      background: var(--o-color-primary1);
      border-color: var(--o-color-primary2);
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
      :deep(.el-tabs) {
        margin-bottom: 24px;
        .el-tabs__header.is-top .el-tabs__item.is-top {
          padding: 10px 20px 10px 0;
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
}
.content-list {
  @media screen and (max-width: 1100px) {
    position: relative;
  }
  .content-item {
    display: grid;
    grid-template-columns: 192px 580px 445px;
    // border-bottom: 1px solid var(--o-color-border2);
    padding: 20px 0;
    transition: all 0.25s ease;
    align-items: center;
    min-height: 64px;
    position: relative;
    & + .content-item {
      border-top: 1px solid var(--o-color-border2);
    }
    @media screen and (max-width: 1328px) {
      grid-template-columns: 192px 450px 400px;
    }
    @media screen and (max-width: 1100px) {
      grid-template-columns: 80px auto;
      padding: 6px 0;
      min-height: 36px;
      position: static;
    }
    &:hover {
      background-color: var(--o-color-bg4);
    }
    .name-box {
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
      right: 12px;
    }
    .desc {
      font-size: 18px;
      line-height: 26px;
      color: var(--o-color-text1);
      display: inline-block;
      margin-right: 36px;
      cursor: default;
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
      // word-break: keep-all;
      flex: 1;
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
        color: var(--o-color-text3);
        margin-right: 6px;
        @media screen and (max-width: 1100px) {
          display: none;
        }
      }
      .input-time {
        width: 60px;
        text-align: center;
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
