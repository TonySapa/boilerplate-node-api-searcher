import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { ReportFirm as ReportFirmType } from './types'

const reportFirmSchema = new mongoose.Schema<ReportFirmType>({
  date: {
    type : Date,
    default: Date.now
  },
  firm_id: String,
  type: {
    type: Number,
    required: true
    // enum: arrayOftypes
  },
  input_text: {
    type: String,
    maxLength: 50
  },
  ip: String
})

reportFirmSchema.plugin(uniqueValidator)

const ReportFirm = mongoose.model('ReportFirm', reportFirmSchema)

export default ReportFirm
