import React, { useState, useCallback } from 'react';
import DisputeFormContext from '@components/legal/context/DisputeFormContext';
import { DisputeFormState } from 'types';
import { v4 as uuidv4 } from 'uuid';

const DisputeFormProvider = ({ children }: { children: React.ReactNode }) => {
	const [formState, setFormState] = useState<DisputeFormState>({
		is_eu: {
			value: false,
			updateField: () => {},
		},
		service: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		first_name: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		last_name: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},
		email: {
			value: '',
			required: true,
			error: false,
			updateField: () => {},
		},

		legal_text1: {
			value: false,
			required: true,
			error: false,
			updateField: () => {},
		},
		legal_text2: {
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
					path_error: false,
					detail_error: false,
					path_error_message: '',
					detail_error_message: '',
				},
			],
			path_required: true,
			detail_required: true,
			updateField: () => {},
		},
	});

	// Function to update properties of a specific field in the form state
	const updateField = useCallback(
		(
			fieldName: keyof DisputeFormState,
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
		const field = formState[key as keyof DisputeFormState];
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
								path_required: boolean;
								detail_required: boolean;
						  }[];
					required?: boolean;
					error?: boolean;
				}) => updateField(key as keyof DisputeFormState, updates),
			},
		};
	}, {}) as DisputeFormState;

	return (
		<DisputeFormContext.Provider value={{ ...formStateWithUpdate }}>
			{children}
		</DisputeFormContext.Provider>
	);
};

export default DisputeFormProvider;
