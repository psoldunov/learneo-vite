import React from 'react';
import { FormState } from 'types';

const defaultContext: FormState = {
	is_eu: false,
	is_anonymous: false,
	is_trusted_flagger: false,
	service: null,
	reason: null,
	first_name: null,
	first_name_required: false,
	last_name: null,
	last_name_required: false,
	email: null,
	email_required: false,
	country: null,
	urls_count: 1,
	contact_org_name: null,
	contact_job_title: null,
	contact_address: null,
	contact_city: null,
	contact_state: null,
	contact_zipcode: null,
	owner_name: null,
	legal_text: null,
	legal_text_ip: null,
	legal_text_dmca: null,
	updateFormContext: () => {},
};

const FormContext = React.createContext(defaultContext);

export default FormContext;
