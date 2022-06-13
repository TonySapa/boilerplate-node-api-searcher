import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { EntryType } from './types'

const entrySchema = new Schema<EntryType>({
  field1: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 254,
    required: true
  },
  field2: {
    type: Number
  },
  field3: {
    type: [Number]
  },
  user: { // The id of the user that created the entry
    type: String,
    required: true
  }
})

/* entrySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // returnedObject.id = `${returnedObject._id}`.toString()
    // delete returnedObject._id
    // delete returnedObject.__v
    // delete returnedObject.passwordHash
  }
}) */

entrySchema.plugin(uniqueValidator)

/** Mongoose model for "entry". With fields: field1, field2 and user.
 * @field field1 is a unique string between 3 and 254 characters
 * @field field2 is a number
 * @field user is a unique string with the user id
 * @
 */
const EntryModel = model<EntryType>('Entry', entrySchema)

export default EntryModel
