import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import { canadaWholeLife, canadian, partnerUndefined } from './expectUtils'
import { mockGetRequest } from './factory'

describe('field requirement analysis', () => {
  it('requires base questions when nothing provided', async () => {
    const res = await mockGetRequest({
      income: undefined,
      age: undefined,
      oasDefer: undefined,
      oasAge: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      livedOutsideCanada: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_DEFER,
      FieldKey.INCOME,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_OUTSIDE_CANADA,
      FieldKey.MARITAL_STATUS,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_DEFER,
      FieldKey.INCOME,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_OUTSIDE_CANADA,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires no fields when all provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasDefer: true,
      oasAge: 70,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      partnerAge: 65,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLivedOutsideCanada: true,
      partnerYearsInCanadaSince18: 5,
      partnerEverLivedSocialCountry: true,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_DEFER,
      FieldKey.OAS_AGE,
      FieldKey.INCOME,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_OUTSIDE_CANADA,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_INCOME,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18,
      FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY,
    ])
  })
})

describe('field requirements analysis: conditional fields', () => {
  it('requires "yearsInCanadaSince18" when livedOutsideCanada=true', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.YEARS_IN_CANADA_SINCE_18])
    expect(res.body.visibleFields).toContain(FieldKey.YEARS_IN_CANADA_SINCE_18)
  })

  it('requires "everLivedSocialCountry" when living in Canada and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toContain(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
  })

  it('requires "everLivedSocialCountry" when living in No Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toContain(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
  })

  it('requires partner questions when marital=married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.PARTNER_INCOME,
      FieldKey.PARTNER_BENEFIT_STATUS,
    ])
    expect(res.body.visibleFields).toContain(FieldKey.PARTNER_INCOME)
    expect(res.body.visibleFields).toContain(FieldKey.PARTNER_BENEFIT_STATUS)
  })
})