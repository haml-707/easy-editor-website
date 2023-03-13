import { createI18n } from 'vue-i18n';

import sig from './sig';
import common from './common';

const messages = {
  zh: {
    common: common.zh,
    sig: sig.zh,
  },
  en: {
    common: common.en,
    sig: sig.en,
  },
};

const i18n = createI18n({
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
