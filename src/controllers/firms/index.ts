import express, { Request, Response } from 'express'
import { UpdateQuery } from 'mongoose'
import jwt from 'jsonwebtoken'
import Firm from '../../models/firm'
import { Firm as FirmType } from '../../models/firm/types'
import User, { UserType } from '../../models/user'
import { byLocation, byPrice, byReviews, saveFirm, saveReportFirm } from './handlers'
import {
  missingErrorType,
  noFromDate,
  noMatches,
  wrongFirmId
} from '../../views/json/firms'

const router = express.Router()
export const routerDescription = 'Handles CRUD operations regarding accounting firms as model'

/******************************************************************************
 * Global projection. Common to all queries. Fields to include/exclude. See
 * mongodb docs about projection:
 * https://docs.mongodb.com/manual/reference/method/db.collection.find/#std-label-method-find-projection
 *****************************************************************************/
const globalProjection = {
  email: 0,
  place_id: 0,
  places_api_types: 0,
  photos: 0,
  utc_offset: 0
}

const globalFilters = {
  country: 'ES',
  // Discard business that are permanently closed.
  $or: [ { business_status: 'OPERATIONAL' }, { business_status: null } ]
}

const firmListProjection = {
  // maps_url: 0,
  // opening_hours: 0,
  // formatted_phone_number: 0,
  international_phone_number: 0,
  photos: 0,
  // reviews: 0,
  // website: 0,
  utc_offset: 0
}

// Limit of array size on API response
const limitResponse = 30

/******************************************************************************
 * Searching firms without specifying pagination or filters will return error.
 *****************************************************************************/
router.get('/all', (_req: Request, res: Response) => {
  res.status(400).send(noFromDate)
})

/******************************************************************************
 * Checks that route and API is working.
 *****************************************************************************/
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK')
})

/******************************************************************************
 * Route to find all firms
 * @param {number} from
 * @param {string} province
 * @param {number} reviews
 * @param {number} price
 * @returns {array} array containing all firms.
 *****************************************************************************/
router.get('/all/:from/:province/:reviews/:price', async (req, res) => {
  // const from = req.params && req.params.from && Number(req.params.from)
  const province: string = req.params && `${req.params.province}` || ''
  const rating: number = req.params && Number(req.params.reviews) || 0
  const priceRange: Array<number> = req.params &&
    req.params.price.split('-').map((price: string) => Number(price)) ||
    [0, 9999]

  const firms = await Firm
    .find(
      {
        $and: [
          globalFilters,
          byLocation(province),
          byReviews(rating),
          byPrice(priceRange)
        ]
      },
      { ...globalProjection, ...firmListProjection },
    )
    .sort({ subscription_price_range_max: -1 })
    // .limit(from + limitResponse)
  
  const firmsLength = await Firm
    .find(
      {
        $and: [
          globalFilters,
          byLocation(province),
          byReviews(rating),
          byPrice(priceRange)
        ]
      },
      { ...globalProjection, ...firmListProjection },
    )
    .countDocuments()

  const jsonResponse = {
    firms: firms,
    length: firmsLength
  }

  firms && firms.length > 0
    ? res.status(200).json(jsonResponse)
    : res.status(404).send(noMatches)
})

/******************************************************************************
 * @param {string} province a string for the city name
 * @returns {array} array containing all firms if any.
 *****************************************************************************/
router.get('/all/:from/:province', async (req, res) => {
  const from: number = req?.params?.from && Number(req.params.from) || 0
  const province = req.params && req.params.province

  const byLocation = {
    $or: [
      { city: province },
      { city_url: province },
      { region1_name: province },
      { region1_url: province }
    ]
  }
  
  const firms = await Firm
    .find(
      { ...globalFilters, ...byLocation },
      { ...globalProjection, ...firmListProjection }
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .limit(from + limitResponse)
  
  const firmsLength = await Firm
  .find(
    { ...globalFilters, ...byLocation },
    { ...globalProjection, ...firmListProjection }
  )
  .countDocuments()
  
  type JSONResponse = {
    firms: Array<FirmType> | null
    length: number
  }

  const jsonResponse: JSONResponse = {
    firms: firms.slice(from, from + limitResponse),
    length: firmsLength
  }

  firms && firms.length > 0
    ? res.status(200).json(jsonResponse)
    : res.status(404).send(noMatches)
})

/******************************************************************************
 * Controller to find a firm specifying "name_url" field.
 * @param {string} province a string for the city name.
 * @returns {array} array containing all firms if any. * 
 *****************************************************************************/
router.get('/firm/:name_url', async (req, res) => {
  const nameUrl = req.params && req.params.name_url
  const byName = { name_url: encodeURI(nameUrl).toLowerCase() }
  const firm: FirmType | null = await Firm
    .findOne(
      { ...globalFilters, ...byName },
      { ...globalProjection }
    )

  firm
    ? res.status(200).json(firm)
    : res.status(404).send(noMatches)
})

/******************************************************************************
 * Update firm found by mongodb document id and update it with the data on
 * the request body.
 *****************************************************************************/
router.put('/update-firm/:id', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newFields: UpdateQuery<unknown> = req.body
  const id: string = req.params.id
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const updatedFirm: Error | FirmType | null = await Firm.findByIdAndUpdate(
    id, newFields,
    { new: true }
  )
  .catch((error: Error) => error)
  updatedFirm
    ? res.status(200).send(updatedFirm)
    : res.status(404).send(updatedFirm)
})

/******************************************************************************
 * Adds a new firm to the database.
 *****************************************************************************/
router.post('/add-firm', (req: Request, res: Response, next) => {
  // Verify authentication by decoding bearer token.
  return jwt.verify(
    `${req.token}`,
    `${process.env.SECRET}`,
    (error, decodedToken) => {
      if (error) {
        return next(error)
      } else {
        // Find and assign the logged in user to the firm and save it.
        User
          .findOne({
            email: (<jwt.UserIDJwtPayload><unknown>decodedToken).email
          })
          .exec((error, user: UserType | null) => error
            ? next(error)
            : saveFirm(req, res, user, next)
          )
      }
    }
  )
})

/******************************************************************************
 * Open endpoint to report firms. User can specify if it contains data that
 * is wrong or it might be duplicated or any other issue related to the
 * specific firm.
 *****************************************************************************/
router.post('/report-firm', async (req: Request, res: Response, next) => {
  if (!(req.body.type >= 0)) {
    res.status(422).send(missingErrorType)
    return null
  } else {
    const firmId = req.body.firm_id as string
    const firm = await Firm.findById(firmId)
      .orFail() as FirmType

    if (!firm.id) {
      res.status(404).json(wrongFirmId(firmId))
      return null
    } else {
      saveReportFirm(req, res, next)
      return null
    }
  }
})

export default router
