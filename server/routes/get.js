const { Router } = require('express')
const db = require('./db')

const router = Router()

router.get('/api/events', (req, res) => {
  db.query({
    sql: 'SELECT * FROM events',
    msg: '/api/events',
    chain: data => {
      return res.json(data)
    }
  })
})

router.get('/api/event', (req, res) => {
  db.query({
    sql: 'SELECT * FROM events NATURAL JOIN tag_of_events NATURAL JOIN tags WHERE idevents=?',
    options: [req.query.eventId],
    msg: '/api/event',
    chain: data => {
      return res.json(data)
    }
  })
})

router.get('/api/tags', (req, res) => {
  db.query({
    sql: 'SELECT * FROM tags',
    msg: '/api/tags',
    chain: data => {
      return res.json(data)
    }
  })
})

router.get('/api/subevents', (req, res) => {
  db.query({
    sql: 'SELECT * FROM events WHERE parent=?',
    options: [req.query.id],
    msg: '/api/subevents',
    chain: data => {
      return res.json(data)
    }
  })
})

router.get('/api/event/artifacts', (req, res) => {
  db.query({
    sql: 'SELECT * FROM fields INNER JOIN elements ON idfield=fieldid INNER JOIN events ON eventid=idevents WHERE idevents=?',
    options: [req.query.id],
    msg: '/api/event/artifacts',
    chain: data => {
      return res.json(data)
    }
  })
})

router.get('/api/event/gallery', (req, res) => {
  db.query({
    sql: 'SELECT * FROM gallery WHERE eventID=?',
    options: [req.query.id],
    msg: '/api/event/gallery',
    chain: data => {
      return res.json(data)
    }
  })
})

module.exports = router