<script setup lang="ts">
import { computed, ref, onMounted, inject, reactive } from 'vue';
import { useLangStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useWindowResize from '@/components/hooks/useWindowResize';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import SigMeeting from './SigMeeting.vue';
import OIcon from '@/components/OIcon.vue';
import AppEditTemplate from '@/components/AppEditTemplate.vue';
import MobileRepositoryList from './MobileRepositoryList.vue';
import ContributList from './ContributList.vue';
import AppPaginationMo from '@/components/AppPaginationMo.vue';
import MdStatement from '@/components/MdStatement.vue';

import IconEmail from '~icons/app/icon-mail.svg';
import IconGitee from '~icons/app/icon-gitee.svg';
import IconSearch from '~icons/app/icon-search.svg';
import IconAdd from '~icons/app/icon-add.svg';
import IconEdit from '~icons/app/icon-edit.svg';

import {
  getSigDetail,
  getSigMember,
  getSigRepositoryList,
  getSigList,
} from '@/api/api-sig';
import { modifyFloorData, deleteFloor, createPage } from '@/api/api-easy-edit';

import { usePageData } from '@/stores';
import _ from 'lodash-es';

let templateData = reactive<any>('');
const params = {
  title: '介绍',
  description: '介绍',
  content: '',
  contentType: 'txt',
  name: '',
  path: '',
};

interface SIGLIST {
  group_name: string;
  maillist: string;
}
// const emit = defineEmits(['turn-page', 'jump-page']);

const pageData = computed(() => {
  return usePageData().pageData;
});

const isDialogVisiable = ref(false);
const modeType = inject('modeType');
const EditFloor = function (type: boolean) {
  if (type) {
    templateData = _.cloneDeep(introduction.value);
  } else {
    usePageData().pageData.forEach((item: any, index: number) => {
      if (item.name === 'introduction') {
        usePageData().pageData[index] = templateData;
      }
    });
  }
  isDialogVisiable.value = !isDialogVisiable.value;
};
const addFloor = function () {
  isDialogVisiable.value = !isDialogVisiable.value;
};
const introduction = computed(() => {
  return getFloorData('introduction');
});
const markdownData = computed(() => {
  return getFloorData('markdown');
});
const markdown1 = ref('');
function getFloorData(name: string) {
  try {
    const giteeName = pageData.value?.filter((item: any) => {
      return item.name === name;
    })[0];
    if (giteeName) {
      return giteeName;
    }
  } catch (error) {
    return false;
  }
}
function saveData(name: string) {
  params.content = introduction.value?.content;
  params.name = name;
  params.path =
    'https://www.openeuler.org/zh/sig/sig-detail/?name=sig-OpenDesign';
  modifyFloorData(params).then((res) => {
    console.log(res);
  });
}
function handleDelFloor(name: string) {
  deleteFloor(
    'https://www.openeuler.org/zh/sig/sig-detail/?name=sig-OpenDesign',
    name
  );
}
function creatFloor(name: string) {
  createPage(markdown1.value);
}
////////
const lang = useLangStore().lang;

const route = useRoute();

const { t } = useI18n();

const screenWidth = useWindowResize();
const isIphone = computed(() => {
  return screenWidth.value <= 768 ? true : false;
});
const paginLayout = computed(() =>
  isIphone.value
    ? 'prev, slot, jumper, next'
    : 'sizes, prev, pager, next, slot, jumper'
);
const sigDetailName = ref(route.params.name as string);

const sigMeetingData: any = ref('');
const sigMemberData: any = ref('');
const memberList: any = ref([]);

function getSigDetails() {
  getSigDetail(sigDetailName.value)
    .then((res: any) => {
      sigMeetingData.value = res;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
const oldEmail = ref('');
const giteeHomeLink = ref('');
function getOldEmail() {
  getSigList().then((res) => {
    const targetData = res.filter((item: SIGLIST) => {
      return item.group_name === sigDetailName.value;
    });
    if (targetData.length) {
      oldEmail.value = targetData[0].maillist;
      giteeHomeLink.value = targetData[0].home_page;
    }
  });
}
function getSigMembers() {
  const param = {
    community: 'openeuler',
    sig: sigDetailName.value,
  };
  getSigMember(param)
    .then((res: any) => {
      if (res?.data[0]) {
        const data = res.data[0];
        sigMemberData.value = data;
        const { maintainer_info } = data || [];
        if (maintainer_info) {
          memberList.value = maintainer_info;
        }
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

// 仓库列表过滤参数
const repositoryNameList = ref([]);
const repositoryNameSelected = ref('');
const maintainerList = ref([]);
const maintainerSelected = ref('');
const committerList = ref([]);
const committerSelected = ref('');

const filterRepositoryList = () => {
  totalRepositoryList.value = _totalRepositoryList.value.filter((item) => {
    return (
      (!repositoryNameSelected.value ||
        item.repo === repositoryNameSelected.value) &&
      (!maintainerSelected.value ||
        item.maintainers.includes(maintainerSelected.value)) &&
      (!committerSelected.value ||
        item.gitee_id.includes(committerSelected.value))
    );
  });
  totalRepositoryList.value;
};

// 仓库列表参数
const currentPage = ref(1);
const pageSize = ref(10);
const totalPage = computed(() =>
  Math.ceil(totalRepositoryList.value.length / pageSize.value)
);
// 列表过滤后数据
const totalRepositoryList = ref([] as any[]);
// 列表原始数据
const _totalRepositoryList = ref([] as any[]);
const repositoryList = computed(() => {
  if (totalRepositoryList.value.length > pageSize.value) {
    return totalRepositoryList.value.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    );
  } else {
    return totalRepositoryList.value;
  }
});
const getRepositoryList = () => {
  const param = {
    community: 'openeuler',
    sig: sigDetailName.value,
  };
  getSigRepositoryList(param).then((data) => {
    if (data.code === 200) {
      const {
        committerDetails = [],
        committers = [],
        maintainers = [],
      } = data.data;
      _totalRepositoryList.value = committerDetails.map((item: any) => ({
        ...item,
        maintainers,
      }));
      filterRepositoryList();
      repositoryNameList.value = committerDetails.map((item: any) => item.repo);
      maintainerList.value = maintainers;
      committerList.value = committers;
    }
  });
};
function turnPage(option: string) {
  if (option === 'prev' && currentPage.value > 1) {
    currentPage.value = currentPage.value - 1;
  } else if (option === 'next' && currentPage.value < totalPage.value) {
    currentPage.value = currentPage.value + 1;
  }
}
function setDefaultImage(e: any) {
  if (e?.target) {
    e.target.src = 'https://gitee.com/assets/no_portrait.png';
  }
}
onMounted(() => {
  getSigDetails();
  getOldEmail();
  getSigMembers();
  getRepositoryList();
});
</script>
<template>
  <AppEditTemplate>
    <div class="sig-detail">
      <BreadCrumbs
        bread1="SIG"
        :bread2="sigDetailName"
        link1="/zh/sig/sig-list/"
      />
      <div class="content">
        <!-- <Teleport to="body" :disabled="!isDialogVisiable"> -->
        <div class="brief-introduction">
          <h2 class="brief-introduction-title">
            {{ sigDetailName }}
            <a :href="giteeHomeLink" target="_blank">
              <OIcon class="icon"> <IconGitee /> </OIcon
            ></a>
          </h2>
          <el-input
            v-if="introduction"
            v-model="introduction.content"
            :readonly="!isDialogVisiable"
            :placeholder="t('sig.SIG_DETAIL.SIG_EMPTY_TEXT1')"
            type="textarea"
            class="sig-introduction"
          >
            {{ sigMemberData.description }}
          </el-input>
          <el-button
            v-show="isDialogVisiable"
            class="sig-introduction"
            @click="EditFloor(false)"
            >放弃修改</el-button
          >
          <el-button
            v-show="isDialogVisiable"
            class="sig-introduction"
            @click="saveData('introduction')"
            >确认修改</el-button
          >
          <el-button
            v-show="isDialogVisiable"
            class="sig-introduction"
            @click="handleDelFloor('profile/meeting')"
            >删除</el-button
          >
          <div
            v-show="!modeType"
            class="edit-floor square"
            @click="EditFloor('introduction')"
          >
            <OIcon>
              <IconEdit />
            </OIcon>
          </div>
        </div>
        <!-- </Teleport> -->
        <el-input
          v-if="isDialogVisiable"
          v-model="markdown1"
          :readonly="!isDialogVisiable"
          :placeholder="t('sig.SIG_DETAIL.SIG_EMPTY_TEXT1')"
          type="textarea"
          class="editable-floor"
        >
          {{ sigMemberData.description }}
        </el-input>
        <el-button v-if="isDialogVisiable" @click="creatFloor('markdown')"
          >保存修改</el-button
        >
        <div
          v-show="!modeType"
          class="add-floor square"
          @click="addFloor('markdown')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
        </div>

        <div
          v-if="markdownData"
          style="margin-top: 40px"
          class="markdown-floor"
        >
          <h2></h2>
          <MdStatement :statement="markdownData.content"></MdStatement>
        </div>
        <div v-if="lang === 'zh'" class="meeting">
          <h2>
            <span class="title-bg">{{
              t('sig.SIG_DETAIL.ORGANIZING_MEETINGS_BG')
            }}</span>
            <span class="title-text">{{
              t('sig.SIG_DETAIL.ORGANIZING_MEETINGS')
            }}</span>
          </h2>
          <SigMeeting
            v-if="sigMeetingData.tableData"
            class="calender-box"
            :table-data="sigMeetingData.tableData"
          />
          <p v-else class="sig-introduction">
            {{ t('sig.SIG_DETAIL.NO_MEETINGS') }}
          </p>
        </div>
        <div v-if="memberList.length" class="member">
          <h2>
            <span class="title-bg">{{
              t('sig.SIG_DETAIL.MAINTAINER_BG')
            }}</span>
            <span class="title-text">{{ t('sig.SIG_DETAIL.MAINTAINER') }}</span>
          </h2>
          <div class="member-box">
            <h5>
              {{ sigDetailName + ' ' + t('sig.SIG_DETAIL.MAINTAINER_EN') }}
            </h5>
            <ul>
              <li v-for="item in memberList" :key="item.gitee_id">
                <div class="member-img">
                  <img
                    :src="item.avatar_url"
                    :alt="item.name"
                    @error="setDefaultImage($event)"
                  />
                </div>
                <p class="name">{{ item.gitee_id }}</p>
                <p class="introduction">
                  <span>Maintainer</span>
                </p>
                <div class="icon-link">
                  <a
                    :href="`https://gitee.com/${item.gitee_id}`"
                    target="_blank"
                  >
                    <OIcon class="icon"> <IconGitee /> </OIcon
                  ></a>
                  <a :href="`mailto:${item.email}`">
                    <OIcon class="icon"> <IconEmail /> </OIcon
                  ></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="repository">
          <h2>
            <span class="title-bg">{{
              t('sig.SIG_DETAIL.REPOSITORY_LIST_BG')
            }}</span>
            <span class="title-text">{{
              t('sig.SIG_DETAIL.REPOSITORY_LIST')
            }}</span>
          </h2>
          <div class="repository-box">
            <h5>
              {{
                `${sigDetailName} ${t('sig.SIG_DETAIL.REPOSITORY_LIST')} (${
                  _totalRepositoryList.length
                })`
              }}
            </h5>
            <div class="repository-filter">
              <div :class="isIphone ? 'select-box-phone' : 'select-box'">
                <div class="select-item">
                  <span class="select-item-name">
                    {{ t('sig.SIG_DETAIL.REPOSITORY_NAME') }}
                  </span>
                  <el-select
                    v-model="repositoryNameSelected"
                    filterable
                    clearable
                    :placeholder="t('sig.SIG_ALL')"
                    @change="filterRepositoryList()"
                  >
                    <template #prefix>
                      <OIcon>
                        <IconSearch />
                      </OIcon>
                    </template>
                    <el-option
                      v-for="item in repositoryNameList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
                <div v-if="isIphone" class="split-line"></div>
                <div class="select-item">
                  <span class="select-item-name"> Maintainer </span>
                  <el-select
                    v-model="maintainerSelected"
                    filterable
                    clearable
                    :placeholder="t('sig.SIG_ALL')"
                    @change="filterRepositoryList()"
                  >
                    <template #prefix>
                      <OIcon>
                        <IconSearch />
                      </OIcon>
                    </template>
                    <el-option
                      v-for="item in maintainerList"
                      :key="item"
                      :value="item"
                      :lable="item"
                    />
                  </el-select>
                </div>
                <div v-if="isIphone" class="split-line"></div>
                <div class="select-item">
                  <span class="select-item-name"> Committer </span>
                  <el-select
                    v-model="committerSelected"
                    filterable
                    clearable
                    :placeholder="t('sig.SIG_ALL')"
                    @change="filterRepositoryList()"
                  >
                    <template #prefix>
                      <OIcon>
                        <IconSearch />
                      </OIcon>
                    </template>
                    <el-option
                      v-for="item in committerList"
                      :key="item"
                      :value="item"
                      :lable="item"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <el-table v-if="!isIphone" :data="repositoryList">
              <el-table-column
                :label="t('sig.SIG_DETAIL.REPOSITORY_NAME')"
                width="550px"
              >
                <template #default="scope">
                  <a
                    target="_blank"
                    :href="`https://gitee.com/${scope.row.repo}`"
                  >
                    {{ scope.row.repo }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="Maintainer">
                <template #default="scope">
                  <a
                    v-for="(item, index) in scope.row.maintainers"
                    :key="item"
                    target="_blank"
                    :href="`https://gitee.com/${item}`"
                  >
                    {{ item
                    }}<span
                      v-show="index !== scope.row.maintainers.length - 1"
                      >{{ lang === 'zh' ? '、' : ',&nbsp;' }}</span
                    >
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="Committer">
                <template #default="scope">
                  <a
                    v-for="(item, index) in scope.row.gitee_id"
                    :key="item"
                    target="_blank"
                    :href="`https://gitee.com/${item}`"
                  >
                    {{ item
                    }}<span v-show="index !== scope.row.gitee_id.length - 1">{{
                      lang === 'zh' ? '、' : ',&nbsp;'
                    }}</span>
                  </a>
                </template>
              </el-table-column>
            </el-table>
            <MobileRepositoryList
              v-else
              :data="repositoryList"
            ></MobileRepositoryList>
            <div class="sig-pagination">
              <el-pagination
                v-model:currentPage="currentPage"
                v-model:page-size="pageSize"
                class="repository-pagin"
                :hide-on-single-page="true"
                :page-sizes="[10, 20, 30, 40]"
                :background="true"
                :layout="paginLayout"
                :total="totalRepositoryList.length"
              >
                <span class="pagination-slot"
                  >{{ currentPage }}/{{ totalPage }}</span
                >
              </el-pagination>
              <AppPaginationMo
                :current-page="currentPage"
                :total-page="totalRepositoryList.length"
                @turn-page="turnPage"
              >
              </AppPaginationMo>
            </div>
          </div>
        </div>
        <div class="contribution">
          <h2>
            <span class="title-bg">{{
              t('sig.SIG_DETAIL.CONTRIBUTION_BG')
            }}</span>
            <span class="title-text">{{
              t('sig.SIG_DETAIL.CONTRIBUTION')
            }}</span>
          </h2>
          <div class="contribution-box">
            <h5>
              {{ `${sigDetailName} ${t('sig.SIG_DETAIL.USER_CONTRIBUTOR')}` }}
            </h5>
            <ContributList
              class="contribution-content"
              :sig="sigDetailName"
            ></ContributList>
          </div>
        </div>
      </div>
    </div>
  </AppEditTemplate>
</template>
<style lang="scss" scoped>
.editable-floor {
  position: relative;
  z-index: 11;
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
@mixin section-box {
  margin-top: var(--o-spacing-h2);
  background-color: var(--o-color-bg2);
  padding: var(--o-spacing-h2);
  @media screen and (max-width: 768px) {
    margin-top: var(--o-spacing-h5);
    padding: var(--o-spacing-h5);
  }
}
:deep(.el-textarea) {
  textarea {
    resize: none;
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
.is-editing {
  position: fixed !important;
  z-index: 12;
  max-width: 1424px;
  width: 100%;
  top: calc(50% - 160px);
  left: 50%;
  transform: translate(-50%, -50%);
}
.sig-detail {
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
  .content {
    width: 100%;
    margin-top: var(--o-spacing-h2);
    .sig-pagination {
      margin-top: var(--o-spacing-h2);
      @media screen and (max-width: 768px) {
        margin-top: var(--o-spacing-h2);
      }
    }
    .pagination-slot {
      font-size: var(--o-font-size-text);
      font-weight: 400;
      color: var(--o-color-text1);
      line-height: var(--o-spacing-h4);
    }
    .brief-introduction {
      position: relative;
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
    .meeting {
      margin-top: var(--o-spacing-h2);
      color: var(--o-color-text1);
      .sig-introduction {
        padding: var(--o-spacing-h5) 0;
        text-align: center;
        position: relative;
        z-index: 11;
      }
      h2 {
        @include title;
      }
      .calender-box {
        margin-top: var(--o-spacing-h2);
        @media screen and (max-width: 768px) {
          margin-top: var(--o-spacing-h5);
        }
      }
      .schedule {
        margin-top: var(--o-spacing-h4);
        .calendar {
          width: 448px;
        }
      }
    }

    .member {
      margin-top: var(--o-spacing-h2);
      color: var(--o-color-text1);
      h2 {
        @include title;
      }
      .member-box {
        @include section-box;
        h5 {
          font-size: var(--o-font-size-h6);
          line-height: var(--o-line-height-h6);
          font-weight: 400;
          color: var(--o-color-text1);
          @media screen and (max-width: 768px) {
            font-size: var(--o-font-size-h8);
            line-height: var(--o-line-height-h8);
          }
        }
        ul {
          // display: flex;
          margin-top: var(--o-spacing-h2);
          padding: 0 var(--o-spacing-h7);
          display: flex;
          justify-content: start;
          flex-wrap: wrap;
          li {
            flex: 0 0 25%;
            text-align: center;
            .icon-link {
              display: flex;
              justify-content: center;
              margin-top: var(--o-spacing-h8);
              font-size: var(--o-font-size-h5);
              a {
                margin: 0 var(--o-spacing-h8);
              }
            }
            @media (max-width: 1080px) {
              flex: 0 0 50%;
              .icon-link {
                font-size: var(--o-font-size-h7);
                a {
                  margin: 0 var(--o-spacing-h9);
                }
              }
            }
            .member-img {
              width: 120px;
              height: 120px;
              display: block;
              margin: 0 auto;
              img {
                width: 120px;
                height: 120px;
                border-radius: 50%;
              }
            }

            .name {
              margin-top: var(--o-spacing-h5);
              font-size: var(--o-font-size-h8);
              line-height: var(--o-line-height-h8);
            }
            .introduction {
              font-size: var(--o-font-size-tip);
              line-height: var(--o-line-height-tip);
            }
          }
        }
      }
    }
    .repository {
      margin-top: var(--o-spacing-h2);
      color: var(--o-color-text1);
      h2 {
        @include title;
      }
      .repository-box {
        @include section-box;
        h5 {
          font-size: var(--o-font-size-h6);
          font-weight: 400;
          color: var(--o-color-text1);
        }
      }

      a {
        cursor: pointer;
        color: var(--o-color-brand1);
      }
      .repository-filter {
        margin: var(--o-spacing-h4) 0;
        .select-box {
          display: flex;
          justify-items: center;
          align-items: center;
          .select-item {
            display: flex;
            align-items: center;
            &-name {
              margin-right: var(--o-spacing-h5);
            }
            margin-right: var(--o-spacing-h1);
            .el-input__prefix-inner {
              .o-icon {
                font-size: var(--o-font-size-h7);
                @media screen and (max-width: 768px) {
                  font-size: var(--o-font-size-h8);
                }
              }
            }
          }
        }
        .select-box-phone {
          .select-item {
            font-size: var(--o-font-size-text);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .split-line {
            height: 1px;
            margin: var(--o-spacing-h6) 0;
            background-color: var(--o-color-border2);
          }
        }
      }
      @media screen and (min-width: 857px) {
        .repository-pagin {
          margin-top: var(--o-spacing-h2);
        }
      }
      @media screen and (max-width: 857px) {
        .repository-pagin {
          margin-top: var(--o-spacing-h5);
        }
      }
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
    .contribution {
      margin-top: var(--o-spacing-h2);
      color: var(--o-color-text1);
      h2 {
        @include title;
      }
      .contribution-box {
        @include section-box;
        h5 {
          font-size: var(--o-font-size-h6);
          font-weight: 400;
          color: var(--o-color-text1);
        }
        .contribution-content {
          margin: var(--o-spacing-h4) 0;
        }
      }
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
    .recent-event {
      margin-top: var(--o-spacing-h2);
      color: var(--o-color-text1);
      h2 {
        @include title;
      }
      .dynamic {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 24px;
        margin-top: var(--o-spacing-h4);
        @media (max-width: 780px) {
          grid-template-columns: 1fr;
        }
        .item {
          max-width: 656px;
          padding: 40px;
          background-color: var(--o-color-bg2);
          border: 1px solid transparent;
          .header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            .left {
              font-size: var(--o-font-size-h6);
              line-height: var(--o-line-height-h6);
              font-weight: 600;
              &::after {
                display: block;
                content: '';
                width: 20px;
                height: 2px;
                background-color: var(--o-color-brand1);
              }
            }
            .right {
              font-size: var(--o-font-size-text);
              line-height: 22px;
              cursor: pointer;
              .icon-more {
                font-size: var(--o-font-size-h8);
                margin-left: var(--o-spacing-h8);
                position: relative;
                top: 2px;
                color: var(--o-color-brand1);
              }
            }
          }
          .item-body {
            margin-top: var(--o-spacing-h4);
            font-size: var(--o-font-size-text);
            line-height: 22px;
          }
          &:hover {
            background-color: var(--o-color-bg2);
            border: 1px solid var(--o-color-kleinblue8);
            box-shadow: var(--o-shadow-l4);
          }
        }
      }
    }
    .square {
      cursor: pointer;
      display: flex;
      justify-content: center;
      z-index: 11;
      border: 1px solid var(--o-color-brand1);
      .o-icon {
        padding: 8px;
        font-size: 48px;
        color: var(--o-color-brand1);
        // TODO:'阴影'
        box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      }
    }
    .add-floor {
      position: relative;
      margin: 64px auto 24px;
      width: fit-content;
    }
    .edit-floor {
      position: absolute;
      top: 0;
      right: -40px;
    }
  }
}
@media (max-width: 1100px) {
  .sig-detail {
    padding: 16px 16px var(--o-spacing-h2);
  }
}
</style>
