const { Router } = require('express')
const bodyParser = require('body-parser')
const formidable = require('formidable')

const db = require('./db')

const router = Router()

router.use(bodyParser.json())

router.post('/api/save', (req, res) => {
  // insert event to db
  db.query({
    sql: 'INSERT INTO events (eventname, dates, venue, managedBy) VALUES (?, ?, ?, ?)',
    options: [
      req.body.name,
      JSON.stringify(req.body.dates),
      JSON.stringify(req.body.venue),
      JSON.stringify(req.body.organizer)
    ],
    msg: '/api/save',
    chain: () => {
      // loop tags inputed by user
      for (let i = 0; i < req.body.tags.length; i++) {
        const tag = req.body.tags[i];
        db.query({
          sql: 'INSERT IGNORE INTO tags(tagname) VALUES (?)', // ignore tagname currently in db
          options: [tag],
          msg: '/api/save tag insert',
          chain: () => {
            // get current tag's id
            db.query({
              sql: 'SELECT * FROM tags WHERE tagname = ?',
              options: [tag],
              msg: '/api/save select tags',
              chain: tgidData => {
                // get newly created event's id
                db.query({
                  sql: 'SELECT idevents FROM events ORDER BY 1 DESC LIMIT 1',
                  msg: '/api/save select idevent',
                  chain: (eventidData) => {
                    // insert current tag id and newly created event id to db
                    db.query({
                      sql: 'INSERT INTO tag_of_events (idevents, tagID) VALUES (?, ?)',
                      options: [eventidData[0].idevents, tgidData[0].tagID],
                      msg: '/api/save tag_of_events insert',
                      chain: () => {
                        if (i === (req.body.tags.length - 1)) {
                          console.log('/api/save done!')
                          return res.json({done: true})
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
})

router.post('/api/update', (req, res) => {
  // update event
  db.query({
    sql: 'UPDATE events SET eventname=?, dates=?, venue=?, managedBy=? WHERE idevents=?',
    options: [
      req.body.name,
      JSON.stringify(req.body.dates),
      JSON.stringify(req.body.venue),
      JSON.stringify(req.body.organizer),
      req.body.id
    ],
    msg: '/api/update',
    chain: () => {
      db.query({
        sql: 'DELETE FROM tag_of_events WHERE idevents=?',
        options: [req.body.id],
        msg: '/api/update delete from tag_of_events',
        chain: () => {
          for (let i = 0; i < req.body.tags.length; i++) {
            const tag = req.body.tags[i];
            db.query({
              sql: 'INSERT IGNORE INTO tags (tagname) VALUES (?)',
              options: [tag],
              msg: '/api/update insert to tags',
              chain: () => {
                db.query({
                  sql: 'SELECT * FROM tags WHERE tagname=?',
                  options: [tag],
                  msg: '/api/update insert select tags',
                  chain: tagname => {
                    db.query({
                      sql: 'INSERT INTO tag_of_events (idevents, tagID) VALUES (?, ?)',
                      options: [req.body.id, tagname[0].tagID],
                      msg: '/api/update insert to tag_of_events',
                      chain: () => {
                        if (i === (req.body.tags.length - 1)) {
                          console.log('/api/update done!')
                          return res.json({done: true})
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  })
})

router.post('/api/new/subevent', (req, res) => {
  db.query({
    sql: 'INSERT INTO events (eventname, dates, venue, managedBy, parent) VALUES (?, ?, ?, ?, ?)',
    options: [
      req.body.name,
      JSON.stringify(req.body.dates),
      JSON.stringify(req.body.venue),
      JSON.stringify(req.body.organizer),
      req.body.id
    ],
    msg: '/api/new/subevent insert events',
    chain: () => {
      for (let i = 0; i < req.body.tags.length; i++) {
        const tag = req.body.tags[i]
        // insert tag to db
        db.query({
          sql: 'INSERT IGNORE INTO tags(tagname) VALUES (?)', // ignore tagname currently in db
          options: [tag],
          msg: '/api/new/subevent tag insert',
          chain: () => {
            // get current tag's id
            db.query({
              sql: 'SELECT * FROM tags WHERE tagname = ?',
              options: [tag],
              msg: '/api/new/subevent select from tags failed',
              chain: tgidData => {
                // get newly created event's id
                db.query({
                  sql: 'SELECT idevents FROM events ORDER BY 1 DESC LIMIT 1',
                  msg: '/api/new/subevent select idevent single',
                  chain: eventidData => {
                    // insert current tag id and newly created event id to db
                    db.query({
                      sql: 'INSERT INTO tag_of_events (idevents, tagID) VALUES (?, ?)',
                      options: [eventidData[0].idevents, tgidData[0].tagID],
                      error: '/api/new/subevent tag_of_events insert failed',
                      success: '/api/new/subevent tag_of_events insert success',
                      chain: () => {
                        if (i === (req.body.tags.length - 1)) {
                          console.log('/api/new/subevent done!')
                          return res.json({done: true})
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
})

router.post('/api/artifact/save', (req, res) => {
  db.query({
    sql: 'INSERT IGNORE INTO fields (fieldname) VALUES (?)',
    options: [req.body.name],
    msg: '/api/artifact/save insert',
    chain: () => {
      db.query({
        sql: 'SELECT * FROM fields WHERE fieldname=?',
        options: [req.body.name],
        msg: '/api/artifact/save select where',
        chain: data => {
          db.query({
            sql: 'INSERT INTO elements (text, file, fieldID, eventID) VALUES (?, ?, ?, ?)',
            options: [req.body.description, JSON.stringify(req.body.files), data[0].idfield, req.body.id],
            msg: '/api/artifact/save insert elemets',
            chain: () => {
            	db.query({
                sql: 'SELECT * FROM fields INNER JOIN elements ON idfield=fieldid INNER JOIN events ON eventid=idevents WHERE idevents=?',
                options: [req.body.id],
                msg: '/api/artifact/save select',
                chain: rows => {
                  return res.json(rows)
                }
              })
            }
          })
        }
      })
    }
  })
})

router.post('/api/artifact/update', (req, res) => {
  db.query({
    sql: 'INSERT IGNORE INTO fields (fieldname) VALUES (?)',
    options: [req.body.name],
    msg: '/api/artifact/update INSERT',
    chain: () => {
      db.query({
        sql: 'SELECT * FROM fields WHERE fieldname=?',
        options: [req.body.name],
        msg: '/api/artifact/update SELECT',
        chain: field => {
          db.query({
            sql: 'UPDATE elements SET text=?, file=?, fieldID=?, eventID=? WHERE elementID=?',
            options: [
              req.body.description,
              JSON.stringify(req.body.files),
              field[0].idfield,
              req.body.eventId,
              req.body.elementId
            ],
            msg: '/api/artifact/update UPDATE',
            chain: () => {
              db.query({
                sql: 'SELECT * FROM fields INNER JOIN elements ON idfield=fieldid INNER JOIN events ON eventid=idevents WHERE idevents=?',
                options: [req.body.eventId],
                msg: '/api/artifact/update SELECT',
                chain: (rows) => {
                  return res.json(rows)
                }
              })
            }
          })
        }
      })
    }
  })
})

router.post('/api/artifact/delete', (req, res) => {
  db.query({
    sql: 'DELETE FROM elements WHERE elementId=?',
    options: [req.body.elmId],
    msg: '/api/artifact/delete',
    chain: data => {
      db.query({
        sql: 'SELECT * FROM fields INNER JOIN elements ON idfield=fieldid INNER JOIN events ON eventid=idevents WHERE idevents=?',
        options: [req.body.id],
        msg: '/api/event/artifacts',
        chain: data => {
          return res.json(data)
        }
      })
    }
  })
})

router.post('/api/gallery/save', (req, res) => {
  JSON.parse(req.body.pics).forEach(pic => {
    db.query({
      sql: 'INSERT INTO gallery (pictures, eventID) VALUES (?, ?)',
      options: [pic, req.body.id],
      msg: '/api/gallery/save'
    })
  })
})

router.post('/api/gallery/album', (req, res) => {
  JSON.parse(req.body.pics).forEach(pic => {
    db.query({
      sql: 'INSERT INTO gallery (pictures, eventID, albumname) VALUES (?, ?, ?)',
      options: [pic, req.body.id, req.body.album],
      msg: '/api/gallery/album'
    })
  })
})

router.post('/api/upload', (req, res) => {
  const form = new formidable.IncomingForm ()

  form.parse(req)
  form.multiples = true

  form.on('fileBegin', (name, file) => {
    file.path = 'static/uploads/' + file.name
  })

  form.on('file', (name, file) => {
    console.log(file.name, 'uploaded!')
  })
  return res.json({message: 'test'})
})

module.exports = router