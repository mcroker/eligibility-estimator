import { OasBenefit, OasClientAndPartner } from '@croker/oas-eligibility-entitlement-lib'
import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  CardCollapsedText,
  EntitlementResultOas,
  ProcessedInput,
  LinkWithAction,
  MetaDataObject,
  processedInputToLibInput,
} from '../definitions/types'
import { getDeferralIncrease } from '../helpers/utils'
import { BaseBenefitCard } from './_base'

export class OasBenefitCard extends BaseBenefitCard<OasClientAndPartner, EntitlementResultOas> {

  protected benefit: OasBenefit
  protected client: OasClientAndPartner

  private partner: Boolean
  private future: Boolean
  private deferral: boolean
  private income: number
  private inputAge: number // Age on the form. Needed as a reference when calculating eligibility for a different age ONLY for non-future benefits
  private formAge: number
  private formYearsInCanada: number
  constructor(
    protected input: ProcessedInput,
    translations: Translations,
    partner?: Boolean,
    future?: Boolean,
    deferral: boolean = false,
    inputAge?: number,
    formAge?: number,
    formYearsInCanada?: number
  ) {
    super(input, translations, BenefitKey.oas)
    this.client = OasClientAndPartner.fromInput(processedInputToLibInput(input), translations)
    this.benefit = new OasBenefit(this.client, translations)
    this.partner = partner
    this.future = future
    this.deferral = deferral
    this.income = this.partner
      ? this.input.income.partner
      : this.input.income.client
    this.inputAge = inputAge
    this.formAge = formAge
    this.formYearsInCanada = formYearsInCanada
  }

  // Add logic here that will generate data for Table component and additional text
  // Translations delegated to BenefitCards component on FE
  protected getMetadata(): any {
    if (this.future) {
      return OasBenefitCard.buildMetadataObj(
        this.input.age,
        this.input.age,
        this.input,
        this.eligibility,
        this.entitlement,
        this.future
      )
    } else {
      return {
        tableData: null,
        currentAge: null,
        monthsTo70: null,
        receiveOAS: false,
      }
    }
  }

