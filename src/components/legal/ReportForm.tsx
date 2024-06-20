import React, { useContext, useEffect, useState } from "react";
import ReportFormContext from "@components/legal/context/ReportFormContext";
import {
  getBusinesses,
  getReasons,
  getEEACountries,
  getAllCountriesWithoutEEA,
} from "@functions/data/dataHelpers";
import { isEEAUser } from "@functions/isEEAUser";
import FormSection from "@components/legal/components/elements/FormSection";
import InputWrap from "./components/elements/InputWrap";
import Select from "./components/elements/Select";
import ReasonGroup from "./components/sections/ReasonGroup";
import FieldError from "./components/elements/FieldError";
import NotificationBlock from "./components/elements/NotificationBlock";
import Checkbox from "./components/elements/Checkbox";
import Input from "./components/elements/Input";
import ReportedContent from "./components/sections/ReportedContent";
import { ReportFormState } from "types";
import validateFields from "./functions/validateFields";

const legalMessages = {
  legal_text:
    "I have a good faith belief that the details and claims presented in this report are accurate and complete.",
  legal_text_ip:
    "The claims presented in this report are accurate and complete, and that under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.",
  legal_text_dmca:
    "I acknowledge that any person who knowingly materially misrepresents material as infringing may be subject to liability for damages under section 512(f) of the Digital Millennium Copyright Act.",
};

function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
  context: ReportFormState,
  setProcessing: (value: boolean) => void,
  setSuccess: (value: boolean) => void,
  setError: ({ value, message }: { value: boolean; message: string }) => void
) {
  event.preventDefault();
  setProcessing(true);
  setError({ value: false, message: "" });
  //Validate form
  if (!validateFields(context, setProcessing, setError)) return;

  //Submit form
  const url =
    "https://www.coursehero.com/api/v1/compliance/illegal-content-complaint/";

  const customReason =
    context.reason.value === "Copyright; other IP Infringement"
      ? "Intellectual Property"
      : context.reason.value;

  const sanitizedUrls = context.urls.value.map((url) => {
    return {
      detail: url.detail,
      path: url.path,
      privacy_types:
        context.reason.value === "Privacy Violations" ? url.privacy_types : [],
    };
  });

  console.log(sanitizedUrls);

  const payload = {
    is_eu: context.is_eu.value,
    is_anonymous: context.is_anonymous.value,
    is_trusted_flagger: context.is_trusted_flagger.value,
    service: context.service.value,
    reason: customReason,
    first_name: context.first_name.value,
    last_name: context.last_name.value,
    email: context.email.value,
    country: context.country.value,
    contact_org_name: context.contact_org_name.value,
    contact_job_title: context.contact_job_title.value,
    contact_address: context.contact_address.value,
    contact_city: context.contact_city.value,
    contact_state: context.contact_state.value,
    contact_zipcode: context.contact_zipcode.value,
    owner_name: context.owner_name.value,
    legal_text: context.legal_text.value ? legalMessages.legal_text : "",
    legal_text_ip: context.legal_text_ip.value
      ? legalMessages.legal_text_ip
      : "",
    legal_text_dmca: context.legal_text_dmca.value
      ? legalMessages.legal_text_dmca
      : "",
    urls: sanitizedUrls,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      setError({
        value: true,
        message: "There was an error submitting your report. Please try again.",
      });
    })
    .finally(() => {
      setProcessing(false);
    });
}

