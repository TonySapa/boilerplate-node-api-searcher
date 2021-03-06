import mongoose from 'mongoose'
import supertest from 'supertest'
import index from '../../src/index'
import Firm from '../../src/models/firm'
// import User from '../../models/user/User'

const api = supertest(index)

describe('Firms router.', () => {
  beforeAll(async () => {
    await Firm.deleteMany({})
    await api
      .post('/api/firms/add-firm')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRXZDgvRDRTT0JRckdnZU1tWEJHLjkuVEwuZGpqTmJObEFkbUJMcjNBOGVhMkVvbS5FTktEcSIsImlhdCI6MTY1NDkwMzk5OX0.ruF1UIUwIVtpBDBe1r06GFBdSXIgTGG1_nsDzDSwRpU')
      .send({
        name: 'First Barcelona',
        region1_name: 'barcelona',
        rating: 4,
        subscription_price_range_max: 70,
        subscription_price_range_min: 30
      })

      await api
      .post('/api/firms/add-firm')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRXZDgvRDRTT0JRckdnZU1tWEJHLjkuVEwuZGpqTmJObEFkbUJMcjNBOGVhMkVvbS5FTktEcSIsImlhdCI6MTY1NDkwMzk5OX0.ruF1UIUwIVtpBDBe1r06GFBdSXIgTGG1_nsDzDSwRpU')
      .send({
        name: 'Second Barcelona',
        region1_name: 'barcelona',
        rating: 3,
        subscription_price_range_max: 150,
        subscription_price_range_min: 60
      })

      await api
      .post('/api/firms/add-firm')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRXZDgvRDRTT0JRckdnZU1tWEJHLjkuVEwuZGpqTmJObEFkbUJMcjNBOGVhMkVvbS5FTktEcSIsImlhdCI6MTY1NDkwMzk5OX0.ruF1UIUwIVtpBDBe1r06GFBdSXIgTGG1_nsDzDSwRpU')
      .send({
        name: 'Third Barcelona',
        region1_name: 'barcelona',
        rating: 4,
        subscription_price_range_max: 150,
        subscription_price_range_min: 80
      })

      await api
      .post('/api/firms/add-firm')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRXZDgvRDRTT0JRckdnZU1tWEJHLjkuVEwuZGpqTmJObEFkbUJMcjNBOGVhMkVvbS5FTktEcSIsImlhdCI6MTY1NDkwMzk5OX0.ruF1UIUwIVtpBDBe1r06GFBdSXIgTGG1_nsDzDSwRpU')
      .send({
        name: 'First Madrid',
        region1_name: 'madrid',
        rating: 4,
        subscription_price_range_max: 70,
        subscription_price_range_min: 30
      })
  }, 100000)

  test('Firms router is running.', async () => {
    const res = await api
      .get('/api/firms/health')
      .expect(200)
    
    expect(res.text).toContain('OK')
  }, 100000)
  /****************************************************************************
   * User is able to add new firms.
   * When authentication fails response is a 401, message_code: 4012.
   * A repeated entry when a field should be unique returns 400 validation.
   ***************************************************************************/
  describe('User can add new firms.', () => {

    test('The new firm is saved into database', async () => {
      const res = await api
        .post('/api/firms/add-firm')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRXZDgvRDRTT0JRckdnZU1tWEJHLjkuVEwuZGpqTmJObEFkbUJMcjNBOGVhMkVvbS5FTktEcSIsImlhdCI6MTY1NDkwMzk5OX0.ruF1UIUwIVtpBDBe1r06GFBdSXIgTGG1_nsDzDSwRpU')
        .send({
          name: 'Demo Girona',
          region1_name: 'girona',
          rating: 4,
          subscription_price_range_max: 80,
          subscription_price_range_min: 30
        })
        expect(res.statusCode).toBe(201)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.name).toBe('Demo Girona')
        expect(res.body.region1_name).toBe('girona')
        expect(res.body.rating).toBe(4)
        expect(res.body.subscription_price_range_max).toBe(80)
        expect(res.body.subscription_price_range_min).toBe(30)
        expect(res.body.country).toBe('ES') // By default if not specified should be 'ES'
    }, 10000)

    test('Posting without token authentication returns 401 documented error.', async () => {
      const res = await api
        .post('/api/entries')
        .send({
          name: 'No Token',
          region1_name: 'girona',
          rating: 4,
          subscription_price_range_max: 80,
          subscription_price_range_min: 30
        })
        .expect('Content-Type', /application\/json/)
        .expect(401)
        expect(res.body.name).not.toBe('Demo Girona')
        expect(res.body.region1_name).not.toBe('girona')
        expect(res.body.rating).not.toBe(4)
        expect(res.body.subscription_price_range_max).not.toBe(80)
        expect(res.body.subscription_price_range_min).not.toBe(30)
        expect(res.body.country).not.toBe('ES') // By default if not specified should be 'ES'
      
      expect(res.body.message_code).toBe(4012)
      expect(res.body.message_text).toBe('Token is invalid or has expired')
    }, 10000)

    test('If user doesn\'t exist returns a documented response and don\'t save the firm', async () => {
      const res = await api
        .post('/api/entries')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRvbnlzYXBhOTBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkMHpydXJkWS5DeGdHNkxwOW0uSDJLdUNNQW95WWVxTnFvVmkxODU5VWJRYUpJTHFnL1Bod3kiLCJpYXQiOjE2NDc1MTUwODN9.U0KZVH8VA9ZCxXBcLuVrCbdDrWxhYp49RPAvVD-DRXc')
        .send({
          name: 'No User',
          region1_name: 'girona',
          rating: 4,
          subscription_price_range_max: 80,
          subscription_price_range_min: 30
        })
        .expect('Content-Type', /application\/json/)
        .expect(401)

      expect(res.body.name).not.toBe('Demo Girona')
      expect(res.body.region1_name).not.toBe('girona')
      expect(res.body.rating).not.toBe(4)
      expect(res.body.subscription_price_range_max).not.toBe(80)
      expect(res.body.subscription_price_range_min).not.toBe(30)
      expect(res.body.country).not.toBe('ES') // By default if not specified should be 'ES'
      expect(res.body.message_code).toBe(4012)
      expect(res.body.message_text).toBe('Token is invalid or has expired')
    }, 10000)

    /* test('When posting entry with repeated fields that should be unique returns 409 with validation error.', async () => {
      await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)

      const userDoesnExist = await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(409)

      expect(userDoesnExist.body.message_code).toBe(4092)
      expect(userDoesnExist.body.message_text).toBe('Entry validation failed: field1: Error, expected `field1` to be unique. Value: `Hello World`')
    }, 10000) */
  })

  describe('Logged out visitors can search firms', () => {

    test('Search without pagination specification fails.', async () => {
      const res = await api
        .get('/api/firms/all')
      
      expect(res.statusCode).toBe(400)
      expect(res.body.message_code).toBe(4001)
      expect(res.body.message_text).toBe('No se ha especificado parametro "from" para pagination.')
      expect(res.body.dev_tip).toBe('Make sure the url includes param ":from" used as first parameter to slice results')
    }, 10000)

    test('Firms can be searched and filtered by location', async () => {
      const res = await api
        .get('/api/firms/all/0/barcelona')
      
      expect(res.statusCode).toBe(200)
      expect(res.body.firms[0].name).toContain('Barcelona')
      expect(res.body.firms[0].region1_name).toBe('barcelona')
      expect(res.body.firms[1].name).toContain('Barcelona')
      expect(res.body.firms[1].region1_name).toBe('barcelona')
      expect(res.body.firms[2].name).toContain('Barcelona')
      expect(res.body.firms[2].region1_name).toBe('barcelona')
      expect(res.body.firms[3]).toBeUndefined()
      expect(res.body.length).toBe(3)
    }, 10000)

    test('Firms can be searched and filtered by average rating of reviews', async () => {
      const res = await api
        .get('/api/firms/all/0/barcelona/4/null')
      
      expect(res.statusCode).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.firms[0].name).toBe('Third Barcelona') // Is the one with greater "subscription_price_range_max" value, should go first.
      expect(res.body.firms[0].rating).toBeGreaterThanOrEqual(4)
      expect(res.body.firms[1].name).toBe('First Barcelona')
      expect(res.body.firms[1].rating).toBeGreaterThanOrEqual(4)
      expect(res.body.firms[2]).toBeUndefined()
    }, 10000)

    test('Firms can be searched and filtered by price', async () => {
      const res = await api
        .get('/api/firms/all/0/barcelona/null/0-60')
      
      expect(res.statusCode).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.firms[0].name).toBe('Second Barcelona') // Is the one with greater "subscription_price_range_max" value, should go first.
      expect(res.body.firms[0].subscription_price_range_min).toBeGreaterThanOrEqual(0)
      expect(res.body.firms[0].subscription_price_range_max).toBeGreaterThanOrEqual(60)
      expect(res.body.firms[1].name).toBe('First Barcelona')
      expect(res.body.firms[0].subscription_price_range_min).toBeGreaterThanOrEqual(0)
      expect(res.body.firms[0].subscription_price_range_max).toBeGreaterThanOrEqual(60)
      expect(res.body.firms[2]).toBeUndefined()
    }, 10000)

    test('Firms can be searched and filtered by several combined filters', async () => {
      const res = await api
        .get('/api/firms/all/0/barcelona/4/30-70')
      
      expect(res.statusCode).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body.firms[0].name).toBe('First Barcelona')
      expect(res.body.firms[0].rating).toBeGreaterThanOrEqual(4)
      expect(res.body.firms[0].subscription_price_range_min).toBeGreaterThanOrEqual(30)
      expect(res.body.firms[0].subscription_price_range_max).toBeGreaterThanOrEqual(70)
      expect(res.body.firms[1]).toBeUndefined()
    }, 10000)

    test('A documented error response will be given for searches with no matches', async () => {
      const res = await api
        .get('/api/firms/all/0/barcelona/5/1-2')

      expect(res.statusCode).toBe(404)
      expect(res.body.message_code).toBe(4041)
      expect(res.body.message_text).toBe('No existen gestor??as con estos par??metros.')
      expect(res.body.dev_tip).toBe('Intenta de nuevo con menos filtros')
    })

  })
})

afterAll(async() => {
  await Firm.deleteMany({})
  void mongoose.connection.close()
})
