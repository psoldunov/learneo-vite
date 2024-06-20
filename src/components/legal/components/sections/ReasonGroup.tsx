import React, { useEffect, useState } from "react";
import ReasonRadio from "@components/legal/components/elements/ReasonRadio";
import { Reason, ReportFormState } from "types";

export default function ReasonGroup({
  data,
  field_id,
  context,
}: {
  data: Reason[];
  field_id: string;
  context: ReportFormState;
}) {
  const [showAll, setShowAll] = useState(true);

  const { service, reason } = context;

  useEffect(() => {
    reason.value !== "" ? setShowAll(false) : setShowAll(true);
  }, [reason]);

  // Handler to reset the form
  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    reason.updateField({ value: "", error: false });
    service.error && service.updateField({ error: false });
  };

  // Modify the onChange handler to hide other radio buttons upon selection
  const handleChange = (value: string) => {
    reason.updateField({ value, error: false });

    if (!service.value) {
      service.updateField({ error: true });
    }
  };

  return (
    <>
      <div className="legal_form_reason-grid">
        <div className="legal_form_reason-grid_column">
          {data
            .slice(0, Math.ceil(data.length / 2))
            .map((item, index) =>
              showAll || reason.value === item.name ? (
                <ReasonRadio
                  key={index}
                  name={field_id}
                  value={item.name}
                  hint={item.sublabel}
                  error={reason.error!}
                  handleReset={handleReset}
                  isChecked={reason.value === item.name}
                  onChange={handleChange}
                />
              ) : null
            )}
        </div>
        <div className="legal_form_reason-grid_column">
          {data
            .slice(Math.ceil(data.length / 2))
            .map((item, index) =>
              showAll || reason.value === item.name ? (
                <ReasonRadio
                  key={index}
                  name={field_id}
                  value={item.name}
                  hint={item.sublabel}
                  error={reason.error!}
                  handleReset={handleReset}
                  required={true}
                  isChecked={reason.value === item.name}
                  onChange={handleChange}
                />
              ) : null
            )}
        </div>
      </div>
    </>
  );
}
