import { PricingPlanType } from '../pricing_plan/types'

export interface Firm {
  id?: string
  geo_location?: unknown
  // lat?: string // "41.5700259"
  // lng?: string // "2.0096398"
  name: string
  email?: string
  name_url: string
  address?: string
  place_id?: string // Google places API id.
  zip_postal_code?: string
  city?: string
  city_url?: string
  route?: string
  urlp?: string
  region1_name?: string
  region1_url?: string
  country?: string
  key_skills?: [number]
  subscription_price_range?: [number]
  subscription_price_range_max?: number
  subscription_price_range_min?: number
  // From here using places details api
  address_components?: [unknown]
  adr_address?: string
  business_status?: string
  formatted_phone_number?: string
  places_api_name?: string
  places_api_types?: [unknown]
  opening_hours?: unknown
  photos?: [unknown]
  rating?: number
  reviews?: [unknown]
  user_ratings_total?: number
  maps_url?: string
  utc_offset?: number
  adr_vicinity?: string
  website?: string
  pricing?: PricingPlanType
}
