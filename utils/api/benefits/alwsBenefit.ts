import { AlwsBenefit, AlwsClientAndPartner } from '@croker/oas-eligibility-entitlement-lib'
import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EntitlementResultGeneric,
  ProcessedInput,
  LinkWithAction,
  processedInputToLibInput,
} from '../definitions/types'
import { BaseBenefitCard } from './_base'

export class AlwsBenefitCard extends BaseBenefitCard<AlwsClientAndPartner, EntitlementResultGeneric> {

  protected benefit: AlwsBenefit
  protected client: AlwsClientAndPartner

  future: Boolean
  constructor(
    input: ProcessedInput,
    translations: Translations,
    future: Boolean
  ) {
    super(input, translations, BenefitKey.alws)
    this.client = AlwsClientAndPartner.fromInput(processedInputToLibInput(input), translations)
    this.benefit = new AlwsBenefit(this.client, translations)
    this.future = future
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      (this.eligibility.result === ResultKey.INELIGIBLE &&
        this.eligibility.reason === ResultReason.AGE_YOUNG)
    ) {
      links.push(this.translations.links.apply[BenefitKey.alws])
    }
    links.push(this.translations.links.overview[BenefitKey.alws])
    return links
  }
}
