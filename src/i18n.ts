import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from 'shared/translations/en.json';

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
	},
	fallbackLng: 'en',
	lng: 'en',
	react: {
		useSuspense: true,
		wait: true,
	},
});

export default i18n;
