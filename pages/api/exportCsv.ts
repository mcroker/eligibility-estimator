import { createArrayCsvStringifier } from 'csv-writer'
import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import { stripHtml } from 'string-strip-html'
import { numberToStringCurrency } from '../../i18n/api'
import { ResultKey } from '../../utils/api/definitions/enums'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  BenefitResult,
  RequestInput,
  ResponseError,
} from '../../utils/api/definitions/types'
import { RequestHandler } from '../../utils/api/helpers/requestHandler'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseError>
) {
  try {
    console.log(`Processing CSV request: `, req.query)

    // validation
    const requestInput: RequestInput = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })

    // processing
    const handler = new RequestHandler(requestInput)
    const records: string[][] = []
    const csvTranslations = handler.translations.csv
    records.push([csvTranslations.appName])

    records.push(
      [''],
      [csvTranslations.formResponses],
      [csvTranslations.question, csvTranslations.answer]
    )
    for (const value of handler.fieldData) {
      let question = stripHtml(value.label).result
      let response = handler.rawInput[value.key].toString()
      records.push([question, response])
    }

    records.push(
      [''],
      [csvTranslations.estimationResults],
      [
        csvTranslations.benefit,
        csvTranslations.eligibility,
        csvTranslations.details,
        csvTranslations.entitlement,
      ]
    )
    for (const resultKey in handler.benefitResults) {
      const result: BenefitResult = handler.benefitResults[resultKey]
      const benefitName = handler.translations.benefit[resultKey]
      const [eligibility, detail] = stripHtml(
        result.eligibility.detail
      ).result.split('\n')
      const entitlement = numberToStringCurrency(
        result.entitlement.result,
        handler.translations._locale
      )
      records.push([benefitName, eligibility, detail, entitlement])
    }

    records.push(
      [''],
      [csvTranslations.links],
      [csvTranslations.description, csvTranslations.url]
    )
    for (const link of handler.summary.links) {
      records.push([link.text, link.url])
    }

    let output = createArrayCsvStringifier({}).stringifyRecords(records)
    res.setHeader('Content-Type', 'application/csv')
    res.setHeader('Content-Disposition', `attachment; filename=export.csv`)
    res.status(200).send(output)
  } catch (error) {
    res.status(400).json({
      error: ResultKey.INVALID,
      detail: error.details || String(error),
    })
    console.log(error)
    return
  }
}