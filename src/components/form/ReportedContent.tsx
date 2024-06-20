import React, { useContext, useState } from 'react';
import FormBlock from './FormBlock';
import FormContext from '@context/FormContext';
import InputBlock from './InputBlock';
import Dropdown from './Dropdown';
import { getPrivacyViolations, getBusinesses } from '@data/dataHelpers';
import { Business } from 'types';

export default function ReportedContent() {
	const { reason, urls_count, service, updateFormContext } =
		useContext(FormContext);

	const [urlError, setUrlError] = useState({});
	const [detailsError, setDetailsError] = useState({});

	const getDomain = (service: string) => {
		const business = getBusinesses().find(
			(business: Business) => business.name === service
		);
		return {
			full: business?.url,
			// Remove protocol and www from the URL and final slash
			domain: business?.url
				.replace(/(^\w+:|^)\/\/(www\.)?/, '')
				.replace(/\/$/, ''),
		};
	};

	const detailTitle =
		reason === 'Other'
			? 'Provide details as to why you believe the content is illegal'
			: 'Please provide any additional information to assist in locating and identifying the reported content';

	const urls: JSX.Element[] = [];

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
				{reason === 'Privacy Violations' ? (
					<InputBlock
						label='Please indicate the type of privacy violation you are reporting'
						type='fieldset'
						required={true}
						id={`url-${i + 1}`}>
						<Dropdown
							id={`privacy_types_url_${i + 1}`}
							formContext={FormContext}
							data={getPrivacyViolations()}
							multiple={true}
						/>
					</InputBlock>
				) : null}
				{service ? (
					<InputBlock
						label='Provide the URL of content you would like to report'
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
					label={detailTitle}
					required={
						reason === 'Other' ||
						reason === 'Intellectual Property Infringement'
							? true
							: false
					}
					id={`detail_url_${i + 1}`}>
					<input
						type='text'
						id={`detail_url_${i + 1}`}
						maxLength={255}
						name={`detail_url_${i + 1}`}
						className={`legal_form_input ${
							detailsError[(i + 1).toString() as keyof typeof detailsError] &&
							'is-error'
						}`}
						required={
							reason === 'Other' ||
							reason === 'Intellectual Property Infringement'
								? true
								: false
						}
						onChange={(e) => {
							updateFormContext(`detail_url_${i + 1}`, e.target.value);
						}}
						onBlur={(e) => {
							if (e.target.value === '') {
								if (reason === 'Other') {
									setDetailsError(
										(detailsError: { [key: string]: boolean }) => ({
											...detailsError,
											[(i + 1).toString()]: true,
										})
									);
								}
							} else {
								setDetailsError((detailsError: { [key: string]: boolean }) => ({
									...detailsError,
									[(i + 1).toString()]: false,
								}));
							}
						}}
					/>
				</InputBlock>
			</div>
		);
	}

	return (
		<FormBlock title='Reported Content'>
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
	);
}
