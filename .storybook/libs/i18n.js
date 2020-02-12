import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../../public/locales/en/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
	},
	fallbackLng: 'en',
	react: {
		useSuspense: false,
		wait: true,
	},
});

export default i18n;
