import { Reason, Country, Business, Violation } from 'types';

import reasons from './json/reasons.json';
import eeaCountries from './json/eeaCountries.json';
import allCountries from './json/allCountries.json';
import businesses from './json/learneoBusinesses.json';
import privacyViolations from './json/privacyViolations.json';

export function getReasons(): Reason[] {
	return reasons.map((reason: Reason) => {
		return {
			name: reason.name,
			sublabel: reason.sublabel,
		};
	});
}

export function getEEACountries(): Country[] {
	return eeaCountries.map((country: Country) => {
		return {
			name: country.name,
			alpha2: country.alpha2,
			alpha3: country.alpha3,
			numeric: country.numeric,
		};
	});
}

export function getAllCountries(): Country[] {
	return allCountries.map((country: Country) => {
		return {
			name: country.name,
			alpha2: country.alpha2,
			alpha3: country.alpha3,
			numeric: country.numeric,
		};
	});
}

export function getAllCountriesWithoutEEA(): Country[] {
	const eeaCountries = getEEACountries();
	const allCountries = getAllCountries();
	return allCountries.filter((country: Country) => {
		return !eeaCountries.some((eeaCountry: Country) => {
			return eeaCountry.alpha2 === country.alpha2;
		});
	});
}

export function getBusinesses(): Business[] {
	return businesses.map((business: Business) => {
		return {
			name: business.name,
			icon: business.icon,
			url: business.url,
		};
	});
}

export function getPrivacyViolations(): Violation[] {
	return privacyViolations.map((violation: Violation) => {
		return {
			name: violation.name,
		};
	});
}
