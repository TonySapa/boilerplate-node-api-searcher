import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { Firm as FirmType } from './types'

/******************************************************************************
 * Mongoose schema for firms.
 * @param {number} rating a floating number between 0 and 5 representing rating
 * score average of all reviews.
 * @param {number} user_ratings_total an integer number with the number of user
 * reviews given.
 *****************************************************************************/
const firmSchema = new mongoose.Schema<FirmType>({
  geo_location: Object,
  // lat: String, // "41.5700259",
  // lng: String, // "2.0096398",
  name: {
    type: String, // "Gestorías Sampietro",
    maxlength: 45
  },
  email: String,
  name_url: {
    type: String
  },
  address: String,
  place_id: String, // Google places API id.
  zip_postal_code: String,
  city: String,
  city_url: String,
  route: String,
  urlp: String,
  region1_name: String,
  region1_url: String,
  country: String,
  key_skills: Array,
  subscription_price_range: Array,
  subscription_price_range_max: Number,
  subscription_price_range_min: Number,
  // From here using places details api
  address_components: Array,
  adr_address: String,
  business_status: String,
  formatted_phone_number: String,
  places_api_name: String,
  places_api_types: Array,
  opening_hours: Object,
  photos: Array,
  rating: Number,
  reviews: Array,
  user_ratings_total: Number,
  maps_url: String,
  utc_offset: Number,
  adr_vicinity: String,
  website: String,
  pricing: {
    type: {
      monthly_cost: Number,
      plan_name: String,
      plan_description: String
    }
  }
})

firmSchema.pre<FirmType>('save', function(this: FirmType, next) {
  const random = Math.floor(Math.random() * 1000)
  this.name_url = this.name
    .toLowerCase()
    .trim()
    .replace(/ +(?= )/g,'')
    .replace(/ /g, '-')
    .concat(`-${random}`)
  next()
})

firmSchema.plugin(uniqueValidator)

const Firm = mongoose.model('Firm', firmSchema)

export default Firm
