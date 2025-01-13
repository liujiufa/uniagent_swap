import i18n from "i18next";
import enUsTrans from "./en.json";
import zhCnJTrans from "./zhjt.json";
import zhCnFTrans from "./zh.json";
import { initReactI18next } from "react-i18next";
import { LOCAL_KEY } from "../config";
// en = 英文，zh=中，ja=日，ko=韩，ar=阿拉伯
// export const zh = "zh-CN";
// export const zh_tw = "zh-TW";
// export const en = "en";
i18n
  .use(initReactI18next) //init i18next
  .init({
    //引入资源文件
    resources: {
      "zh-CN": {
        translation: zhCnJTrans,
      },
      "zh-TW": {
        translation: zhCnFTrans,
      },
      en: {
        translation: enUsTrans,
      },
    },
    //选择默认语言，选择内容为上述配置中的key，即en/zh
    // fallbackLng: "en",
    fallbackLng: window.localStorage.getItem(LOCAL_KEY) || "en",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
