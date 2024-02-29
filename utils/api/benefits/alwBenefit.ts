import { AlwBenefit, AlwClientAndPartner } from '@croker/oas-eligibility-entitlement-lib'
import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EntitlementResultGeneric,
  ProcessedInput,
  CardCollapsedText,
  LinkWithAction,
  processedInputToLibInput,
} from '../definitions/types'
import { BaseBenefitCard } from './_base'

export class AlwBenefitCard extends BaseBenefitCard<AlwClientAndPartner, EntitlementResultGeneric> {

  protected benefit: AlwBenefit
  protected client: AlwClientAndPartner

  partner: Boolean
  single: Boolean
  future: Boolean
  partnerLivingCountry: String
  relevantIncome: number
  constructor(
    input: ProcessedInput,
    translations: Translations,
    partnerLivingCountry: String,
    partner?: Boolean,
    single?: Boolean,
    future?: Boolean
  ) {
    super(input, translations, BenefitKey.alw)
    this.client = AlwClientAndPartner.fromInput(processedInputToLibInput(input), translations)
    this.benefit = new AlwBenefit(this.client, translations)
    this.partner = partner
    this.future = future
    this.partnerLivingCountry = partnerLivingCountry
    this.relevantIncome = single
      ? this.input.income.adjustedIncome
      : this.input.income.adjustedRelevant
  }

  protected getCardText(): string {
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

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    // partner is eligible, IF income was not provided the result = 0
    //  when IF income > 0 AND invSeparated = true the amount is incorrectly calculated
    //  the correct amount is on the benefitHandler.
    if (this.partner) {
      if (this.entitlement.result > 0) {
        if (this.eligibility.result !== ResultKey.INCOME_DEPENDENT) {
          if (!this.input.invSeparated) {
            cardCollapsedText.push(
              this.translations.detailWithHeading.partnerEligible
            )
          }
        } else {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerDependOnYourIncome
          )
        }
      }
    }

    return cardCollapsedText
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      (this.eligibility.result === ResultKey.INELIGIBLE &&
        this.eligibility.reason === ResultReason.AGE_YOUNG)
    ) {
      links.push(this.translations.links.apply[BenefitKey.alw])
    }
    links.push(this.translations.links.overview[BenefitKey.alw])
    return links
  }
}
