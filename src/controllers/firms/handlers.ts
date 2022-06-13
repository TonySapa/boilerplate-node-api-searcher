import { NextFunction, Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { defaultCountry } from '../../labels/misc'
import Firm from '../../models/firm'
import { Firm as FirmType } from '../../models/firm/types'
import ReportFirm from '../../models/report_firm'
import { ReportFirm as ReportFirmType } from '../../models/report_firm/types'
import { UserType } from '../../models/user'

/******************************************************************************
 * Stores document in to mongodb collection.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {UserType} user the authenticated user requesting the CRUD operation.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
export const saveFirm = (
  req: Request, res: Response, user: UserType | null, next: NextFunction
) => {
  const userId = user && user._id?.toString() as string
  const firm = req.body as FirmType
  void new Firm({ country: defaultCountry, ...firm, user: userId })
    .save((error, savedFirm) => {
      if (error) {
        return next(error)
      } else {
        return res.status(201).json(savedFirm)
      }
    })
}

/******************************************************************************
 * Non-logged in visitors use this endpoint to report a firm. Missleading,
 * wrong or repeated data that helps moderate the content.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
 export const saveReportFirm = (
  req: Request, res: Response, next: NextFunction
) => {
  const ip: ReportFirmType['ip'] = req.socket.remoteAddress
  const report: HydratedDocument<ReportFirmType> =
    new ReportFirm({ ip: ip, ...req.body })

  void new ReportFirm({ report })
    .save((error, savedFirm) => {
      if (error) {
        return next(error)
      } else {
        return res.status(201).json(savedFirm)
      }
    })
}

/******************************************************************************
 * Filter by geographical location.
 * @param {string} province the string of geographical location to filter by.
 *****************************************************************************/
export const byLocation = (province: string) => {
  const filter = {
    $or: [
      { city: province },
      { city_url: province },
      { region1_name: province },
      { region1_url: province }
    ]
  }

  return province === 'undefined' || province === 'null'
    ? {}
    : filter
}

/******************************************************************************
 * Filter by average rating of reviews.
 * @param {number} rating floating number of the average rating of reviews.
 *****************************************************************************/
export const byReviews = (rating: number) => {
  const filter = {
    $or: [
      { rating: { $gte: rating } },
      { rating: null }
    ]
  }

  return rating > 0
    ? filter
    : {}
}

/******************************************************************************
 * Filter by price ranges.
 * @param {Array<number>} priceRange array containing min and max values of
 * pricing plans of the firm.
 *****************************************************************************/
export const byPrice = (priceRange: Array<number>) => {
  const filter = {
    $or: [
      { $and: [
        { subscription_price_range_max: { $gte: priceRange[0] } },
        { subscription_price_range_min: { $lte: priceRange[1] } }
      ] },
      {
        pricing: null,
        subscription_price_range_min: null,
        subscription_price_range_max: null
      }
    ]
  }

  return priceRange && priceRange.length === 2
    ? filter
    : {}
}
