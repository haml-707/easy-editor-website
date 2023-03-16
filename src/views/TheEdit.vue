<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconSearch from '~icons/app/icon-search.svg';
import IconArrowRight from '~icons/app/icon-arrow-right.svg';
import { profileData } from '@/api/api-easy-edit';

const router = useRouter();
profileData().then((res) => {
  if (res.statusCode === 200) {
    editData.value = res.data;
  } else {
    editData.value = [];
  }
});

const editData = ref([
  {
    name: 'A-Tune',
    type: '峰会',
    lang: '中文',
    path: '../zh/sig/sig-detail/?name=A-Tune',
    time: '2023-3-08',
  },
  {
    name: 'A-Tune',
    type: '峰会',
    lang: '中文',
    path: '../zh/sig/sig-detail/?name=A-Tune',
    time: '2023-3-08',
  },
  {
    name: 'A-Tune',
    type: '峰会',
    lang: '中文',
    path: '../zh/sig/sig-detail/?name=A-Tune',
    time: '2023-3-08',
  },
]);
const total = ref(0);
const currentPage = ref(1);
const totalPage = ref(0);
const layout = ref('sizes, prev, pager, next, slot, jumper');

const queryData = reactive({
  page: 1,
  per_page: 10,
  search: '',
});

const pageName = ref('');

// const optionQuery = reactive({
//   page: 1,
//   per_page: 40,
//   keyword: '',
// });

const goEdit = (path: string) => {
  router.push(`/zh/edit/${path}`);
};

const handleSizeChange = (val: number) => {
  queryData.per_page = val;
  totalPage.value = Math.ceil(total.value / val);
};

const handleCurrentChange = (val: number) => {
  queryData.page = val;
  currentPage.value = val;
};

watch(
  () => queryData,
  () => {
    console.log('发送请求');
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div class="edit-table">
    <h2 class="edit-table-title">可自编辑页面</h2>
    <div class="select-box">
      <div class="select-item">
        <div class="select-label">页面名称</div>
        <el-select v-model="pageName" filterable clearable>
          <template #prefix>
            <OIcon>
              <IconSearch />
            </OIcon>
          </template>
          <el-option
            v-for="item in 3"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div class="select-item">
        <div class="select-label">页面名称</div>
        <el-select v-model="pageName" filterable clearable>
          <template #prefix>
            <OIcon>
              <IconSearch />
            </OIcon>
          </template>
          <el-option
            v-for="item in 3"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div class="input-container"></div>
    <el-table :data="editData">
      <el-table-column label="页面名称" prop="siteName" min-width="110">
      </el-table-column>
      <el-table-column label="页面类别" prop="type" min-width="110">
      </el-table-column>
      <el-table-column label="页面语言" prop="locale" min-width="110">
      </el-table-column>
      <el-table-column label="目标页面链接" prop="path" min-width="310">
        <template #default="scope">
          <a :href="scope.row.path" target="_blank"> {{ scope.row.path }} </a>
        </template>
      </el-table-column>
      <el-table-column label="最新修改时间" prop="updated_at" min-width="110">
      </el-table-column>
      <el-table-column min-width="110">
        <OButton
          class="start-edit"
          animation
          type="text"
          @click="goEdit('A-Tune')"
          >开始编辑
          <template #suffixIcon>
            <OIcon>
              <IconArrowRight></IconArrowRight>
            </OIcon>
          </template>
        </OButton>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size="queryData.per_page"
      v-model:currentPage="queryData.page"
      class="pagination"
      :page-sizes="[5, 10, 20, 40, 80]"
      :layout="layout"
      :total="total"
      :background="true"
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span class="slot-content">{{ currentPage }}/{{ totalPage }}</span>
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.edit-table {
  padding: 64px 40px;
  background-color: var(--o-color-bg1);

  .edit-table-title {
    font-weight: 300;
    text-align: center;
    font-size: var(--o-font-size-h3);
  }
  .select-box {
    display: flex;
    align-items: flex-start;
    align-items: center;
    gap: 0 64px;
    margin-top: 40px;
    .select-item {
      display: flex;
      align-items: center;
      .select-label {
        margin-right: 24px;
      }
    }
  }
  .el-table {
    margin-top: 24px;
    .o-button {
      .o-icon {
        font-size: var(--o-font_size-h4);
        color: var(--o-color-primary1);
      }
    }
  }
}
</style>