export default function ReportForm() {
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });

  const context = useContext(ReportFormContext);
  const {
    is_eu,
    is_anonymous,
    is_trusted_flagger,
    service,
    reason,
    first_name,
    last_name,
    email,
    country,
    contact_org_name,
    contact_job_title,
    contact_address,
    contact_city,
    contact_state,
    contact_zipcode,
    owner_name,
    legal_text,
    legal_text_ip,
    legal_text_dmca,
  } = context;

  useEffect(() => {
    isEEAUser().then((res) => {
      is_eu.updateField({ value: res });
    });
  }, []);

  useEffect(() => {
    //get parameters service and reason from url
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get("service");
    const reasonParam = urlParams.get("reason");

    const slugify = (str: String) => {
      return str.toLowerCase().replace(/ /g, "-").replace(/;/g, "");
    };

    // check if reason has a match in getReasons
    if (reasonParam) {
      const matchingReason = getReasons().find(
        (obj) => slugify(obj.name) === reasonParam
      );

      if (matchingReason) {
        reason.updateField({ value: matchingReason.name });
      }
    }

    //check if service has a match in getBusinesses
    if (serviceParam) {
      const matchingService = getBusinesses().find(
        (obj) => slugify(obj.name) === serviceParam
      );

      if (matchingService) {
        service.updateField({ value: matchingService.name });
      }
    }
  }, []);

  useEffect(() => {
    if (service.value) {
      service.updateField({ error: false });
    }
  }, [service.value]);

  useEffect(() => {
    if (
      reason.value === "Terrorist Content" ||
      reason.value === "Protection of Minors"
    ) {
      first_name.updateField({
        required: false,
      });
      last_name.updateField({
        required: false,
      });
      email.updateField({
        required: false,
      });
    } else {
      is_anonymous.updateField({ value: false });
      first_name.updateField({
        required: true,
      });
      last_name.updateField({
        required: true,
      });
      email.updateField({
        required: true,
      });
    }

    if (reason.value === "Copyright; other IP Infringement") {
      legalMessages.legal_text =
        "I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.";

      if (!is_eu.value) {
        legal_text_dmca.updateField({ required: true });
      }
      contact_org_name.updateField({
        required: true,
      });
      contact_job_title.updateField({
        required: true,
      });
      contact_address.updateField({
        required: true,
      });
      contact_city.updateField({
        required: true,
      });
      contact_state.updateField({
        required: true,
      });
      contact_zipcode.updateField({
        required: true,
      });
      owner_name.updateField({
        required: true,
      });
      legal_text_ip.updateField({ required: true });
    } else {
      legalMessages.legal_text =
        "I have a good faith belief that the details and claims presented in this report are accurate and complete.";
      contact_org_name.updateField({
        value: "",
        required: false,
      });
      contact_job_title.updateField({
        value: "",
        required: false,
      });
      contact_address.updateField({
        value: "",
        required: false,
      });
      contact_city.updateField({
        value: "",
        required: false,
      });
      contact_state.updateField({
        value: "",
        required: false,
      });
      contact_zipcode.updateField({
        value: "",
        required: false,
      });
      owner_name.updateField({
        value: "",
        required: false,
      });
      legal_text_ip.updateField({ value: false, required: false });
      legal_text_dmca.updateField({ value: false, required: false });
    }

    if (reason.value !== "Privacy Violations") {
      context.urls.updateField({
        value: context.urls.value.map((url) => ({
          ...url,
          privacy_types: [],
        })),
        privacy_types_required: false,
      });
    }
  }, [reason.value]);

  useEffect(() => {
    if (is_anonymous.value) {
      is_trusted_flagger.updateField({ value: false });
    }
    first_name.updateField({
      value: "",
      disabled: is_anonymous.value,
      error: false,
    });
    last_name.updateField({
      value: "",
      disabled: is_anonymous.value,
      error: false,
    });
    email.updateField({
      value: "",
      disabled: is_anonymous.value,
      error: false,
    });
  }, [is_anonymous.value]);

  useEffect(() => {
    if (is_trusted_flagger.value) {
      is_anonymous.updateField({ value: false });
    }
    if (
      reason.value === "Terrorist Content" ||
      reason.value === "Protection of Minors"
    ) {
      first_name.updateField({
        required: is_trusted_flagger.value,
      });
      last_name.updateField({
        required: is_trusted_flagger.value,
      });
      email.updateField({
        required: is_trusted_flagger.value,
      });
    }
  }, [is_trusted_flagger.value]);

  return (
    <>
      {success ? (
        <FormSection title="Your report was successfully received">
          <p>
            If you would like to submit another report please click{" "}
            <a
              role="button"
              style={{ color: "var(--link-blue)", cursor: "pointer" }}
              onClick={() => {
                window.location.href = "/legal/illegal-content-notice";
              }}
            >
              here
            </a>
            .
          </p>
        </FormSection>
      ) : (
        <form
          autoComplete="off"
          className="legal_form"
          onSubmit={(event) => {
            handleSubmit(event, context, setProcessing, setSuccess, setError);
          }}
          style={{ pointerEvents: processing ? "none" : "auto" }}
          noValidate
        >
          <FormSection title="Reason for Report">
            <InputWrap
              title="Select the Learneo service where the content you are reporting appears:"
              type="fieldset"
              required
            >
              <Select
                field_id="service"
                data={getBusinesses()}
                field={service}
              />
              <FieldError
                errorText="Please select a Learneo Service."
                error={service.error as boolean}
              />
            </InputWrap>
            <InputWrap
              title="Please select the reason for reporting the content:"
              type="fieldset"
              required={true}
            >
              <ReasonGroup
                field_id="reason"
                data={getReasons()}
                context={context}
              />
            </InputWrap>
            {reason.value === "Privacy Violations" ? (
              <NotificationBlock>
                This form is exclusively for reporting privacy violations, e.g.,
                unauthorized disclosure of passwords, addresses, financial data,
                health data, etc. To request the deletion of your personal data
                from a Learneo service or another right under applicable law,
                please read our{" "}
                <a href="/legal/privacy-policy">Privacy Policy</a> for where to
                submit your request.
              </NotificationBlock>
            ) : null}
          </FormSection>

          <FormSection title="Contact Information">
            <div className="legal_form_inner_column">
              {reason.value === "Protection of Minors" ||
              reason.value === "Terrorist Content" ? (
                <Checkbox
                  field={is_anonymous}
                  field_id="is_anonymous"
                  title="Report content anonymously"
                  hint="Without a name and email address, we are unable to confirm receipt of your notice and inform you of our final decision."
                />
              ) : null}
              {is_eu.value ? (
                <Checkbox
                  field={is_trusted_flagger}
                  field_id="is_trusted_flagger"
                  title="I am a Trusted Flagger"
                  hint="A “trusted flagger” is an official status awarded to an entity by a Digital Service Coordinator and listed in a public database by the European Commission."
                />
              ) : null}
            </div>
            <div className="legal_form_input_grid">
              <InputWrap
                title="First Name"
                field_id="first_name"
                required={first_name.required}
              >
                <Input field_id="first_name" type="text" field={first_name} />
              </InputWrap>
              <InputWrap
                title="Last Name"
                field_id="last_name"
                required={last_name.required}
              >
                <Input field_id="last_name" type="text" field={last_name} />
              </InputWrap>
              <InputWrap
                title="Email"
                field_id="email"
                required={email.required}
              >
                <Input field_id="email" type="email" field={email} />
              </InputWrap>
              {reason.value === "Copyright; other IP Infringement" ? (
                <>
                  <InputWrap
                    title="Organization or institution’s name"
                    field_id="contact_org_name"
                    required={contact_org_name.required}
                  >
                    <Input
                      field_id="contact_org_name"
                      type="text"
                      field={contact_org_name}
                    />
                  </InputWrap>
                  <InputWrap
                    title="Job title or role"
                    field_id="contact_job_title"
                    required={contact_job_title.required}
                  >
                    <Input
                      field_id="contact_job_title"
                      type="text"
                      field={contact_job_title}
                    />
                  </InputWrap>
                  <InputWrap
                    title="Street address"
                    field_id="contact_address"
                    required={contact_address.required}
                  >
                    <Input
                      field_id="contact_address"
                      type="text"
                      field={contact_address}
                    />
                  </InputWrap>
                  <InputWrap
                    title="City"
                    field_id="contact_city"
                    required={contact_city.required}
                  >
                    <Input
                      field_id="contact_city"
                      type="text"
                      field={contact_city}
                    />
                  </InputWrap>
                  <InputWrap
                    title="State or province"
                    field_id="contact_state"
                    required={contact_state.required}
                  >
                    <Input
                      field_id="contact_state"
                      type="text"
                      field={contact_state}
                    />
                  </InputWrap>
                  <InputWrap
                    title="Zip code"
                    field_id="contact_zipcode"
                    required={contact_zipcode.required}
                  >
                    <Input
                      field_id="contact_zipcode"
                      type="text"
                      field={contact_zipcode}
                    />
                  </InputWrap>
                </>
              ) : null}
              <InputWrap title="Country" type="fieldset" required={true}>
                <Select
                  field_id="country"
                  data={
                    is_eu.value
                      ? getEEACountries()
                      : getAllCountriesWithoutEEA()
                  }
                  field={country}
                  fullWidth={true}
                />
              </InputWrap>
            </div>
          </FormSection>
          {reason.value === "Copyright; other IP Infringement" ? (
            <FormSection title="Intellectual Property Owner’s Information">
              <div className="legal_form_input_grid">
                <InputWrap
                  title="Name of Intellectual Property Owner"
                  field_id="owner_name"
                  required={owner_name.required}
                >
                  <Input field_id="owner_name" type="text" field={owner_name} />
                </InputWrap>
              </div>
            </FormSection>
          ) : null}
          <ReportedContent context={context} />
          <FormSection title="By checking the boxes below, I state that...*">
            <Checkbox
              field={legal_text}
              field_id="legal_text"
              title={legalMessages.legal_text}
            />
            {reason.value === "Copyright; other IP Infringement" ? (
              <>
                <Checkbox
                  field={legal_text_ip}
                  field_id="legal_text_ip"
                  title={legalMessages.legal_text_ip}
                />
                {!is_eu.value ? (
                  <Checkbox
                    field={legal_text_dmca}
                    field_id="legal_text_dmca"
                    title={legalMessages.legal_text_dmca}
                  />
                ) : null}
              </>
            ) : null}
          </FormSection>
          <div className="legal_form_submit_wrap">
            {error.value ? (
              <span className="legal_form_error">{error.message}</span>
            ) : null}
            <button
              type="submit"
              className="legal_form_button"
              disabled={processing}
            >
              Submit
            </button>
            <div className="text-size-small text-weight-normal text-color-grey text-style-italic">
              By clicking "submit", you acknowledge that repeatedly filing
              fraudulent or abusive reports may result in Learneo discontinuing
              the processing of future notices submitted by you.
            </div>
          </div>
        </form>
      )}
    </>
  );
}
