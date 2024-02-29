import { GisBenefit, GisClientAndPartner } from '@croker/oas-eligibility-entitlement-lib'
import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  BenefitResult,
  EntitlementResultGeneric,
  EntitlementResultOas,
  ProcessedInput,
  CardCollapsedText,
  LinkWithAction,
  processedInputToLibInput,
} from '../definitions/types'
import legalValues from '../scrapers/output'
import { BaseBenefitCard } from './_base'

export class GisBenefitCard extends BaseBenefitCard<GisClientAndPartner, EntitlementResultGeneric> {

  protected benefit: GisBenefit
  protected client: GisClientAndPartner

  partner: Boolean
  future: Boolean
  originalInput?: ProcessedInput
  constructor(
    input: ProcessedInput,
    translations: Translations,
    private oasResult: BenefitResult<EntitlementResultOas>,
    partner?: Boolean,
    future?: Boolean,
    originalInput?: ProcessedInput
  ) {
    super(input, translations, BenefitKey.gis)
    this.client = GisClientAndPartner.fromInput(processedInputToLibInput(input), translations)
    this.benefit = new GisBenefit(this.client, translations, this.oasResult)
    this.partner = partner
    this.future = future
    this.originalInput = originalInput
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT
    ) {
      !this.future && links.push(this.translations.links.apply[BenefitKey.gis])
    }
    links.push(this.translations.links.overview[BenefitKey.gis])
    return links
  }

  protected getCardText(): string {
    /**
     * The following IF block is a copy from benefitHandler.translateResults,
     *   the issue is that cardDetail object is updated only once if undefined, and could have the wrong information.
     *   overwrite eligibility.detail and autoEnrollment when entitlement.type = none.
     */

    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.type === EntitlementResultType.NONE
    ) {
      //this.eligibility.result = ResultKey.INELIGIBLE
      this.eligibility.reason = ResultReason.INCOME
      this.eligibility.detail = this.future
        ? this.translations.detail.gis.futureEligibleIncomeTooHigh
        : this.translations.detail.gis.incomeTooHigh
      this.entitlement.autoEnrollment = this.getAutoEnrollment()
    }

    // another hack, to avoid adding message expectToReceive
    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.eligibility.reason === ResultReason.INCOME &&
      this.entitlement.result > 0
    ) {
      return this.eligibility.detail
    }

    let text = this.eligibility.detail

    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.result > 0
    ) {
      text += this.future
        ? ` ${this.translations.detail.futureExpectToReceive}`
        : ` ${this.translations.detail.expectToReceive}`
    }

    return text
  }

  public updateCollapsedText(): CardCollapsedText[] {
    return this.getCardCollapsedText()
  }

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    const inputs = this.originalInput === null ? this.input : this.originalInput
    // Related to OAS Deferral, don't show if already receiving
    if (inputs) {
      const ageInOasRange = inputs.age >= 65 && inputs.age < 70
      if (
        this.partner !== true &&
        this.entitlement.result !== 0 &&
        ageInOasRange &&
        !inputs.receiveOAS &&
        !this.future
      ) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.ifYouDeferYourPension
        )
      }
    }

    if (this.partner) {
      if (this.input.income.provided && this.entitlement.result !== 0) {
        if (
          this.input.partnerBenefitStatus.value === PartnerBenefitStatus.NONE
        ) {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligibleButAnsweredNo
          )
        } else {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligible
          )
        }
      }
    }

    return cardCollapsedText
  }
}
