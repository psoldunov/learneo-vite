import React, { useContext, useEffect, useState } from 'react';
import FormBlock from './FormBlock';
import CheckboxButton from './CheckboxButton';
import NoticeBlock from './NoticeBlock';
import InputBlock from './InputBlock';
import FormContext from '@context/FormContext';
import Dropdown from './Dropdown';
import { getAllCountries, getEEACountries } from '@data/dataHelpers';
import { Country } from 'types';

export default function ContactInformation({
	countryError = false,
	setCountryError,
}: {
	countryError?: boolean;
	setCountryError?: (value: boolean) => void;
}) {
	const {
		reason,
		is_eu,
		is_anonymous,
		first_name_required,
		last_name_required,
		email_required,
		is_trusted_flagger,

		updateFormContext,
	} = useContext(FormContext);

	const getCountries = (): Country[] => {
		if (is_eu) {
			return getEEACountries();
		}

		const eeaCountryNames = getEEACountries().map((country) => country.name);
		const allCountriesWithoutEEA = getAllCountries().filter(
			(country) => !eeaCountryNames.includes(country.name)
		);

		return allCountriesWithoutEEA;
	};

	const setTrustedFlagger = (value: boolean) => {
		updateFormContext('is_anonymous', value ? false : is_anonymous);
		if (reason !== 'Intellectual Property Infringement') {
			updateFormContext('first_name_required', value);
			updateFormContext('last_name_required', value);
			updateFormContext('email_required', value);
		}
	};

	const setAnonymous = () => {
		updateFormContext('first_name_required', false);
		updateFormContext('last_name_required', false);
		updateFormContext('email_required', false);
		updateFormContext('first_name', null);
		updateFormContext('last_name', null);
		updateFormContext('email', null);
	};

	return (
		<FormBlock title='Contact Information'>
			{reason === 'Illegal or Harmful Speech' ? (
				<NoticeBlock>
					For concerns related to personality rights (e.g., defamatory content),
					your name and email are required for us to process and respond to your
					request
				</NoticeBlock>
			) : null}
			<div className='legal_form_inner_column'>
				{reason !== 'Intellectual Property Infringement' &&
				is_trusted_flagger === false ? (
					<CheckboxButton
						name='is_anonymous'
						formContext={FormContext}
						value='Report content anonymously'
						sublabel='Without a name and email address, we are unable to confirm receipt of your notice and inform you of our final decision.'
						onChange={setAnonymous}
					/>
				) : null}
				{is_eu ? (
					<CheckboxButton
						name='is_trusted_flagger'
						formContext={FormContext}
						value='I am a Trusted Flagger'
						sublabel='A “trusted flagger” is an official status awarded to an entity by a Digital Service Coordinator and listed in a public database by the European Commission.'
						onChange={setTrustedFlagger}
					/>
				) : null}
			</div>

			<div className='legal_form_input_grid'>
				<InputBlock
					label='First Name'
					id='first_name'
					required={first_name_required ? true : false}>
					<input
						type='text'
						id='first_name'
						className='legal_form_input'
						required={first_name_required ? true : false}
						disabled={is_anonymous}
						onChange={(e) => updateFormContext('first_name', e.target.value)}
					/>
				</InputBlock>
				<InputBlock
					label='Last name'
					id='last_name'
					required={last_name_required ? true : false}>
					<input
						type='text'
						id='last_name'
						className='legal_form_input'
						required={last_name_required ? true : false}
						disabled={is_anonymous}
						onChange={(e) => updateFormContext('last_name', e.target.value)}
					/>
				</InputBlock>
				<InputBlock
					label='Email address'
					id='email'
					required={email_required ? true : false}>
					<input
						type='email'
						id='email'
						className='legal_form_input'
						required={email_required ? true : false}
						disabled={is_anonymous}
						onChange={(e) => updateFormContext('email', e.target.value)}
					/>
				</InputBlock>
				{reason === 'Intellectual Property Infringement' ? (
					<>
						<InputBlock
							label='Organization or institution’s name'
							id='contact_org_name'
							required={true}>
							<input
								type='text'
								id='contact_org_name'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_org_name', e.target.value)
								}
							/>
						</InputBlock>
						<InputBlock
							label='Job title or role'
							id='contact_job_title'
							required={true}>
							<input
								type='text'
								id='contact_job_title'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_job_title', e.target.value)
								}
							/>
						</InputBlock>
						<InputBlock
							label='Street address'
							id='contact_address'
							required={true}>
							<input
								type='text'
								id='contact_address'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_address', e.target.value)
								}
							/>
						</InputBlock>
						<InputBlock label='City' id='contact_city' required={true}>
							<input
								type='text'
								id='contact_city'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_city', e.target.value)
								}
							/>
						</InputBlock>
						<InputBlock
							label='State or province'
							id='contact_state'
							required={true}>
							<input
								type='text'
								id='contact_state'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_state', e.target.value)
								}
							/>
						</InputBlock>
						<InputBlock label='Zip code' id='contact_zipcode' required={true}>
							<input
								type='text'
								id='contact_zipcode'
								className='legal_form_input'
								required={true}
								onChange={(e) =>
									updateFormContext('contact_zipcode', e.target.value)
								}
							/>
						</InputBlock>
					</>
				) : null}
				<InputBlock label='Country' type='fieldset' required={true}>
					<Dropdown
						multiple={false}
						id='country'
						data={getCountries()}
						formContext={FormContext}
						required={false}
						fullWidth={true}
						error={countryError}
						setError={setCountryError}
					/>
					{countryError && (
						<div style={{ color: 'red' }}>
							Please select a country to proceed.
						</div>
					)}
				</InputBlock>
			</div>
		</FormBlock>
	);
}