  static buildMetadataObj(
    currentAge,
    baseAge,
    input,
    eligibility,
    entitlement,
    future
  ): MetaDataObject {
    const eligible =
      eligibility.result === ResultKey.ELIGIBLE ||
      eligibility.result === ResultKey.INCOME_DEPENDENT

    const meta: MetaDataObject = {
      tableData: null,
      currentAge: null,
      monthsTo70: null,
      receiveOAS: false,
    }

    if (currentAge) {
      const ageInRange = currentAge >= 65 && currentAge < 70
      const receivingOAS = input.receiveOAS
      const currentAgeWhole = Math.floor(currentAge)
      const baseAgeWhole = Math.floor(baseAge)
      const estimate = entitlement.result65To74

      // Based on requirement to not show deferral options in "Will be eligible card" when inbetween min/max income thresholds
      // const dontShowCondition = entitlement.clawback !== 0 && !future

      // Eligible for OAS pension,and are 65-69, who do not already receive
      if (eligible && ageInRange && !receivingOAS) {
        const monthsTo70 = Math.round((70 - currentAge) * 12)
        meta.monthsTo70 = monthsTo70
        meta.receiveOAS = receivingOAS

        // have an estimate > 0
        if (!(estimate <= 0)) {
          const tableData = [...Array(71 - baseAgeWhole).keys()]
            .map((i) => i + baseAgeWhole)
            .map((deferAge, i) => {
              let monthsUntilAge = Math.round((deferAge - baseAge) * 12)
              if (monthsUntilAge < 0) monthsUntilAge = 0

              const monthsToIncrease =
                deferAge === 70
                  ? monthsUntilAge % 12 === 0
                    ? i * 12
                    : (monthsUntilAge % 12) + (i - 1) * 12
                  : i * 12

              const amount =
                estimate + getDeferralIncrease(monthsToIncrease, estimate)

              return {
                age: deferAge,
                amount,
              }
            })
          const filteredTableData = tableData.filter(
            (row) => row.age > currentAge
          )
          meta.tableData = filteredTableData
          meta.currentAge = currentAgeWhole
        }

        return meta
      }

      return {
        tableData: null,
        currentAge: null,
        monthsTo70: null,
        receiveOAS: receivingOAS,
      }
    }
  }

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    // if not eligible, don't bother with any of the below
    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    if (this.partner && this.entitlement.result !== 0) {
      if (
        // eslint-disable-next-line prettier/prettier
        this.input.partnerBenefitStatus.value ===
        PartnerBenefitStatus.OAS_GIS ||
        this.input.partnerBenefitStatus.value === PartnerBenefitStatus.HELP_ME
      ) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.partnerEligible
        )
      } else {
        cardCollapsedText.push(
          this.translations.detailWithHeading.partnerEligibleButAnsweredNo
        )
      }

      return cardCollapsedText
    }

    // getCardText reset the eligibility reason
    if (this.eligibility.reason === ResultReason.INCOME)
      return cardCollapsedText

    // increase at 75
    if (this.benefit.amounts.entitlementAmount !== this.benefit.amounts.age75EntitlementAmount) {
      if (!this.future) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.oasIncreaseAt75
        )
      }
    } else
      cardCollapsedText.push(
        this.translations.detailWithHeading.oasIncreaseAt75Applied
      )

    // deferral
    // if (this.deferralIncrease)
    //   cardCollapsedText.push(
    //     this.translations.detailWithHeading.oasDeferralApplied
    //   )
    // else if (this.input.age >= 65 && this.input.age < 70)
    //   cardCollapsedText.push(
    //     this.translations.detailWithHeading.oasDeferralAvailable
    //   )

    return cardCollapsedText
  }

  protected getCardText(): string {
    // overwrite eligibility detail if income too high
    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.type === EntitlementResultType.NONE
    ) {
      //this.eligibility.result = ResultKey.INELIGIBLE
      this.eligibility.reason = ResultReason.INCOME
      this.eligibility.detail = this.future
        ? this.translations.detail.futureEligibleIncomeTooHigh
        : this.translations.detail.eligibleIncomeTooHigh
      this.entitlement.autoEnrollment = this.getAutoEnrollment()
    }

    // INTRO 1 - general eligibility already in the detail
    let text = this.eligibility.detail

    // INTRO 2 - "expect to receive" variation
    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.eligibility.reason !== ResultReason.INCOME &&
      this.entitlement.result > 0
    ) {
      if (this.future) {
        if (!this.input.livedOnlyInCanada) {
          text += ` ${this.translations.detail.futureExpectToReceivePartial1}`
          if (
            this.formAge != this.input.age &&
            this.formYearsInCanada <= 40 &&
            this.formYearsInCanada != this.input.yearsInCanadaSince18
          ) {
            text += `${this.translations.detail.futureExpectToReceivePartial2}`
          }
          text += ` ${this.translations.detail.futureExpectToReceivePartial3}`
        } else {
          text += ` ${this.translations.detail.futureExpectToReceive}`
        }
      } else {
        text += ` ${this.translations.detail.expectToReceive}`
      }
    }

    // special case
    if (this.eligibility.result === ResultKey.INCOME_DEPENDENT) {
      text += `<p class="mt-6">${this.translations.detail.oas.dependOnYourIncome}</p>`
    }

    // special case
    if (
      this.eligibility.result === ResultKey.INELIGIBLE &&
      this.eligibility.reason === ResultReason.AGE_YOUNG
    ) {
      text += this.translations.nextStepTitle
      //text += `<p class='mt-6'>${this.translations.detail.oas.youShouldReceiveLetter}</p>`
      text += `<p class='mt-6'>${this.translations.detail.oas.youShouldHaveReceivedLetter}</p>`
    }

    if (this.eligibility.reason !== ResultReason.INCOME) {
      const clawbackValue = this.entitlement.clawback

      if (!this.partner && this.input.livingCountry.canada) {
        text +=
          clawbackValue > 0
            ? this.future
              ? `<div class="mt-8">${this.translations.detail.futureOasClawbackInCanada}</div>`
              : `<div class="mt-8">${this.translations.detail.oasClawbackInCanada}</div>`
            : ''
      } else {
        text +=
          clawbackValue > 0
            ? `<div class="mt-8">${this.translations.detail.oasClawbackNotInCanada}</div>`
            : ''
      }
    }

    // RETROACTIVE PAY
    if (
      !this.future &&
      this.eligibility.result === ResultKey.ELIGIBLE &&
      !this.partner &&
      (!this.input.receiveOAS || this.deferral) &&
      (this.input.age > 70 || this.inputAge > 70) &&
      this.eligibility.reason !== ResultReason.INCOME
    ) {
      // if (this.inputAge !== this.input.age) {
      // Retroactive pay
      text += `<p class='mb-2 mt-6 font-bold text-[24px]'>${this.translations.detail.retroactivePay}</p>`
      text += `<p class='mb-2 mt-6'>${this.translations.detail.oas.receivePayment}</p>`
      // }
    }

    // DEFERRAL
    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      !this.partner &&
      (!this.input.receiveOAS || this.deferral) &&
      this.input.age < 70 &&
      this.inputAge < 70
    ) {
      // your Deferral Options

      // if income too high
      if (this.eligibility.reason === ResultReason.INCOME) {
        if (!this.future) {
          text += `<p class='mb-2 mt-6 font-bold text-[24px]'>${this.translations.detail.yourDeferralOptions}</p>`
          text += this.translations.detail.delayMonths
        }
      }

      // normal case
      if (this.entitlement.result > 0) {
        text += `<p class='mb-2 mt-6 font-bold text-[24px]'>${this.translations.detail.yourDeferralOptions}</p>`
        if (this.future) {
          // can also check if this.entitlement.clawback === 0
          text += this.translations.detail.futureDeferralOptions
        } else {
          text += this.translations.detail.sinceYouAreSixty

          if (!this.deferral && this.input.yearsInCanadaSince18 < 40) {
            text += `<p class='mb-2 mt-6'>${this.translations.detail.oas.chooseToDefer}</p>`
          }
        }
      }
    }

    return text
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      this.eligibility.reason === ResultReason.AGE_YOUNG_64
    )
      links.push(this.translations.links.apply[this.benefitKey])
    links.push(this.translations.links.overview[this.benefitKey])
    return links
  }
}
