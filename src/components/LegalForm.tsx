import React, { useContext, useState, useEffect } from 'react';
import { isEEAUser } from '@functions/isEEAUser';
import FormContext from '@context/FormContext';
import InputBlock from '@components/form/InputBlock';
import FormBlock from '@components/form/FormBlock';
import Dropdown from '@components/form/Dropdown';
import RadioGroup from '@components/form/RadioGroup';
import NoticeBlock from '@components/form/NoticeBlock';
import ContactInformation from '@components/form/ContactInformation';
import ReportedContent from '@components/form/ReportedContent';

import { getReasons, getBusinesses } from '@data/dataHelpers';
import CheckboxButton from './form/CheckboxButton';
import { FormState } from 'types';

function handleSubmit(
	event: React.FormEvent<HTMLFormElement>,
	context: FormState,
	setCountryError: (value: boolean) => void,
	setSuccess: (value: boolean) => void
) {
	event.preventDefault();

	if (context.country === '' || context.country === null) {
		setCountryError(true);
		return;
	}

	const urlsArr = [];

	type URLInfo = {
		path: string | null;
		detail: string | null;
		privacy_types: string | null;
	};

	// Assuming context is of type FormState
	for (let i = 0; i < context.urls_count; i++) {
		const pathKey = `path_url_${i + 1}` as `path_url_${number}`;
		const detailKey = `detail_url_${i + 1}` as `detail_url_${number}`;
		const privacyTypesKey = `privacy_types_url_${
			i + 1
		}` as `privacy_types_url_${number}`;

		const urlInfo: URLInfo = {
			path: context[pathKey], // TypeScript understands this is string | null
			detail: context[detailKey], // TypeScript understands this is string | null
			privacy_types: context[privacyTypesKey], // TypeScript understands this is string | null
		};

		urlsArr.push(urlInfo);
	}

	const customReason =
		context.reason === 'Intellectual Property Infringement'
			? 'Intellectual Property'
			: context.reason;

	const payloadData = {
		is_eu: context.is_eu,
		is_anonymous: context.is_anonymous,
		is_trusted_flagger: context.is_trusted_flagger,
		service: context.service ? context.service : '',
		reason: customReason ? customReason : '',
		first_name: context.first_name ? context.first_name : '',
		last_name: context.last_name ? context.last_name : '',
		email: context.email ? context.email : '',
		country: context.country ? context.country : '',
		urls: urlsArr,
		contact_org_name: context.contact_org_name ? context.contact_org_name : '',
		contact_job_title: context.contact_job_title
			? context.contact_job_title
			: '',
		contact_address: context.contact_address ? context.contact_address : '',
		contact_city: context.contact_city ? context.contact_city : '',
		contact_state: context.contact_state ? context.contact_state : '',
		contact_zipcode: context.contact_zipcode ? context.contact_zipcode : '',
		owner_name: context.owner_name ? context.owner_name : '',
		legal_text: context.legal_text
			? 'I have a good faith belief that the details and claims presented in this report are accurate and complete.'
			: '',
		legal_text_ip: context.legal_text_ip
			? 'The claims made in this report are accurate and complete, and under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.'
			: '',
		legal_text_dmca: context.legal_text_dmca
			? 'I acknowledge that any person who knowingly materially misrepresents material as infringing may be subject to liability for damages under section 512(f) of the Digital Millennium Copyright Act.'
			: '',
	};

	fetch(
		'https://www.coursehero.com/api/v1/compliance/illegal-content-complaint/',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payloadData),
		} // Add error handling
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			console.log('Success:', data);
			setSuccess(true);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

