import { getEEACountries } from '@functions/data/dataHelpers';
import { Location } from 'types';

function checkSavedEEAStatus(): boolean | string {
	if (sessionStorage.getItem('eeaUser')) {
		if (sessionStorage.getItem('eeaUser') === 'true') {
			console.log('Saved EEA status is true');
			return true;
		}
		console.log('Saved EEA status is false');
		return false;
	}
	return 'No saved status';
}

function isEEACountry(
	searchTerm: string
):
	| { name: string; alpha2: string; alpha3: string; numeric: string }
	| undefined {
	const eeaCountries = getEEACountries();

	for (let country of eeaCountries) {
		if (
			country.name === searchTerm ||
			country.alpha2 === searchTerm ||
			country.alpha3 === searchTerm ||
			country.numeric === searchTerm
		) {
			return country;
		}
	}

	return undefined;
}

async function getLocation(): Promise<Location | null> {
	const url =
		'https://ipapi.co/json/?key=7mWXjXh3MPnag87BloSDJYvLDC4ZFibUWnTiTcaNqHzSIdkw2I';
	const options = {
		method: 'GET',
	};

	try {
		const response = await fetch(url, options);
		const result = await response.text();
		const json = JSON.parse(result);
		return json;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function isEEAUser() {
	const setStatus = (status: boolean) => {
		sessionStorage.setItem('eeaUser', status.toString());
	};

	switch (checkSavedEEAStatus()) {
		case true:
			return true;
		case false:
			return false;
		default:
			console.log(checkSavedEEAStatus());
			break;
	}

	const location = await getLocation();
	//@ts-ignore
	const check = isEEACountry(location.country_name);

	if (check !== undefined) {
		console.log('User is in EEA, setting sessionStorage to true');
		setStatus(true);
		return true;
	}

	console.log('User is not in EEA, setting sessionStorage to false');
	setStatus(false);
	return false;
}

export function parameterControl() {
	const params = new URLSearchParams(window.location.search);

	// parameters may be ?region=eu or ?region=row if eu set sessionStorage EEA User to true if row set to false
	if (params.has('region')) {
		const region = params.get('region');
		if (region === 'eu') {
			sessionStorage.setItem('eeaUser', 'true');
		} else if (region === 'row') {
			sessionStorage.setItem('eeaUser', 'false');
		}
	}
}