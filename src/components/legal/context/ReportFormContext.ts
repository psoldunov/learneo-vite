
import { ReportFormState } from 'types';
import React from 'react';

const defaultContext: ReportFormState = {
	is_eu: {
		value: false,
		updateField: () => { },
	},
	is_anonymous: {
		value: false,
		updateField: () => { },
	},
	is_trusted_flagger: {
		value: false,
		updateField: () => { },
	},
	service: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	reason: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	first_name: {
		value: '',
		required: false,
		disabled: false,
		error: false,
		updateField: () => { },
	},
	last_name: {
		value: '',
		required: false,
		disabled: false,
		error: false,
		updateField: () => { },
	},
	email: {
		value: '',
		required: false,
		disabled: false,
		error: false,
		updateField: () => { },
	},
	country: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	contact_org_name: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	contact_job_title: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	contact_address: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	contact_city: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	contact_state: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	contact_zipcode: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	owner_name: {
		value: '',
		required: false,
		error: false,
		updateField: () => { },
	},
	legal_text: {
		value: false,
		required: true,
		error: false,
		updateField: () => { },
	},
	legal_text_ip: {
		value: false,
		required: false,
		error: false,
		updateField: () => { },
	},
	legal_text_dmca: {
		value: false,
		required: false,
		error: false,
		updateField: () => { },
	},
	urls: {
		value: [
			{
				id: '',
				path: '',
				detail: '',
				detail_required: false,
				privacy_types: [],
				path_error: false,
				detail_error: false,
				privacy_types_error: false,
				path_error_message: '',
				detail_error_message: '',
			},
		],
		path_required: true,
		privacy_types_required: false,
		updateField: () => { },
	},
};

const ReportFormContext = React.createContext(defaultContext);

export default ReportFormContext;
