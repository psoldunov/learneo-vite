import formsControl from '@functions/formsControl';

export default function contactPage() {
	const forms = document.querySelectorAll('form');
	forms.forEach(formsControl);
}
