import issueImg from '../img/issue.png';
import PRImg from '../img/PR.png';
import starImg from '../img/star.png';
import userImg from '../img/user.png';
import aigcImg from '../img/aigc.png';

import liver from './liver';
import agenda from './agenda';
import guest from './guest';
import partner from './partner';

export default {
  detail: [
    '昇思MindSpore全球生态峰会是昇思社区的年度盛会，将进一步提升昇思社区在人工智能开源领域的影响力，促进社区成员与生态伙伴的合作，繁荣AI产业生态。峰会立足于人工智能技术发展趋势，围绕AI框架领域分享前沿技术、展示创新方案，汇聚专家学者、企业领袖、优秀开发者碰撞思想火花，凝聚发展共识，加速科研创新与应用落地创新。',
    '峰会开展形式包括闭门会+主论坛+分论坛，为期2天。',
  ],
  statistics: [
    { img: userImg, number: '1.9M+', name: '社区用户' },
    { img: starImg, number: '19.6K+', name: '总Star数' },
    { img: issueImg, number: '20.7K+', name: '总Issue数' },
    { img: PRImg, number: '48.6K+', name: '总PR数' },
  ],
  liver,
  agenda,
  guest,
  interaction: {
    title: '互动亮点',
    more: '了解更多',
    interactionList: [
      {
        title: 'AIGC大模型体验',
        img: aigcImg,
        detail:
          '基于昇思MindSpore的悟空画画大模型，借助目前最大的中文开源多模态数据集进行训练，拥有优秀的中文文本-图像生成能力。',
        moreLink: '',
      },
      {
        title: '手语数字人交互',
        img: aigcImg,
        detail:
          '千博信息打造手语教考一体机，帮助有听力障碍的学生随学、随练、随考，助力提升聋人群体的沟通质量。',
        moreLink: '',
      },
      {
        title: '机器人交互',
        img: aigcImg,
        detail: '介绍待定',
        moreLink: '',
      },
    ],
  },
  partner,
};
