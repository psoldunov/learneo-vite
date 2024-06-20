// FormContextProvider.tsx

/**
 * FormContextProvider component that provides a context for form state management.
 *
 * @param children - ReactNode representing the children components
 */
import React, { useState, ReactNode } from 'react';
import NoticeFormContext from '@context/NoticeFormContext'; // Adjust the import path as necessary

interface Props {
	children: ReactNode;
}

const NoticeFormContextProvider: React.FC<Props> = ({ children }) => {
	// Initialize form state using useState hook
	const [formState, setFormState] = useState({
		is_eu: false,
		service: null,
		first_name: null,
		last_name: null,
		email: null,
		urls_count: 1,
		legal_text1: null,
		legal_text2: null,
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
		<NoticeFormContext.Provider value={{ ...formState, updateFormContext }}>
			{children}
		</NoticeFormContext.Provider>
	);
};

export default NoticeFormContextProvider;
