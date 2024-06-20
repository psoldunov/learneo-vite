import React, { useState } from 'react';
import RadioButton from './RadioButton';
import FormContext from '@context/FormContext';
import { Reason } from 'types';

export default function RadioGroup({
	data,
	name,
	setError,
}: {
	data: Reason[];
	name: string;
	setError: (error: boolean) => void;
}) {
	const { service, urls_count, is_trusted_flagger, updateFormContext } =
		React.useContext(FormContext);

	const [selected, setSelected] = useState('');
	// Add a state to manage the visibility of radio buttons
	const [showAll, setShowAll] = useState(true);

	// Handler to reset the form
	const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault(); // This is actually not necessary for a button, unless it's a submit button in a form
		setSelected('');
		setShowAll(true); // Show all radio buttons again
		updateFormContext(name, null);
		updateFormContext('is_anonymous', false);
		updateFormContext('first_name', null);
		updateFormContext('last_name', null);
		updateFormContext('email', null);
		updateFormContext('contact_org_name', null);
		updateFormContext('contact_job_title', null);
		updateFormContext('contact_address', null);
		updateFormContext('contact_city', null);
		updateFormContext('contact_state', null);
		updateFormContext('contact_zipcode', null);
		updateFormContext('owner_name', null);
		updateFormContext('legal_text', null);
		updateFormContext('legal_text_ip', null);

		for (let i = 0; i < urls_count; i++) {
			updateFormContext(`privacy_types_url_${i + 1}`, []);
			updateFormContext(`path_url_${i + 1}`, null);
			updateFormContext(`detail_url_${i + 1}`, null);
		}

		updateFormContext('urls_count', 1);

		if (!is_trusted_flagger) {
			updateFormContext('first_name_required', false);
			updateFormContext('last_name_required', false);
			updateFormContext('email_required', false);
		}

		setError(false);
	};

	// Modify the onChange handler to hide other radio buttons upon selection
	const handleChange = (value: string) => {
		setSelected(value);
		setShowAll(false); // Only show the selected radio button
		updateFormContext(name, value);
		if (value === 'Intellectual Property Infringement') {
			updateFormContext('first_name_required', true);
			updateFormContext('last_name_required', true);
			updateFormContext('email_required', true);
			updateFormContext('is_anonymous', false);
		} else {
			if (!is_trusted_flagger) {
				updateFormContext('first_name_required', false);
				updateFormContext('last_name_required', false);
				updateFormContext('email_required', false);
			}
		}

		if (!service) {
			setError(true);
		}
	};

	return (
		<>
			<div className='legal_form_reason-grid'>
				<div className='legal_form_reason-grid_column'>
					{data
						.slice(0, Math.ceil(data.length / 2))
						.map((item, index) =>
							showAll || selected === item.name ? (
								<RadioButton
									key={index}
									name={name}
									value={item.name}
									sublabel={item.sublabel}
									handleReset={handleReset}
									isChecked={selected === item.name}
									onChange={handleChange}
								/>
							) : null
						)}
				</div>
				<div className='legal_form_reason-grid_column'>
					{data
						.slice(Math.ceil(data.length / 2))
						.map((item, index) =>
							showAll || selected === item.name ? (
								<RadioButton
									key={index}
									name={name}
									value={item.name}
									sublabel={item.sublabel}
									handleReset={handleReset}
									required={true}
									isChecked={selected === item.name}
									onChange={handleChange}
								/>
							) : null
						)}
				</div>
			</div>
		</>
	);
}
