import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReportForm from '@components/legal/ReportForm';
import ReportFormProvider from '@components/legal/context/providers/ReportFormProvider';

export default function LegalReportPage() {
	document.addEventListener('DOMContentLoaded', () => {
		const rootElement = document.querySelector('.legal_form_app');
		if (rootElement) {
			const root = createRoot(rootElement); // Create a root.
			root.render(
				<StrictMode>
					<ReportFormProvider>
						<ReportForm />
					</ReportFormProvider>
				</StrictMode>
			); // Initial render
		}
	});
}
