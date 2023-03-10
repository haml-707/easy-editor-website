<script setup lang="ts">
import { ref, onMounted } from 'vue';
import liver from '../data/liver';
import liveActiveBg from '../img/live-active-bg.png';

const isTest = ref(false);
const liveUrl = ref('');
const renderData: any = ref(liver.liveData1);
const roomId = ref(0);
const setLiveRoom = (item: any, index: number): void => {
  roomId.value = index;
  createUserId(isTest.value ? item.liveTestId : item.liveId);
};

function createUserId(liveId: number) {
  let digit = Math.round(Math.random() * 10);
  digit > 3 ? digit : (digit = 3);

  let returnId = '',
    userName = '';
  const charStr =
    '0123456789@#$%&~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < digit; i++) {
    const index = Math.round(Math.random() * (charStr.length - 1));
    returnId += charStr.substring(index, index + 1);
  }
  userName = returnId;
  liveUrl.value = `https://vhall.huawei.com/v2/watch/${liveId}?lang=zh&thirdId=${userName}`;
}
// const state = ref(-1);
const height = ref(800);
function setHeight(data: any) {
  if (data.height === 'auto') {
    height.value = 550;
  } else if (data.height) {
    height.value = parseInt(data.height);
  }
}
function messageEvent() {
  window.addEventListener(
    'message',
    function (event) {
      let data = '';
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        data = event.data;
      }

      // data.state=2,直播结束
      setHeight(data);
      // console.log(state.value, '收到', data);
      // console.log('收到' + event.origin + '消息:' + data);
    },
    false
  );
}
onMounted(async () => {
  isTest.value = window.location.host.includes('test.osinfra');
  createUserId(
    isTest.value ? renderData.value[0].liveTestId : renderData.value[0].liveId
  );
  messageEvent();
});

// 背景
const ActiveBg = `url(${liveActiveBg})`;

const liveRoom = ref(renderData.value[0].name);
const changeLive = (val: number): void => {
  createUserId(val);
};
</script>

<template>
  <h2>精彩回顾</h2>
  <div class="live-room">
    <div class="select-room">
      <el-select v-model="liveRoom" clearable filterable @change="changeLive">
        <el-option
          v-for="item in renderData"
          :key="item.id"
          :label="item.name"
          :value="isTest ? item.liveTestId : item.liveId"
        />
      </el-select>
    </div>
    <iframe
      ref="livePage"
      :height="height"
      allow="camera *;microphone *;"
      scolling="no"
      :src="liveUrl"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      class="live-room-video"
    ></iframe>
    <div class="live-room-web">
      <div class="live-room-web-itembox">
        <div
          v-for="(item, index) in renderData"
          :key="item.id"
          :class="[
            'link',
            roomId === index ? 'link-active' : '',
            index === 0 ? 'link-main' : ' ',
          ]"
          @click="setLiveRoom(item, index)"
        >
          <p class="name">{{ item.name }}</p>
          <!-- <p v-if="className === 'odd2022' && index !== 0" class="sub">
            分论坛
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2 {
  font-weight: 400;
  color: var(--o-color-text1);
  font-size: 20px;
  line-height: 28px;
  text-align: center;
}
.select-room {
  display: none;
  :deep(.o-select) {
    width: 100%;
    .el-input {
      height: 48px;
    }
  }
  @media (max-width: 1100px) {
    display: block;
  }
}
.live-room {
  .live-room-video {
    margin-bottom: var(--o-spacing-h4);
    width: 100%;
    display: block;
    border: none;
    @media (max-width: 780px) {
      margin-top: var(--o-spacing-h5);
    }
  }
  .live-room-web {
    display: block;
    @media (max-width: 1100px) {
      display: none;
    }
    .live-room-web-itembox {
      display: flex;
      flex-direction: row;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      flex-direction: row;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      .link-main {
        grid-column: 1/6;
      }
      &.odd2021 {
        display: grid;
        grid-template-columns: 300px 1fr 300px;
        grid-template-areas: 'a b c';
        gap: 16px;
        width: 100%;
        .link-main {
          grid-area: b;
        }
      }
      .link {
        flex: 1;
        padding: var(--o-spacing-h6) 0;
        cursor: pointer;
        background-color: var(--o-color-bg2);
        height: 88px;
        text-align: center;
        display: grid;
        align-items: center;
        border: 1px solid var(--o-color-brand1);
        p {
          color: var(--o-color-text1);
          font-size: var(--o-font-size-h7);
          line-height: var(--o-line-height-h7);
        }

        &:hover {
          box-shadow: var(--o-shadow-l2_hover);
        }
      }

      .link-active {
        background: v-bind('ActiveBg') no-repeat center/cover;
        p {
          color: #fff;
        }
      }
    }
  }
}
</style>
