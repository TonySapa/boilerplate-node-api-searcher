import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { PricingPlanType } from './types'

const pricingPlanSchema = new Schema<PricingPlanType>({
  monthly_cost: {
    type: Number,
    required: true
  },
  plan_name: {
    type: String
  },
  plan_description: {
    type: String
  }
})

pricingPlanSchema.plugin(uniqueValidator)

const PricingPlan = model('PricingPlan', pricingPlanSchema)

export default PricingPlan
