import React, { useContext, useState, useEffect } from 'react';
import { isEEAUser } from '@functions/isEEAUser';
import NoticeFormContext from '@context/NoticeFormContext';
import InputBlock from '@components/form/InputBlock';
import FormBlock from '@components/form/FormBlock';
import Dropdown from '@components/form/Dropdown';
import InputGrid from './form/InputGrid';
import { Business, NoticeFormState } from 'types';
import CheckboxButton from './form/CheckboxButton';

import { getBusinesses } from '@data/dataHelpers';

interface Props {
	type: 'counter' | 'dispute';
}

const NoticeForm: React.FC<Props> = ({ type }) => {
	const context = useContext(NoticeFormContext);
	const { service, urls_count, is_eu, updateFormContext } = context;

	const [success, setSuccess] = useState(false);
	const [serviceError, setServiceError] = useState(false);
	const [urlError, setUrlError] = useState({});

	const getDomain = (service: string) => {
		const business = getBusinesses().find(
			(business: Business) => business.name === service
		);
		return {
			full: business?.url,
			domain: business?.url
				.replace(/(^\w+:|^)\/\/(www\.)?/, '')
				.replace(/\/$/, ''),
		};
	};

	const boxesTitle =
		!is_eu && type === 'counter'
			? 'By checking the boxes below, I state that...*'
			: 'By checking the box below, I state that...*';

	useEffect(() => {
		isEEAUser().then((res) => {
			updateFormContext('is_eu', res);
		});
	}, []);

	const urls: JSX.Element[] = [];

	const urlPathTitle =
		type === 'counter'
			? 'Provide the URL of content you would like to counter'
			: 'Provide the URL of content you would like to dispute';

	const urlDetailTitle =
		type === 'counter'
			? 'Please provide the reason you are requesting to counter our decision'
			: 'Please provide the reason you are requesting to dispute our decision';

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement>,
		context: NoticeFormState,
		setServiceError: (value: boolean) => void,
		setSuccess: (value: boolean) => void
	) => {
		event.preventDefault();
		// request endpoint: https://dev.coursehero.com/api/v1/compliance/illegal-content-appeals/

		if (!context.service) {
			setServiceError(true);
			return;
		}

		let urls = [];

		for (let i = 0; i < context.urls_count; i++) {
			urls.push({
				path: context[`path_url_${i + 1}`],
				detail: context[`detail_url_${i + 1}`],
			});
		}

		const data = {
			is_ip: type === 'counter' ? true : false,
			service: context.service,
			first_name: context.first_name,
			last_name: context.last_name,
			email: context.email,
			urls,
			legal_text1: context.legal_text1
				? 'I have good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.'
				: '',
			legal_text2: context.legal_text2
				? 'I consent to the jurisdiction of the Federal District Court for the district in which my address is located, or if my address is outside of the United States, the judicial district in which Course Hero is located, and will accept service of process from the claimant.'
				: '',
		};

		fetch(
			'https://www.coursehero.com/api/v1/compliance/illegal-content-appeals/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
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
	};

	for (let i = 0; i < urls_count; i++) {
		urls.push(
			<div
				key={`url-${i + 1}`}
				className='legal_form_repeater-item'
				id={`url-item-${i + 1}`}>
				<h3 className='legal_form_h3'>
					Item {i + 1}{' '}
					{i > 0 && i === urls_count - 1 ? (
						<button
							className='legal_form_radios-reset'
							onClick={(e) => {
								e.preventDefault();
								updateFormContext('urls_count', urls_count - 1);
								updateFormContext(`privacy_types_url_${i + 1}`, []);
								updateFormContext(`path_url_${i + 1}`, null);
								updateFormContext(`detail_url_${i + 1}`, null);
							}}>
							{'(remove)'}
						</button>
					) : null}
				</h3>
				{service ? (
					<InputBlock
						label={urlPathTitle}
						required={true}
						id={`path_url_${i + 1}`}>
						<input
							type='url'
							id={`path_url_${i + 1}`}
							name={`path_url_${i + 1}`}
							className={`legal_form_input ${
								urlError[(i + 1).toString() as keyof typeof urlError] &&
								'is-error'
							}`}
							required={true}
							placeholder={getDomain(service).full}
							onChange={(e) => {
								if (e.target.value.includes(getDomain(service).domain)) {
									updateFormContext(`path_url_${i + 1}`, e.target.value);
									setUrlError((urlError: { [key: string]: boolean }) => ({
										...urlError,
										[(i + 1).toString()]: false,
									}));
								} else {
									updateFormContext(`path_url_${i + 1}`, null);
									setUrlError((urlError: { [key: string]: boolean }) => ({
										...urlError,
										[(i + 1).toString()]: true,
									}));
								}
							}}
						/>
						{urlError[(i + 1).toString() as keyof typeof urlError] === true && (
							<div style={{ color: 'red' }}>
								This URL does not match the Learneo service you selected. If
								you'd like to report content for an additional service, please
								submit a separate report.
							</div>
						)}
					</InputBlock>
				) : null}
				<InputBlock
					label={urlDetailTitle}
					required={true}
					id={`detail_url_${i + 1}`}>
					<input
						type='text'
						id={`detail_url_${i + 1}`}
						name={`detail_url_${i + 1}`}
						className={'legal_form_input'}
						required={true}
						onChange={(e) => {
							updateFormContext(`detail_url_${i + 1}`, e.target.value);
						}}
					/>
				</InputBlock>
			</div>
		);
	}

	return (
		<>
			{!success ? (
				<form
					onSubmit={(event) => {
						handleSubmit(event, context, setServiceError, setSuccess);
					}}
					className='legal_form'>
					<FormBlock>
						<InputBlock
							label='Select the Learneo service where the content was uploaded:'
							type='fieldset'
							required={true}>
							<Dropdown
								id='service'
								formContext={NoticeFormContext}
								required={true}
								error={serviceError}
								setError={setServiceError}
								data={getBusinesses()}
							/>
							{serviceError && (
								<div style={{ color: 'red' }}>
									Please select a service to proceed.
								</div>
							)}
						</InputBlock>
						<InputGrid>
							<InputBlock id='first_name' label='First Name' required={true}>
								<input
									className='legal_form_input'
									type='text'
									id='first_name'
									name='first_name'
									onChange={(e) => {
										updateFormContext('first_name', e.target.value);
									}}
									required
								/>
							</InputBlock>
							<InputBlock id='last_name' label='Last Name' required={true}>
								<input
									className='legal_form_input'
									type='text'
									id='last_name'
									name='last_name'
									onChange={(e) => {
										updateFormContext('last_name', e.target.value);
									}}
									required
								/>
							</InputBlock>
							<InputBlock id='email' label='Email Address' required={true}>
								<input
									className='legal_form_input'
									type='email'
									id='email'
									name='email'
									onChange={(e) => {
										updateFormContext('email', e.target.value);
									}}
									required
								/>
							</InputBlock>
						</InputGrid>
						{urls}
						<button
							className='legal_form_button'
							onClick={(e) => {
								e.preventDefault();
								updateFormContext('urls_count', urls_count + 1);
							}}>
							+ Add Another Item
						</button>
					</FormBlock>
					<FormBlock title={boxesTitle}>
						<div className='legal_form_input_grid is-1-column'>
							<CheckboxButton
								value='I have good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.'
								name='legal_text1'
								formContext={NoticeFormContext}
								required={true}
							/>
							{!is_eu && type === 'counter' ? (
								<CheckboxButton
									value='I consent to the jurisdiction of the Federal District Court for the district in which my address is located, or if my address is outside of the United States, the judicial district in which Course Hero is located, and will accept service of process from the claimant.'
									name='legal_text2'
									formContext={NoticeFormContext}
									required={true}
								/>
							) : null}
						</div>
					</FormBlock>
					<div className='legal_form_submit_wrap'>
						<button type='submit' className='legal_form_button'>
							Submit
						</button>
						<div className='text-size-small text-weight-normal text-color-grey text-style-italic'>
							By clicking "submit", you acknowledge that repeatedly filing
							fraudulent or abusive reports may result in Learneo discontinuing
							the processing of future notices submitted by you.
						</div>
					</div>
				</form>
			) : (
				<FormBlock title='Your notification was successfully received'>
					<p>
						If you would like to submit another notice please click{' '}
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

export default NoticeForm;
