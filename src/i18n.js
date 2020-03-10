import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHRBackend from 'i18next-xhr-backend';

i18n
	.use(XHRBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		detection: {
			order: ['navigator', 'localStorage'],
		},
		react: {
			useSuspense: true,
			wait: true,
		},
	});

export default i18n;
