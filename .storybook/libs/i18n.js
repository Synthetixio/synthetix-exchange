import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../../src/shared/translations/en.json';

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
	},
	lng: 'en',
	fallbackLng: 'en',
	react: {
		useSuspense: false,
		wait: true,
	},
});

export default i18n;
