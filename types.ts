export type ReportFormState = {
  is_eu: ReportFormField<boolean>;
  is_anonymous: ReportFormField<boolean>;
  is_trusted_flagger: ReportFormField<boolean>;
  service: ReportFormField<string>;
  reason: ReportFormField<string>;
  first_name: ReportFormField<string>;
  last_name: ReportFormField<string>;
  email: ReportFormField<string>;
  country: ReportFormField<string>;
  contact_org_name: ReportFormField<string>;
  contact_job_title: ReportFormField<string>;
  contact_address: ReportFormField<string>;
  contact_city: ReportFormField<string>;
  contact_state: ReportFormField<string>;
  contact_zipcode: ReportFormField<string>;
  owner_name: ReportFormField<string>;
  legal_text: ReportFormField<boolean>;
  legal_text_ip: ReportFormField<boolean>;
  legal_text_dmca: ReportFormField<boolean>;
  urls: ReportFormField<ReportUrlBlock[]>;
};

export type ReportFormField<T> = {
  value: T;
  path_required?: boolean;
  privacy_types_required?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  updateField: (updates: {
    value?: T;
    path_required?: boolean;
    privacy_types_required?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
  }) => void;
};

export type ReportUrlBlock = {
  id: string;
  path: string;
  detail: string;
  detail_required: boolean;
  privacy_types: string[];
  path_error: boolean;
  detail_error: boolean;
  privacy_types_error: boolean;
  path_error_message: string;
  detail_error_message: string;
};

export type DisputeFormState = {
  is_eu: DisputeFormField<boolean>;
  service: DisputeFormField<string>;
  first_name: DisputeFormField<string>;
  last_name: DisputeFormField<string>;
  email: DisputeFormField<string>;
  legal_text1: DisputeFormField<boolean>;
  legal_text2: DisputeFormField<boolean>;
  urls: DisputeFormField<DisputeFormUrl[]>;
};

export type DisputeFormField<T> = {
  value: T;
  required?: boolean;
  error?: boolean;
  path_required?: boolean;
  detail_required?: boolean;
  updateField: (updates: {
    value?: T;
    required?: boolean;
    error?: boolean;
    path_required?: boolean;
    detail_required?: boolean;
  }) => void;
};

export type DisputeFormUrl = {
  id: string;
  path: string;
  detail: string;
  path_error: boolean;
  detail_error: boolean;
  path_error_message: string;
  detail_error_message: string;
};

export type Reason = {
  name: string;
  sublabel: string;
};

export type Country = {
  name: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
};

export type Business = {
  name: string;
  icon?: string;
  url: string;
};

export type Location = {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
};

export type Violation = {
  name: string;
};
