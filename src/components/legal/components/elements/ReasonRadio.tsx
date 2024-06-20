export default function ReasonRadio({
  name,
  value,
  hint,
  isChecked,
  error,
  required = false,
  handleReset,
  onChange,
}: {
  name: string;
  value: string;
  hint?: string;
  isChecked: boolean;
  required?: boolean;
  error: boolean;
  handleReset?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="legal_form_radio">
      <div
        className={`legal_form_radio-button ${isChecked ? "is-checked" : ""} ${
          error ? "is-error" : ""
        }`}
      ></div>
      <input
        id={value.toLowerCase().replace(/ /g, "-")}
        type="radio"
        name={name}
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
        value={value}
        checked={isChecked}
        required={required}
        onChange={() => onChange(value)}
      />
      <span className="legal_form_input_label" style={{ cursor: "pointer" }}>
        {value}
        {isChecked &&
          handleReset &&
          value !== "Copyright; other IP Infringement" && (
            <button className="legal_form_radios-reset" onClick={handleReset}>
              {` (change ${name.toLowerCase()})`}
            </button>
          )}
      </span>
      {hint && <div className="legal_form_input_sublabel">{hint}</div>}
    </label>
  );
}
