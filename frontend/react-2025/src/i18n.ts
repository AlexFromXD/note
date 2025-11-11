import en from '@/locales/en/common.json'
import zhTW from '@/locales/zh-TW/common.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: en,
  },
  'zh-TW': {
    translation: zhTW,
  },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: localStorage.getItem('userLanguage') || 'zh-TW',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    useSuspense: true,
  },
})

export default i18n

// 用法：
// import { useTranslation } from 'react-i18next'
//
// function Settings() {
//   const { t } = useTranslation()
//
//   return (
//     <div>
//       <h1>{t('settings')}</h1>           {/* 顯示 "Settings" 或 "設定" */}
//     </div>
//   )
// }
