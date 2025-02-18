import {
  EntitlementResultType,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'
import {
  expectAlwsMarital,
  expectAlwTooOld,
  expectDeferralTable,
  expectGisEligible,
  expectGisNotEligible,
  expectOasEligible,
} from '../../utils/expectUtils'

import { mockGetRequest } from '../../utils/factory'

//file for extracting test data
const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

describe('gisCoupleTwoPensBenefit', () => {
  /* CALC-23 */
  it('should pass 23 test - CALC-23', async () => {
    const desiredName = 'CALC-23' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 628.09)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 576.35, true)
    expectGisEligible(res, 820.21, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-24 */
  it('should pass 24 test - CALC-24', async () => {
    const desiredName = 'CALC-24' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 743.31)
    expectGisEligible(res, 580.02)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 545.09, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-25 */
  it('should pass 25 test - CALC-25', async () => {
    const desiredName = 'CALC-25' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 759.24 },
      { age: 68, amount: 807.02 },
      { age: 69, amount: 854.81 },
      { age: 70, amount: 902.59 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 723.4)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 487.02)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 452.09, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-26 */
  it('should pass 26 test - CALC-26', async () => {
    const desiredName = 'CALC-26' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 803.39)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 409.09)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 518.72, true)
    expectGisEligible(res, 658.84, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-27 */
  it('should pass 27 test - CALC-27', async () => {
    const desiredName = 'CALC-27' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 870.46)
    expectDeferralTable(res, deferralTable)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 0.3, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-28 */
  it('should pass 28 test - CALC-28', async () => {
    const desiredName = 'CALC-28' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 779.64)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.18, true)
    expectGisEligible(res, 0.0, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
    expectAlwTooOld(res, true)
  })

  /* CALC-29 */
  it('should pass 29 test - CALC-29', async () => {
    const desiredName = 'CALC-29' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 1204.44)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 523.95, true)
    expectGisEligible(res, 802.74, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-30
  it('should pass 30 test - CALC-30', async () => {
    const desiredName = 'CALC-30' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 215.17)
    expectGisEligible(res, 1121.44)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 366.77, true)
    expectGisEligible(res, 876.93, true)
    expectAlwTooOld(res, true)
    
  })*/

  /* CALC-31*/
  it('should pass 31 test - CALC-31', async () => {
    const desiredName = 'CALC-31' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 1028.44)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 366.77, true)
    expectGisEligible(res, 783.93, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-32 */
  it('should pass 32 test - CALC-32', async () => {
    const desiredName = 'CALC-32' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 985.44)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 506.49, true)
    expectGisEligible(res, 601.2, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-33 */
  it('should pass 33 test - CALC-33', async () => {
    const desiredName = 'CALC-33' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 576.65)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 489.02, true)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-34 
  it('should pass 34 test - CALC-34', async () => {
    const desiredName = 'CALC-34' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 232.22)
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 454.09, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
    
  })*/

  /* CALC-35 */
  it('should pass 35 test - CALC-35', async () => {
    const desiredName = 'CALC-35' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 611.28, true)
    expectGisEligible(res, 1130.78, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-36 */
  it('should pass 36 test - CALC-36', async () => {
    const desiredName = 'CALC-36' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 817.64)
    expectGisEligible(res, 998.47)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6, true)
    expectGisEligible(res, 960.45, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-37 */
  it('should pass 37 test - CALC-37', async () => {
    const desiredName = 'CALC-37' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 717.6)
    expectGisEligible(res, 1047.78)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6, true)
    expectGisEligible(res, 898.45, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-38 */
  it('should pass 38 test - CALC-38', async () => {
    const desiredName = 'CALC-38' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 999)
    expectGisEligible(res, 561.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 681.14, true)
    expectGisEligible(res, 1060.92, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-39 */
  it('should pass 39 test - CALC-39', async () => {
    const desiredName = 'CALC-39' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 860.68)
    expectGisEligible(res, 92.82)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6, true)
    expectGisEligible(res, 523.45, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-40 */
  it('should pass 40 test - CALC-40', async () => {
    const desiredName = 'CALC-40' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 663.67, true)
    expectGisEligible(res, 83.75, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-41 */
  it('should pass 41 test - CALC-41', async () => {
    const desiredName = 'CALC-41' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectGisEligible(res, 1567.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 384.23, true)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-42 
  it('should pass 42 test - CALC-42', async () => {
    const desiredName = 'CALC-42' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 195.65)
    expectGisEligible(res, 1484.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 384.23, true)
    expectGisEligible(res, 1344.68, true)
    expectAlwTooOld(res, true)
    
  })*/
  /* CALC-43 */
  it('should pass 43 test - CALC-43', async () => {
    const desiredName = 'CALC-43' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 187.22 },
      { age: 68, amount: 199.8 },
      { age: 69, amount: 212.37 },
      { age: 70, amount: 221.81 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1360.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.18, true)
    expectGisEligible(res, 1378.74, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-44 */
  it('should pass 44 test - CALC-44', async () => {
    const desiredName = 'CALC-44' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 187.22 },
      { age: 69, amount: 199.8 },
      { age: 70, amount: 211.33 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1085.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1619.8, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-45 */
  it('should pass 45 test - CALC-45', async () => {
    const desiredName = 'CALC-45' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 187.22 },
      { age: 70, amount: 194.56 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 616.77)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1099.8, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-46 
it('should pass 46 test - CALC-46', async () => {
  const desiredName = 'CALC-46' // Replace with the desired name
  const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  const res = await mockGetRequest(extractedPayload)

  //client results
  expectOasEligible(res, EntitlementResultType.PARTIAL, 216.57)
  expectGisEligible(res, 0.0)
  expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
  expectAlwTooOld(res)
  expectAlwsMarital(res)

  //partner results
  expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02, true)
  expectGisEligible(res, 452.26, true)
  expectAlwTooOld(res, true)
  
})*/
})
