import pageGeogating from '@functions/pageGeogating';
import { parameterControl } from '@functions/isEEAUser';

export default function LegalPage() {
	parameterControl();
	pageGeogating();
}