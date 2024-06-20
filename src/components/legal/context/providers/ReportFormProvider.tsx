import React, { useState, useCallback } from 'react';
import ReportFormContext from '@components/legal/context/ReportFormContext';
import { ReportFormState } from 'types';
import { v4 as uuidv4 } from 'uuid';

const ReportFormProvider = ({ children }: { children: React.ReactNode }) => {
	const [formState, setFormState] = useState<ReportFormState>({
		is_eu: {
			value: false,
			updateField: () => {},
		},
		is_anonymous: {
			value: false,
			updateField: () => {},
		},
		is_trusted_flagger: {
			value: false,
			updateField: () => {},
		},
		service: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		reason: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		first_name: {
			value: '',
			required: true,
			disabled: false,
			error: false,
			updateField: () => {},
		},
		last_name: {
			value: '',
			required: true,
			disabled: false,
			error: false,
			updateField: () => {},
		},
		email: {
			value: '',
			required: true,
			disabled: false,
			error: false,
			updateField: () => {},
		},
		country: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		contact_org_name: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		contact_job_title: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		contact_address: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		contact_city: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		contact_state: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		contact_zipcode: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		owner_name: {
			value: '',
			required: false,
			error: false,
			updateField: () => {},
		},
		legal_text: {
			value: false,
			required: true,
			error: false,
			updateField: () => {},
		},
		legal_text_ip: {
			value: false,
			required: false,
			error: false,
			updateField: () => {},
		},
		legal_text_dmca: {
			value: false,
			required: false,
			error: false,
			updateField: () => {},
		},
		urls: {
			value: [
				{
					id: uuidv4(),
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
			updateField: () => {},
		},
	});

	// Function to update properties of a specific field in the form state
	const updateField = useCallback(
		(
			fieldName: keyof ReportFormState,
			updates: { value?: any; required?: boolean; error?: boolean }
		) => {
			setFormState((prevState) => ({
				...prevState,
				[fieldName]: {
					...prevState[fieldName],
					...updates,
				},
			}));
		},
		[]
	);

	// Enhance the initial form state with updateField functions for each field
	const formStateWithUpdate = Object.keys(formState).reduce((acc, key) => {
		const field = formState[key as keyof ReportFormState];
		return {
			...acc,
			[key]: {
				...field,
				updateField: (updates: {
					value?:
						| string
						| string[]
						| boolean
						| {
								path: string;
								detail: string;
								privacy_types: string;
								path_required: boolean;
								detail_required: boolean;
								privacy_types_required: boolean;
						  }[];
					required?: boolean;
					error?: boolean;
				}) => updateField(key as keyof ReportFormState, updates),
			},
		};
	}, {}) as ReportFormState;

	return (
		<ReportFormContext.Provider value={{ ...formStateWithUpdate }}>
			{children}
		</ReportFormContext.Provider>
	);
};

export default ReportFormProvider;
