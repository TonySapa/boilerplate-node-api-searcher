## Firm model
Contains the retrievable data of an accounting firm.
- Legal name
- Brand name
- Address
- Time schedule
- Valoration
...

Original mongoose schema in JavaScript:
```
{
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
  place_id: {
    type: String, // Google places API id.
    unique: true
  },
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
    type: [mongoose.Schema.PricingPlan]
  }
}

module.exports = Firm
```