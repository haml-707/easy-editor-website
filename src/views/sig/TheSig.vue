<script setup lang="ts">
import { computed, ref, onMounted, Ref, inject, watch } from 'vue';
import { useLangStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import _ from 'lodash-es';

import useWindowResize from '@/components/hooks/useWindowResize';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import SigMeeting from './SigMeeting.vue';
import SigIntroduction from './SigIntroduction.vue';
import MarkdownEdit from './MarkdownEdit.vue';
import OIcon from '@/components/OIcon.vue';
import AppEditTemplate from '@/components/AppEditTemplate.vue';
import MobileRepositoryList from './MobileRepositoryList.vue';
import ContributList from './ContributList.vue';
import AppPaginationMo from '@/components/AppPaginationMo.vue';

import { OButton } from '@/components/button';
import { ElMessage } from 'element-plus';

import IconEmail from '~icons/app/icon-mail.svg';
import IconGitee from '~icons/app/icon-gitee.svg';
import IconSearch from '~icons/app/icon-search.svg';
import IconAdd from '~icons/app/icon-add.svg';
import IconWarn from '~icons/edit/icon-warn.svg';

import {
  getSigDetail,
  getSigMember,
  getSigRepositoryList,
  getSigList,
} from '@/api/api-sig';

import {
  modifyFloorData,
  deleteFloor,
  createPage,
  getSingleFloorData,
} from '@/api/api-easy-edit';

import { usePageData, useVersionData } from '@/stores';

interface SigList {
  group_name: string;
  maillist: string;
}

const lang = useLangStore().lang;

const route = useRoute();

const { t, locale } = useI18n();
const sigDetailName = ref(route.params.name as string);

const path = ref(
  `https://www.openeuler.org/${locale.value}/sig/sig-detail/?name=${sigDetailName.value}`
);

let params = {
  title: '介绍',
  description: '介绍',
  content: '',
  contentType: 'text/plain',
  name: '',
  path: path.value,
  type: 'sig',
  locale: locale.value,
  isPrivate: false,
};

const pageData = computed(() => {
  return usePageData().pageData;
});
const isDialogVisiable = ref(false);
const isEditVisiable = ref('');
const modeType = inject('modeType') as Ref<boolean>;

// 新建楼层，赋值默认markdown
const addFloor = async function (name: string) {
  dataMap[name].value['name'] = name;
  if (pageData.value.has(name)) {
    name = `${name}/${window.crypto.randomUUID()}`;
  }
  await creatFloor(name);
  isEditVisiable.value = name;
};

const meetingData = computed({
  get: () =>
    pageData.value.get('meeting') || {
      content: '',
      title: '',
    },
  set: (val) => {
    val;
  },
});

const introductData = computed({
  get: () =>
    pageData.value.get('introduction') || {
      content: '',
      title: '',
    },
  set: (val) => {
    val;
  },
});

const markdownData1 = computed(() => {
  return filterMap('markdown1');
});
const markdownData2 = computed(() => {
  return filterMap('markdown2');
});
const markdownData3 = computed(() => {
  return filterMap('markdown3');
});
const markdownData4 = computed(() => {
  return filterMap('markdown4');
});
const markdownData5 = computed(() => {
  return filterMap('markdown5');
});

// name和数据映射
const dataMap: any = {
  ['markdown1']: markdownData1,
  ['markdown2']: markdownData2,
  ['markdown3']: markdownData3,
  ['markdown4']: markdownData4,
  ['markdown5']: markdownData5,
  meeting: meetingData,
  introduction: introductData,
};

function saveData(name: string) {
  params = pageData.value.get(name);
  params.name = name;
  params.path = path.value;
  modifyFloorData(params)
    .then((res: { statusCode: number }) => {
      if (res?.statusCode !== 200) {
        // 修改出错内容回显
        getSingleFloorData(path.value, name).then((res: any) => {
          params.content = res?.data?.content;
          params.title = res?.data?.title;
          usePageData().pageData.set(name, params);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// 新键楼层 如果已存在 调用保存
function creatFloor(name: string) {
  if (!useVersionData().isCoverLatest) {
    return false;
  }
  if (pageData.value.has(name)) {
    saveData(name);
  } else {
    const param = {
      content: t('edit.MARKDOWN_TEMPLATE'),
      name: name,
      description: '',
      path: path.value,
      title: '',
      isPrivate: false,
      type: 'sig',
      locale: locale.value,
      contentType: 'text/plain',
    };
    createPage(param).then((res: { statusCode: number }) => {
      if (res?.statusCode === 200) {
        ElMessage({
          type: 'success',
          message: '创建成功',
        });
        pageData.value.set(name, _.cloneDeep(param));
        usePageData().tempData.set(name, _.cloneDeep(param));
      }
    });
  }
  isEditVisiable.value = '';
}
// 确认删除
function confirmDel() {
  deleteFloor(path.value, isEditVisiable.value).then((res) => {
    if (res.statusCode === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    }
    if (!isEditVisiable.value.includes('/')) {
      dataMap[isEditVisiable.value].value.name = '';
    }
    pageData.value.delete(isEditVisiable.value);
    isEditVisiable.value = '';
    toggleDelDlg(false);
  });
}
function toggleDelDlg(val: boolean, name?: string) {
  isDialogVisiable.value = val;
  isEditVisiable.value = name || '';
}

// ----------------------------------------------------------------------

const screenWidth = useWindowResize();
const isIphone = computed(() => {
  return screenWidth.value <= 768 ? true : false;
});
const paginLayout = computed(() =>
  isIphone.value
    ? 'prev, slot, jumper, next'
    : 'sizes, prev, pager, next, slot, jumper'
);

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
    const targetData = res.filter((item: SigList) => {
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
// 筛选对应楼层数据
function filterMap(name: string) {
  const targetMap = new Map();
  pageData.value.forEach((val, key) => {
    if (key.includes(name) && (val.content_type || val.contentType)) {
      targetMap.set(key, val);
    }
  });
  return targetMap;
}

// 切换预览模式 清除编辑状态
watch(
  () => modeType.value,
  () => {
    if (modeType.value) {
      isEditVisiable.value = '';
    }
  }
);

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
        link1="https://www.openeuler.org/zh/sig/sig-list/"
      />
      <div class="content">
        <div class="introduction">
          <SigIntroduction
            v-model="introductData"
            @auto-save="creatFloor('introduction')"
          ></SigIntroduction>
        </div>
        <div class="markdown-floor">
          <MarkdownEdit
            v-for="child in markdownData1"
            :key="child[0]"
            v-model="child[1]"
            :markdown-id="child[0]"
            @auto-save="creatFloor(child[0])"
            @handle-del="toggleDelDlg(true, child[0])"
          />
        </div>

        <div
          v-show="!modeType && markdownData1.size < 3"
          class="add-floor square"
          @click="addFloor('markdown1')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
        </div>
        <div v-if="locale === 'zh'" class="meeting">
          <SigMeeting
            v-if="sigMeetingData.tableData"
            v-model="meetingData"
            class="calender-box"
            :old-email="oldEmail"
            :table-data="sigMeetingData.tableData"
            @auto-save="creatFloor('meeting')"
          />
          <p v-else class="sig-introduction">
            {{ t('sig.SIG_DETAIL.NO_MEETINGS') }}
          </p>
        </div>
        <div class="markdown-floor">
          <MarkdownEdit
            v-for="child in markdownData2"
            :key="child[0]"
            v-model="child[1]"
            :markdown-id="child[0]"
            @auto-save="creatFloor(child[0])"
            @handle-del="toggleDelDlg(true, child[0])"
          />
        </div>
        <div
          v-show="!modeType && markdownData2.size < 3"
          class="add-floor square"
          @click="addFloor('markdown2')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
        </div>
        <div v-if="memberList.length" class="member">
          <h2>
            <span class="title-bg">{{
              t('sig.SIG_DETAIL.MAINTAINER_BG')
            }}</span>
            <span class="title-text">{{ t('sig.SIG_DETAIL.MAINTAINER') }}</span>
          </h2>
          <div class="member-box">
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
                    rel="noopener noreferrer"
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
        <div class="markdown-floor">
          <MarkdownEdit
            v-for="child in markdownData3"
            :key="child[0]"
            v-model="child[1]"
            :markdown-id="child[0]"
            @auto-save="creatFloor(child[0])"
            @handle-del="toggleDelDlg(true, child[0])"
          />
        </div>
        <div
          v-show="!modeType && markdownData3.size < 3"
          class="add-floor square"
          @click="addFloor('markdown3')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
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
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
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
        <div class="markdown-floor">
          <MarkdownEdit
            v-for="child in markdownData4"
            :key="child[0]"
            v-model="child[1]"
            :markdown-id="child[0]"
            @auto-save="creatFloor(child[0])"
            @handle-del="toggleDelDlg(true, child[0])"
          />
        </div>
        <div
          v-show="!modeType && markdownData4.size < 3"
          class="add-floor square"
          @click="addFloor('markdown4')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
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
        <div class="markdown-floor">
          <MarkdownEdit
            v-for="child in markdownData5"
            :key="child[0]"
            v-model="child[1]"
            :markdown-id="child[0]"
            @auto-save="creatFloor(child[0])"
            @handle-del="toggleDelDlg(true, child[0])"
          />
        </div>
        <div
          v-show="!modeType && markdownData5.size < 3"
          class="add-floor square"
          @click="addFloor('markdown5')"
        >
          <OIcon>
            <IconAdd />
          </OIcon>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="isDialogVisiable"
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
        {{ t('edit.CONFIRM_DEL1') }}
        <span class="danger1">{{ t('edit.CONFIRM_DEL2') }}</span>
        {{ t('edit.CONFIRM_DEL3') }}
      </h3>
      <!-- TODO: 用户名 -->
      <template #footer>
        <o-button size="small" @click="toggleDelDlg(false)">取消</o-button>
        <o-button size="small" type="primary" @click="confirmDel()">
          确定</o-button
        >
      </template>
    </el-dialog>
  </AppEditTemplate>
</template>
<style lang="scss" scoped>
.danger1 {
  color: #e02020;
}

.editable-floor {
  position: relative;
  z-index: 11;
}
.edit-type {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 12;
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
}

@mixin title {
  text-align: center;
  position: relative;
  height: 64px;
  @media screen and (max-width: 768px) {
    height: 30px;
  }
  .title-bg {
    display: none;
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
.sig-detail {
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
  @media (max-width: 1680px) {
    max-width: 1300px;
  }
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
    .introduction {
      position: relative;
    }
    .brief-introduction {
      position: relative;
      @include section-box;
      padding: 24px;
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
    .markdown-floor {
      position: relative;
      z-index: 11;
      h2 {
        @include title;
      }
      .markdown-main {
        margin-top: 40px;
        padding: 40px;
        box-shadow: var(--o-shadow-l2);
      }
      .markdown-edit {
        margin-top: 40px;
      }
    }
    .meeting {
      position: relative;
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
        box-shadow: var(--o-shadow-l2);
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
          margin-top: var(--o-spacing-h2);
          padding: 0 var(--o-spacing-h7);
          display: flex;
          justify-content: start;
          flex-wrap: wrap;
          gap: 24px 0;
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
        box-shadow: var(--o-shadow-l2);
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
        box-shadow: var(--o-shadow-l2);
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
        font-size: 32px;
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
      top: 104px;
      right: -104px;
      &.first-floor {
        top: 0;
      }
    }
  }
}
@media (max-width: 1100px) {
  .sig-detail {
    padding: 16px 16px var(--o-spacing-h2);
  }
}
</style>

<style lang="scss">
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
  // margin-top: var(--o-spacing-h2);
  background-color: var(--o-color-bg2);
  padding: var(--o-spacing-h2);
  @media screen and (max-width: 768px) {
    margin-top: var(--o-spacing-h5);
    padding: var(--o-spacing-h5);
  }
}
.edit-dialog {
  padding: var(--o-spacing-h2);
  background-color: var(--o-color-bg1);
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    margin: 0 auto;
    max-width: 1424px;
    padding: 0;
    .brief-introduction {
      position: relative;
      @include section-box;
      padding: 40px 24px;

      .brief-introduction-title {
        padding: 16px;
        padding-bottom: 0;
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
        // padding: 16px;
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
  }
  .el-dialog__footer {
    padding: 40px 0 0 0;
    margin: 0 auto;
    max-width: 1424px;
    display: flex;
    gap: 0 24px;
    justify-content: center;
    // background-color: var(--o-color-bg2);
  }
  .edit-floor {
    display: none;
  }
}
</style>
