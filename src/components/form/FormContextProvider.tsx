// FormContextProvider.tsx

/**
 * FormContextProvider component that provides a context for form state management.
 *
 * @param children - ReactNode representing the children components
 */
import React, { useState, ReactNode } from 'react';
import FormContext from '@context/FormContext'; // Adjust the import path as necessary

interface Props {
	children: ReactNode;
}

const FormContextProvider: React.FC<Props> = ({ children }) => {
	// Initialize form state using useState hook
	const [formState, setFormState] = useState({
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
	});

	/**
	 * Function to update the form context state based on the key and value provided.
	 *
	 * @param key - keyof typeof formState representing the key to update in the form state
	 * @param value - any representing the new value to set for the key
	 */
	const updateFormContext = (key: keyof typeof formState, value: any) => {
		setFormState((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	// Render the FormContext.Provider with the updated form state and updateFormContext function
	return (
		<FormContext.Provider value={{ ...formState, updateFormContext }}>
			{children}
		</FormContext.Provider>
	);
};

export default FormContextProvider;
