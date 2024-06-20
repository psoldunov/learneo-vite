import React from 'react';

export default function NoticeBlock({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='legal_form_notice'>{children}</div>;
}
