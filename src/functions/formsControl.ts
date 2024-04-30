import { showElement, hideElement } from '@functions/globals';

const formsControl = (formEl: HTMLFormElement) => {
	const inputs = Array.from(
		formEl.querySelectorAll('[form-input-element]')
	) as HTMLInputElement[];

	if (!inputs.length) return;

	const handleFocus = (label: HTMLElement) => {
		hideElement(label);
	};

	const handleBlur = (input: HTMLInputElement, label: HTMLElement) => {
		if (!input.value.length) {
			showElement(label);
		}
	};

	const inputCheckOnPageLoad = (
		input: HTMLInputElement,
		label: HTMLElement
	) => {
		if (input.value.length) {
			hideElement(label, '0ms');
		}
	};

	inputs.forEach((input) => {
		const inputLabel = input.previousElementSibling as HTMLElement;
		inputCheckOnPageLoad(input, inputLabel);
		input.addEventListener('focus', () => handleFocus(inputLabel));
		input.addEventListener('blur', () => handleBlur(input, inputLabel));
	});

	const submitButtons = formEl.querySelectorAll<HTMLElement>(
		'[form-submit-custom]'
	)!;

	submitButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const parentElement = button.parentElement;
			if (parentElement) {
				const submitDefault = parentElement.querySelector('[form-submit-default]') as HTMLElement;
				submitDefault?.click();
			}
		});
	});
};

export default formsControl;
