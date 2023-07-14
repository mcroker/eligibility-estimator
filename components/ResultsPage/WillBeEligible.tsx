import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const WillBeEligible: React.VFC<{
  futureResults: any
  partner?: boolean
  partnerNoOAS: boolean
}> = ({ futureResults, partner = false, partnerNoOAS }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const language = useRouter().locale as Language

  return (
    <>
      <h2
        id={partner ? 'future-partner-estimate' : 'future-estimate'}
        className="h2 mt-12"
      >
        <Image src="/pg-check.svg" alt="" width={30} height={30} />
        {partner
          ? tsln.resultsPage.partnerFutureEligible
          : tsln.resultsPage.futureEligible}
      </h2>

      {futureResults.map((resultObj, idx) => {
        const age = Object.keys(resultObj)[0]
        const text = `${language === 'en' ? 'At' : 'À'} ${age}, ${
          partner
            ? tsln.resultsPage.partnerToReceive
            : tsln.resultsPage.toReceive
        }:`

        const resultsArray: BenefitResult[] = Object.keys(resultObj[age]).map(
          (value) => resultObj[age][value]
        )

        let eligible = resultsArray.filter(
          (result) =>
            result.eligibility?.result === ResultKey.ELIGIBLE ||
            result.eligibility?.result === ResultKey.INCOME_DEPENDENT
        )

        // If partner answers "No" to receiving OAS, the amounts should not show
        if (partner && partnerNoOAS) {
          eligible = eligible.map((benefit) => {
            return {
              ...benefit,
              entitlement: { ...benefit.entitlement, result: 0 },
            }
          })
        }

        const eligibleTotalAmount = eligible.reduce(
          (sum, obj) => sum + obj.entitlement.result,
          0
        )

        return (
          <div
            className={idx + 1 !== futureResults.length ? 'mb-10' : ''}
            key={age}
          >
            <p
              className="pl-[35px]"
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />

            <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
              {eligible.map((benefit) => (
                <EstimatedTotalItem
                  key={benefit.benefitKey}
                  heading={apiTrans.benefit[benefit.benefitKey]}
                  result={benefit}
                />
              ))}
            </ul>
            {eligible.length > 1 && eligibleTotalAmount > 0 && (
              <p className="pl-[35px]">
                {partner
                  ? tsln.resultsPage.futurePartnerTotal
                  : tsln.resultsPage.futureTotal}
                <strong>
                  {numberToStringCurrency(eligibleTotalAmount, language)}
                </strong>
                .
              </p>
            )}
          </div>
        )
      })}
    </>
  )
}