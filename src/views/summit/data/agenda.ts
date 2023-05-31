export default {
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
};
