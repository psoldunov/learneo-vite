import React from 'react';
import { NoticeFormState } from 'types';

const defaultContext: NoticeFormState = {
	is_eu: false,
	service: null,
	first_name: null,
	last_name: null,
	email: null,
	urls_count: 1,
	legal_text1: null,
	legal_text2: null,
	updateFormContext: () => {},
};

const NoticeFormContext = React.createContext(defaultContext);

export default NoticeFormContext;
