export default function FieldError({
	errorText,
	error,
}: {
	errorText: string;
	error: boolean;
}) {
	return <>{error && <div style={{ color: 'red' }}>{errorText}</div>}</>;
}
