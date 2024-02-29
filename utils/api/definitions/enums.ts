export {
  MaritalStatus,
  LegalStatus,
  PartnerBenefitStatus,
  BenefitKey,
  LivingCountry,
  EntitlementResultType,
  ResultKey,
  ResultReason,
  Language
} from '@croker/oas-eligibility-entitlement-lib'

export enum FieldCategory {
  AGE = 'age',
  INCOME = 'income',
  LEGAL = 'legal',
  RESIDENCE = 'residence',
  MARITAL = 'marital',
}

// used to determine color+type of alert dialog
export enum SummaryState {
  AVAILABLE_ELIGIBLE = 'AVAILABLE_ELIGIBLE', // green, display results (eligible for at least one)
  MORE_INFO = 'MORE_INFO', // yellow, need to answer more
  UNAVAILABLE = 'UNAVAILABLE', // yellow, can not provide any results, contact Service Canada (conditionally eligible)
  AVAILABLE_INELIGIBLE = 'AVAILABLE_INELIGIBLE', // red, display results (ineligible)
  AVAILABLE_DEPENDING = 'AVAILABLE_DEPENDING', // eligible, depending on income
}

export enum LinkIcon {
  note = 'note',
  info = 'info',
  link = 'link',
}

// all "custom" Joi Validation errors that we properly handle and translate for the end user
export enum ValidationErrors {
  invalidAge = 'invalidAge',
  receiveOASEmpty = 'receiveOASEmpty',
  oasDeferEmpty = 'oasDeferEmpty',
  providePartnerIncomeEmpty = 'providePartnerIncomeEmpty',
  partnerIncomeEmpty = 'partnerIncomeEmpty',
  partnerIncomeEmptyReceiveOAS = 'partnerIncomeEmptyReceiveOAS',
  partnerYearsSince18Empty = 'partnerYearsSince18Empty',
  maritalStatusEmpty = 'maritalStatusEmpty',
  legalStatusNotSelected = 'legalStatusNotSelected',
  partnerLegalStatusNotSelected = 'partnerLegalStatusNotSelected',
  partnerBenefitStatusEmpty = 'partnerBenefitStatusEmpty',
  invSeparatedEmpty = 'invSeparatedEmpty',
  socialCountryEmpty = 'socialCountryEmpty',
  partnerSocialCountryEmpty = 'partnerSocialCountryEmpty',
  onlyInCanadaEmpty = 'onlyInCanadaEmpty',
  partnerOnlyInCanadaEmpty = 'partnerOnlyInCanadaEmpty',
  provideIncomeEmpty = 'provideIncomeEmpty',
  incomeEmpty = 'incomeEmpty',
  incomeEmptyReceiveOAS = 'incomeEmptyReceiveOAS',
  incomeWorkEmpty = 'incomeWorkEmpty',
  incomeWorkGreaterThanNetIncome = 'incomeWorkGreaterThanNetIncome',
  partnerIncomeWorkEmpty = 'partnerIncomeWorkEmpty',
  partnerIncomeWorkGreaterThanNetIncome = 'partnerIncomeWorkGreaterThanNetIncome',
  incomeBelowZero = 'incomeBelowZero',
  partnerIncomeBelowZero = 'partnerIncomeBelowZero',
  incomeTooHigh = 'incomeTooHigh',
  partnerIncomeTooHigh = 'partnerIncomeTooHigh',
  ageUnder18 = 'ageUnder18',
  partnerAgeUnder18 = 'partnerAgeUnder18',
  ageOver150 = 'ageOver150',
  partnerAgeOver150 = 'partnerAgeOver150',
  oasAge65to70 = 'oasAge65to70',
  yearsInCanadaNotEnough10 = 'yearsInCanadaNotEnough10',
  yearsInCanadaNotEnough20 = 'yearsInCanadaNotEnough20',
  yearsInCanadaMinusAge = 'yearsInCanadaMinusAge',
  partnerYearsInCanadaMinusAge = 'partnerYearsInCanadaMinusAge',
  maritalUnavailable = 'maritalUnavailable',
  legalUnavailable = 'legalUnavailable',
  socialCountryUnavailable10 = 'socialCountryUnavailable10',
  socialCountryUnavailable20 = 'socialCountryUnavailable20',
}

// must be one of: https://www.techonthenet.com/js/language_tags.php
export enum LanguageCode {
  EN = 'en-CA',
  FR = 'fr-CA',
}

export enum ISOLanguage {
  EN = 'eng',
  FR = 'fra',
}
