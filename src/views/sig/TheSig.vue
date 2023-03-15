<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useLangStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useWindowResize from '@/components/hooks/useWindowResize';

import BreadCrumbs from '@/components/BreadCrumbs.vue';
import SigMeeting from './SigMeeting.vue';
import OIcon from '@/components/OIcon.vue';
import AppFooter from '@/components/AppFooter.vue';

import MobileRepositoryList from './MobileRepositoryList.vue';
import ContributList from './ContributList.vue';
import AppPaginationMo from '@/components/AppPaginationMo.vue';

import IconEmail from '~icons/app/icon-mail.svg';
import IconGitee from '~icons/app/icon-gitee.svg';
import IconSearch from '~icons/app/icon-search.svg';

import {
  getSigDetail,
  getSigMember,
  getSigRepositoryList,
  getSigList,
} from '@/api/api-sig';

interface SIGLIST {
  group_name: string;
  maillist: string;
}

const props = defineProps({
  modeType: {
    type: Boolean,
    default: false,
  },
});

console.log(props.modeType);

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
  <div class="sig-detail">
    <BreadCrumbs
      bread1="SIG"
      :bread2="sigDetailName"
      link1="/zh/sig/sig-list/"
    />
    <div class="content">
      <div class="brief-introduction">
        <h2 class="brief-introduction-title">
          {{ sigDetailName }}
          <a :href="giteeHomeLink" target="_blank">
            <OIcon class="icon"> <IconGitee /> </OIcon
          ></a>
        </h2>
        <p v-if="sigMemberData.description" class="no-meeting">
          {{ sigMemberData.description }}
        </p>
        <p v-else class="no-meeting">
          {{ t('sig.SIG_DETAIL.SIG_EMPTY_TEXT1')
          }}<a
            target="_blank"
            :href="`https://gitee.com/openeuler/community/tree/master/sig/${sigDetailName}`"
            >{{ t('sig.SIG_DETAIL.SIG_EMPTY_TEXT2') }}</a
          >{{ t('sig.SIG_DETAIL.SIG_EMPTY_TEXT3') }}
        </p>
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
        <p v-else class="no-meeting">
          {{ t('sig.SIG_DETAIL.NO_MEETINGS') }}
        </p>
      </div>
      <div v-if="memberList.length" class="member">
        <h2>
          <span class="title-bg">{{ t('sig.SIG_DETAIL.MAINTAINER_BG') }}</span>
          <span class="title-text">{{ t('sig.SIG_DETAIL.MAINTAINER') }}</span>
        </h2>
        <div class="member-box">
          <h5>{{ sigDetailName + ' ' + t('sig.SIG_DETAIL.MAINTAINER_EN') }}</h5>
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
                <a :href="`https://gitee.com/${item.gitee_id}`" target="_blank">
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
                  }}<span v-show="index !== scope.row.maintainers.length - 1">{{
                    lang === 'zh' ? '、' : ',&nbsp;'
                  }}</span>
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
          <span class="title-text">{{ t('sig.SIG_DETAIL.CONTRIBUTION') }}</span>
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
  <AppFooter />
</template>
<style lang="scss" scoped>
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
      p {
        margin-top: var(--o-spacing-h5);
        font-size: var(--o-font-size-text);
        line-height: 22px;
        color: var(--o-color-text3);
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
      .no-meeting {
        padding: var(--o-spacing-h5) 0;
        text-align: center;
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
  }
}
@media (max-width: 1100px) {
  .sig-detail {
    padding: 16px 16px var(--o-spacing-h2);
  }
}
.mask {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}
</style>
