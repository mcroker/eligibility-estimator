import Joi from 'joi'
import { Translations } from '../../../i18n/api'
import {
  IncomeHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../helpers/fieldClasses'
import {
  BenefitKey,
  Language,
  LegalStatus,
  LinkIcon,
  MaritalStatus,
  PartnerBenefitStatus,
  SummaryState,
} from './enums'
import { FieldConfig, FieldKey } from './fields'
import {
  ClientAndPartnerInput,
  EligibilityResult,
  EntitlementResult,
  EntitlementResultGeneric, 
  EntitlementResultOas
} from '@croker/oas-eligibility-entitlement-lib'

/**
 * What the API expects to receive. This is passed to Joi for validation.
 */
export interface RequestInput {
  incomeAvailable?: boolean
  income: number // personal income
  incomeWork: number // personal income from work
  age: number
  clientBirthDate?: string
  receiveOAS: boolean
  oasDeferDuration: string
  oasDefer: boolean
  oasAge: number
  maritalStatus: MaritalStatus
  invSeparated: boolean
  livingCountry: string // country code
  legalStatus: LegalStatus
  livedOnlyInCanada: boolean
  yearsInCanadaSince18: number
  yearsInCanadaSinceOAS?: number
  everLivedSocialCountry: boolean
  partnerBenefitStatus: PartnerBenefitStatus
  partnerIncomeAvailable?: boolean
  partnerIncome: number // partner income
  partnerIncomeWork: number // partner income from work
  partnerAge: number
  partnerBirthDate?: string
  partnerLivingCountry: string // country code
  partnerLegalStatus: LegalStatus
  partnerLivedOnlyInCanada: boolean
  partnerYearsInCanadaSince18: number
  _language?: Language
}

/**
 * After Joi validation and additional pre-processing, this is the object passed around to provide app logic.
 */
export interface ProcessedInput {
  income: IncomeHelper
  age: number
  clientBirthDate: string
  receiveOAS: boolean
  oasDeferDuration: string
  oasDefer: boolean
  oasAge: number
  maritalStatus: MaritalStatusHelper
  livingCountry: LivingCountryHelper
  legalStatus: LegalStatusHelper
  livedOnlyInCanada: boolean
  yearsInCanadaSince18: number
  yearsInCanadaSinceOAS?: number
  everLivedSocialCountry: boolean
  partnerBenefitStatus: PartnerBenefitStatusHelper
  invSeparated: boolean
}

export function requestInputToLibInput(req: RequestInput): ClientAndPartnerInput {
  return {
    client: {
      age: req.age,
      birthDate: req.clientBirthDate,
      income: req.income,
      incomeWork: req.incomeWork,
      legalStatus: req.legalStatus,
      livedOnlyInCanada: req.livedOnlyInCanada,
      livingCountry: req.livingCountry,
      maritalStatus: req.maritalStatus,
      yearsInCanadaSince18: req.yearsInCanadaSince18
    },
    partner: {
      age: req.partnerAge,
      birthDate: req.partnerBirthDate,
      income: req.partnerIncome,
      incomeWork: req.partnerIncomeWork,
      legalStatus: req.partnerLegalStatus,
      livedOnlyInCanada: req.partnerLivedOnlyInCanada,
      livingCountry: req.partnerLivingCountry,
      yearsInCanadaSince18: req.partnerYearsInCanadaSince18
    },
  }
}

export function processedInputToLibInput(inp: ProcessedInput): ClientAndPartnerInput {
  return {
    client: {
      age: inp.age,
      birthDate: inp.clientBirthDate,
      income: inp.income.client,
      incomeWork: inp.income.clientIncomeWork,
      legalStatus: inp.legalStatus.value,
      livedOnlyInCanada: inp.livedOnlyInCanada,
      livingCountry: inp.livingCountry.value,
      maritalStatus: inp.maritalStatus.value,
      yearsInCanadaSince18: inp.yearsInCanadaSince18
    },
    partner: {
      benefitStatus: inp.partnerBenefitStatus.value,
      income: inp.income.partner,
      incomeWork: inp.income.partnerIncomeWork,
    },
  }
}

export interface ProcessedInputWithPartner {
  client: ProcessedInput
  partner: ProcessedInput
  _translations: Translations
}


/**
 * This is text within the cards, that will expand when clicked.
 */
export interface CardCollapsedText {
  heading: string
  text: string
}

/**
 * This is the object containing everything the UI needs to know to display the benefit result card.
 */
export interface CardDetail {
  mainText: string
  collapsedText: CardCollapsedText[]
  links: LinkWithAction[]
  meta: MetaDataObject
}

export interface BenefitResult<
  T extends EntitlementResult = EntitlementResult
> {
  benefitKey: BenefitKey
  eligibility: EligibilityResult
  entitlement: T
  cardDetail: CardDetail
}

export interface BenefitResultsObject {
  oas?: BenefitResult<EntitlementResultOas>
  gis?: BenefitResult<EntitlementResultGeneric>
  alw?: BenefitResult<EntitlementResultGeneric>
  alws?: BenefitResult<EntitlementResultGeneric>
}

export interface BenefitResultsObjectWithPartner {
  client?: BenefitResultsObject
  partner?: BenefitResultsObject
}

export interface ResponseSuccess {
  results: BenefitResultsObject
  futureClientResults: BenefitResultsObject
  partnerResults: BenefitResultsObject
  futurePartnerResults: BenefitResultsObject
  summary: SummaryObject
  visibleFields: Array<FieldKey>
  missingFields: Array<FieldKey>
  fieldData: Array<FieldConfig>
}

export interface ResponseError {
  visibleFields: Array<FieldKey>
  missingFields: Array<FieldKey>
  error: string
  detail: Joi.ValidationError | Error
}

export interface Link {
  text: string
  url: string
  order: number
  icon?: LinkIcon
}

export interface LinkWithAction extends Link {
  action: string
}

export interface SummaryObject {
  state: SummaryState
  partnerState: SummaryState
  title: string
  links: Link[]
  details: string
  entitlementSum: number
  partnerEntitlementSum: number
}

export interface NextStepText {
  nextStepTitle: string
  nextStepContent: string
}

export type TableData = {
  age: number
  amount: number
}

export interface MetaDataObject {
  tableData?: null | TableData[]
  currentAge?: null | number
  monthsTo70?: null | number
  receiveOAS: boolean
}

export interface MonthsYears {
  months: number
  years: number
}
