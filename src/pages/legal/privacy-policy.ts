const localeInfo = {
	default: {
		code: 'en',
		url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_master.html',
	},
	supported: [
		{
			code: 'en',
			url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_master.html',
		},
		{
			code: 'de',
			url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_DE-DE.html',
		},
		{
			code: 'fr',
			url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_FR-FR.html',
		},
		{
			code: 'nl',
			url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_NL.html',
		},
		{
			code: 'es',
			url: 'https://assets.coursehero.com/privacy-policies/privacy_policy_ES-LA.html',
		},
	],
};

type LocalizedContent = {
	[key: string]: {
		[key: string]: string;
	};
};

const localizedContent: LocalizedContent = {
	en: {
		'language-selector': 'English',
		'privacy-policy': 'Privacy Policy',
		'back-to-legal-center': 'Back to Legal Center',
		paragraph:
			'In addition to reviewing our Privacy Policy, please refer to the resources below for further information about data privacy and submitting a privacy request.',
	},
	de: {
		'language-selector': 'Deutsch',
		'privacy-policy': 'Datenschutzrichtlinie',
		'back-to-legal-center': 'Zurück zum Rechtszentrum',
		paragraph:
			'Neben der Überprüfung unserer Datenschutzrichtlinie finden Sie unten weitere Informationen zum Datenschutz und zur Einreichung einer Datenschutzanfrage.',
	},
	fr: {
		'language-selector': 'Français',
		'privacy-policy': 'Politique de confidentialité',
		'back-to-legal-center': 'Retour au centre juridique',
		paragraph:
			'En plus de consulter notre politique de confidentialité, veuillez vous référer aux ressources ci-dessous pour plus d’informations sur la confidentialité des données et la soumission d’une demande de confidentialité.',
	},
	nl: {
		'language-selector': 'Nederlands',
		'privacy-policy': 'Privacybeleid',
		'back-to-legal-center': 'Terug naar het juridisch centrum',
		paragraph:
			'Naast het bekijken van ons privacybeleid, raadpleegt u de onderstaande bronnen voor meer informatie over gegevensprivacy en het indienen van een privacyverzoek.',
	},
	es: {
		'language-selector': 'Español',
		'privacy-policy': 'Política de privacidad',
		'back-to-legal-center': 'Volver al Centro Legal',
		paragraph:
			'Además de revisar nuestra Política de privacidad, consulte los recursos a continuación para obtener más información sobre la privacidad de los datos y el envío de una solicitud de privacidad.',
	},
};

function formatLegalContent(data: string) {
	const parser = new DOMParser();
	const html = parser.parseFromString(data, 'text/html');

	const elementsToRemove: string[] = ['h1', 'meta'];

	const anchorTags: HTMLElement[] = Array.from(
		html.querySelectorAll('a[onclick]')
	);

	anchorTags.forEach((anchor) => {
		const onclick = anchor.getAttribute('onclick');
		const id = onclick?.split("document.getElementById('")[1].split("'")[0];
		anchor.setAttribute('href', `#${id}`);
		anchor.removeAttribute('onclick');
	});

	elementsToRemove.forEach((element) => {
		const elementToRemove = html.querySelector(element);
		elementToRemove?.remove();
	});

	return html.querySelector('div.unified-privacy-policy');
}

function getLanguageParameter() {
	const urlParams = new URLSearchParams(window.location.search);
	const language = urlParams.get('lang');
	return language;
}

function localeManager() {
	const language = getLanguageParameter();

	if (language === null) {
		const storedLanguage = sessionStorage.getItem('language');
		if (storedLanguage) {
			return storedLanguage;
		}
		return localeInfo.default.code;
	}

	const supportedLanguages = localeInfo.supported.map((locale) => locale.code);

	if (supportedLanguages.includes(language)) {
		sessionStorage.setItem('language', language);
		return language;
	}

	return localeInfo.default.code;
}

async function fetchLegalContent(selector: string, url: string) {
	const container = document.querySelector(selector);

	fetch(url)
		.then((response) => response.text())
		.then((data) => {
			const formattedData = formatLegalContent(data);
			container?.appendChild(formattedData!);
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}

function localizeStaticContent(locale: string) {
	const elements = document.querySelectorAll('[data-localize]');
	const html = document.querySelector('html');

	html?.setAttribute('lang', locale);

	elements.forEach((element) => {
		const key = element.getAttribute('data-localize');

		if (key && localizedContent[locale] && localizedContent[locale][key]) {
			const localizedText = localizedContent[locale][key];
			element.textContent = localizedText;
		} else {
			console.error(
				`Localization key "${key}" not found for locale "${locale}"`
			);
		}
	});
}

export default function PrivacyPolicyPage() {
	const language = localeManager();
	const locale = localeInfo.supported.find(
		(locale) => locale.code === language
	);
	const url = locale ? locale.url : localeInfo.default.url;

	fetchLegalContent('[el-content-body]', url);

	language !== localeInfo.default.code &&
		localizeStaticContent(language.toString());
}
