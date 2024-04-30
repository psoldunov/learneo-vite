
import { DisputeFormState } from 'types';
import React from 'react';

const defaultContext: DisputeFormState = {
	is_eu: {
		value: false,
		updateField: () => { },
	},
	service: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	first_name: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	last_name: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},
	email: {
		value: '',
		required: true,
		error: false,
		updateField: () => { },
	},

	legal_text1: {
		value: false,
		required: true,
		error: false,
		updateField: () => { },
	},
	legal_text2: {
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
				path_error: false,
				detail_error: false,
				path_error_message: '',
				detail_error_message: '',
			},
		],
		path_required: true,
		detail_required: true,
		updateField: () => { },
	},
};

const DisputeFormContext = React.createContext(defaultContext);

export default DisputeFormContext;
