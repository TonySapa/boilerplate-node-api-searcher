/* eslint-disable @typescript-eslint/no-unsafe-call */
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../../models/user'
import EntryModel from '../../models/entry'
import { EntryType } from '../../models/entry/types'
import { saveEntry } from './handlers'
import { UserType } from '../../models/user'
// import { tokenFailed } from '../views/json/users'

const router = express.Router()

declare module 'jsonwebtoken' {
  // eslint-disable-next-line no-unused-vars
  interface UserIDJwtPayload extends jwt.JwtPayload {
    email: string
    token?: string
  }
}

declare module 'express' { 
  export interface Request {
    token?: string
  }
}

/******************************************************************************
 * Health endpoint to monitor that  the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
  res.send('Hello World')
})

/******************************************************************************
 * Gets all entries without any filters
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/', async (_req, res) => {
  const entries = await EntryModel
    .find({}).populate('user', { username: 1, name: 1 })

  res.json(entries)
})

/******************************************************************************
 * Gets entries where field2 falls between "min" and "max" values.
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/range/:min/:max', async (req, res) => {
  const { min, max } = req.params
  const entries = await EntryModel
    .find({
      field2: { $gte:  min, $lte: max }
    })
    .populate('user', { username: 1, name: 1 })

  res.json(entries)
})

/******************************************************************************
 * Gets entries where field2 falls between "min" and "max" values. The field2
 * in this case is an array of multiple values.
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
 router.get('/range/:min/:max', async (req, res) => {
  const { min, max } = req.params
  const entries = await EntryModel
    .find({
      field3: { $gte:  min, $lte: max }
    })
    .populate('user', { username: 1, name: 1 })

  res.json(entries)
})

/******************************************************************************
 * Get a specific entry, found by id
 * @access a token is NOT needed
 * @param {string} id the id to match
 * @returns a 200 with the matched entry
 *****************************************************************************/
router.get('/:id', async (req, res) => {
  const entry: EntryType | null = await EntryModel.findById(req.params.id)
  entry
    ? res.status(200).json(entry)
    : res.status(404).json({ error: 'No entry found with that id' })
})

/******************************************************************************
 * Deletes a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 204 with no content
 *****************************************************************************/
router.delete('/:id', async (req: Request, res: Response):
Promise<Response<unknown, Record<string, unknown>>> => {
  const decodedToken = <jwt.UserIDJwtPayload><unknown>
    jwt.verify(`${req.token}`, `${process.env.SECRET}`)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userId = decodedToken.id

  if (!req.token || !userId) {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'User invalid' })
    } else {
      const entry = await EntryModel.findById(req.params.id)
      if (entry && (entry.user.toString() !== userId)) {
        return res
          .status(401).json({ error: 'only the creator can delete it' })
      } else {
        entry && await entry?.remove()
        return res.status(204).end()
      }
    }
  }
})

/******************************************************************************
 * Updates a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 200 with the updated entry
 *****************************************************************************/
router.put('/:id', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const entry: EntryType = req.body

  const updatedEntry = await EntryModel
    .findByIdAndUpdate(req.params.id, entry, { new: true })

  if (!updatedEntry) {
    return res.status(400).send({ error: 'No entry exists with that id' })
  } else {
    return res.json(updatedEntry.toJSON())
  }
})

/******************************************************************************
 * Creates a new entry.
 * @access a token IS needed
 * @param {EntryType} entry
 * @returns a 201 with the new entry
 *****************************************************************************/
router.post('/', (req: Request, res: Response, next) => {
  // Verify authentication by decoding bearer token.
  return jwt.verify(
    `${req.token}`,
    `${process.env.SECRET}`,
    (error, decodedToken) => {
      if (error) {
        return next(error)
      } else {
        // Find and assign the logged in user to the entry and save it.
        User
          .findOne({
            email: (<jwt.UserIDJwtPayload><unknown>decodedToken).email
          })
          .exec((error, user: UserType | null) => error
            ? next(error)
            : saveEntry(req, res, user, next)
          )
      }
    })
})

export default router
