import { DisputeFormState } from 'types';
import validateUrlsDispute from './validateUrlsDispute';

export default function validateFieldsDispute(
	context: DisputeFormState,
	setProcessing: (value: boolean) => void,
	setError: ({ value, message }: { value: boolean; message: string }) => void
) {
	let formIsValid = true;
	if (!context.service.value) {
		context.service.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.first_name.value) {
		context.first_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.last_name.value) {
		context.last_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.email.value) {
		context.email.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.legal_text1.value) {
		context.legal_text1.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.legal_text2.value && context.legal_text2.required) {
		context.legal_text2.updateField({ error: true });
		formIsValid = false;
	}
	if (!validateUrlsDispute(context.urls)) {
		formIsValid = false;
	}
	if (!formIsValid) {
		setProcessing(false);
		setError({ value: true, message: 'Please fill out all required fields' });
		return false;
	}
	return true;
}
