import { isEEAUser } from '@functions/isEEAUser';

async function redirectControl() {
	let eeaUserResult = await isEEAUser();

	if (!eeaUserResult) {
		window.location.href = '/legal';
	}
	return;
}

export default function DSAHostingPage() {
	redirectControl();
}