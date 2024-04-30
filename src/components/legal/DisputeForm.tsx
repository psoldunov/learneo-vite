import React, { useContext, useEffect, useState } from 'react';

import DisputeFormContext from '@components/legal/context/DisputeFormContext';

import { getBusinesses } from '@functions/data/dataHelpers';
import { isEEAUser } from '@functions/isEEAUser';

import FormSection from '@components/legal/components/elements/FormSection';
import InputWrap from './components/elements/InputWrap';
import Select from './components/elements/Select';
import Checkbox from './components/elements/Checkbox';
import Input from './components/elements/Input';
import DisputeLinks from './components/sections/DisputeLinks';
import { DisputeFormState } from 'types';

import validateFieldsDispute from './functions/validateFieldsDispute';

function handleSubmit(
	event: React.FormEvent<HTMLFormElement>,
	type: 'counter' | 'dispute',
	context: DisputeFormState,
	setProcessing: (value: boolean) => void,
	setSuccess: (value: boolean) => void,
	setError: ({ value, message }: { value: boolean; message: string }) => void
) {
	event.preventDefault();
	setProcessing(true);
	setError({ value: false, message: '' });
	//Validate form
	if (!validateFieldsDispute(context, setProcessing, setError)) return;

	//Submit form
	const url =
		'https://www.coursehero.com/api/v1/compliance/illegal-content-appeals/';

	const sanitizedUrls = context.urls.value.map((url) => {
		return {
			path: url.path,
			detail: url.detail,
		};
	});

	const payload = {
		is_ip: type === 'counter' ? true : false,
		service: context.service.value,
		first_name: context.first_name.value,
		last_name: context.last_name.value,
		email: context.email.value,
		legal_text1: context.legal_text1.value ? legalMessages.legal_text1 : '',
		legal_text2: context.legal_text2.value ? legalMessages.legal_text2 : '',
		urls: sanitizedUrls,
	};

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})
		.then((response) => {
			if (response.ok) {
				setSuccess(true);
			} else {
				throw new Error('Network response was not ok.');
			}
		})
		.catch((error) => {
			console.error(
				'There has been a problem with your fetch operation:',
				error
			);
			setError({
				value: true,
				message:
					'There was an error submitting your request. Please try again.',
			});
		})
		.finally(() => {
			setProcessing(false);
		});
}

const legalMessages = {
	legal_text1:
		'I certify, under penalty of perjury, that I have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.',
	legal_text2:
		'I consent to the jurisdiction of the Federal District Court for the district in which my address is located, or if my address is outside of the United States, the judicial district in which Course Hero is located, and will accept service of process from the claimant.',
};

export default function DisputeForm({ type }: { type: 'counter' | 'dispute' }) {
	const [success, setSuccess] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState({
		value: false,
		message: '',
	});

	const [boxTitle, setBoxTitle] = useState('');

	const context = useContext(DisputeFormContext);
	const {
		is_eu,
		service,
		first_name,
		last_name,
		email,
		legal_text1,
		legal_text2,
	} = context;

	useEffect(() => {
		isEEAUser().then((res) => {
			is_eu.updateField({ value: res });
		});
	}, []);

	useEffect(() => {
		if (type === 'counter' && !is_eu.value) {
			setBoxTitle('By checking the boxes below, I state that...*');
			legal_text2.updateField({ required: true });
		} else {
			setBoxTitle('By checking the box below, I state that...*');
			legal_text2.updateField({ required: false });
		}
	}, [is_eu.value]);

	useEffect(() => {
		if (service.value) {
			service.updateField({ error: false });
		}
	}, [service.value]);

	return (
		<>
			{success ? (
				<FormSection title='Your request was successfully received'>
					<p>
						If you would like to submit another request please click{' '}
						<a
							role='button'
							style={{ color: 'var(--link-blue)', cursor: 'pointer' }}
							onClick={() => {
								location.reload();
							}}>
							here
						</a>
						.
					</p>
				</FormSection>
			) : (
				<form
					autoComplete='off'
					className='legal_form'
					onSubmit={(event) => {
						handleSubmit(
							event,
							type,
							context,
							setProcessing,
							setSuccess,
							setError
						);
					}}
					style={{ pointerEvents: processing ? 'none' : 'auto' }}
					noValidate>
					<FormSection title='Reason for Report'>
						<InputWrap
							title='Select the Learneo service where the content was uploaded:'
							type='fieldset'
							required>
							<Select
								field_id='service'
								data={getBusinesses()}
								field={service}
							/>
						</InputWrap>
						<div className='legal_form_input_grid'>
							<InputWrap
								title='First Name'
								field_id='first_name'
								required={first_name.required}>
								<Input field_id='first_name' type='text' field={first_name} />
							</InputWrap>
							<InputWrap
								title='Last Name'
								field_id='last_name'
								required={last_name.required}>
								<Input field_id='last_name' type='text' field={last_name} />
							</InputWrap>
							<InputWrap
								title='Email'
								field_id='email'
								required={email.required}>
								<Input field_id='email' type='email' field={email} />
							</InputWrap>
						</div>
						<DisputeLinks context={context} />
					</FormSection>

					<FormSection title={boxTitle}>
						<Checkbox
							field={legal_text1}
							field_id='legal_text1'
							title={legalMessages.legal_text1}
						/>
						{!is_eu.value && type === 'counter' ? (
							<Checkbox
								field={legal_text2}
								field_id='legal_text2'
								title={legalMessages.legal_text2}
							/>
						) : null}
					</FormSection>
					<div className='legal_form_submit_wrap'>
						{error.value ? (
							<span className='legal_form_error'>{error.message}</span>
						) : null}
						<button
							type='submit'
							className='legal_form_button'
							disabled={processing}>
							Submit
						</button>
						<div className='text-size-small text-weight-normal text-color-grey text-style-italic'>
							By clicking "submit", you acknowledge that repeatedly filing
							fraudulent or abusive requests may result in Learneo discontinuing
							the processing of future notices submitted by you.
						</div>
					</div>
				</form>
			)}
		</>
	);
}