const LegalForm: React.FC = () => {
	const context = useContext(FormContext);
	const { service, reason, is_eu, updateFormContext } = context;

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const [countryError, setCountryError] = useState(false);

	const boxesTitle =
		reason === 'Intellectual Property Infringement'
			? 'By checking the boxes below, I state that...*'
			: 'By checking the box below, I state that...*';

	useEffect(() => {
		// Call the async function and update state accordingly
		isEEAUser().then((res) => {
			updateFormContext('is_eu', res);
		});
	}, []);

	return (
		<>
			{!success ? (
				<form
					onSubmit={(event) =>
						handleSubmit(event, context, setCountryError, setSuccess)
					}
					className='legal_form'>
					<FormBlock title='Reason for Report'>
						<InputBlock
							label='Select the Learneo service where the content you are reporting
							appears:'
							type='fieldset'
							required={true}>
							<Dropdown
								multiple={false}
								id='service'
								error={error}
								formContext={FormContext}
								required={true}
								errorDependency='reason'
								setError={setError}
								data={getBusinesses()}
							/>
							{error && (
								<div style={{ color: 'red' }}>
									Please select a Learneo Service to proceed.
								</div>
							)}
						</InputBlock>
						<InputBlock
							label='Please select the reason you believe the content is illegal:'
							type='fieldset'
							required={true}>
							<RadioGroup
								data={getReasons()}
								name='reason'
								setError={setError}
							/>
						</InputBlock>
						{reason === 'Privacy Violations' ? (
							<NoticeBlock>
								This form is exclusively for reporting privacy violations, e.g.,
								unauthorized disclosure of passwords, addresses, financial data,
								health data, etc. To request the deletion of your personal data
								from a Learneo service or another right under applicable law,
								please read our{' '}
								<a href='/legal/privacy-policy'>Privacy Policy</a> for where to
								submit your request.
							</NoticeBlock>
						) : null}
					</FormBlock>
					{reason && service ? (
						<>
							<div className='legal_form_flex-inner'>
								<ContactInformation
									countryError={countryError}
									setCountryError={setCountryError}
								/>
								{reason === 'Intellectual Property Infringement' ? (
									<FormBlock title='Intellectual Property Owner’s Information'>
										<div className='legal_form_input_grid'>
											<InputBlock
												label='Name of Intellectual Property Owner'
												required={true}
												id='owner'>
												<input
													className='legal_form_input'
													type='text'
													id='owner'
													name='owner'
													required={true}
													onChange={(e) =>
														updateFormContext('owner_name', e.target.value)
													}
												/>
											</InputBlock>
										</div>
									</FormBlock>
								) : null}
								<ReportedContent />
								<FormBlock title={boxesTitle}>
									<div className='legal_form_input_grid is-1-column'>
										<CheckboxButton
											formContext={FormContext}
											value='I have a good faith belief that the details and claims presented in this report are accurate and complete.'
											name='legal_text'
											required={true}
										/>
										{reason === 'Intellectual Property Infringement' ? (
											<CheckboxButton
												formContext={FormContext}
												value='The claims made in this report are accurate and complete, and under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.'
												name='legal_text_ip'
												required={true}
											/>
										) : null}
										{!is_eu &&
										reason === 'Intellectual Property Infringement' ? (
											<CheckboxButton
												formContext={FormContext}
												value='I acknowledge that any person who knowingly materially misrepresents material as infringing may be subject to liability for damages under section 512(f) of the Digital Millennium Copyright Act.'
												name='legal_text_dmca'
												required={true}
											/>
										) : null}
									</div>
								</FormBlock>
							</div>
							<div className='legal_form_submit_wrap'>
								<button type='submit' className='legal_form_button'>
									Submit
								</button>
								<div className='text-size-small text-weight-normal text-color-grey text-style-italic'>
									By clicking "submit", you acknowledge that repeatedly filing
									fraudulent or abusive reports may result in Learneo
									discontinuing the processing of future notices submitted by
									you.
								</div>
							</div>
						</>
					) : null}
				</form>
			) : (
				<FormBlock title='Your report was successfully received'>
					<p>
						If you would like to submit another report please click{' '}
						<a
							role='button'
							style={{ color: 'var(--link-blue)', cursor: 'pointer' }}
							onClick={() => {
								// reload window
								location.reload();
							}}>
							here
						</a>
						.
					</p>
				</FormBlock>
			)}
		</>
	);
};

export default LegalForm;
