import { ReportFormState } from 'types';
import validateUrls from './validateUrls';

export default function validateFields(
	context: ReportFormState,
	setProcessing: (value: boolean) => void,
	setError: ({ value, message }: { value: boolean; message: string }) => void
) {
	let formIsValid = true;
	if (!context.service.value) {
		context.service.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.reason.value) {
		context.reason.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.country.value) {
		context.country.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.first_name.value && context.first_name.required) {
		context.first_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.last_name.value && context.last_name.required) {
		context.last_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.email.value && context.email.required) {
		context.email.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_org_name.value && context.contact_org_name.required) {
		context.contact_org_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_job_title.value && context.contact_job_title.required) {
		context.contact_job_title.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_address.value && context.contact_address.required) {
		context.contact_address.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_city.value && context.contact_city.required) {
		context.contact_city.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_state.value && context.contact_state.required) {
		context.contact_state.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.contact_zipcode.value && context.contact_zipcode.required) {
		context.contact_zipcode.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.owner_name.value && context.owner_name.required) {
		context.owner_name.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.legal_text.value) {
		context.legal_text.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.legal_text_ip.value && context.legal_text_ip.required) {
		context.legal_text_ip.updateField({ error: true });
		formIsValid = false;
	}
	if (!context.legal_text_dmca.value && context.legal_text_dmca.required) {
		context.legal_text_dmca.updateField({ error: true });
		formIsValid = false;
	}
	if (!validateUrls(context.urls)) {
		formIsValid = false;
	}
	if (!formIsValid) {
		setProcessing(false);
		setError({ value: true, message: 'Please fill out all required fields' });
		return false;
	}
	return true;
}
