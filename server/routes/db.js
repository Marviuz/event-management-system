const mysql = require('mysql')

const host = 'localhost'
const user = 'root'
const password = ''
const database = 'eventsmanagement'

const con = mysql.createConnection({
  host,
  user,
  password,
  database
})

con.connect(err => {
  if (err) {
    console.log('Database connection error')
    throw err
  }
  console.log('Database connection successful')
})

module.exports = {
  /**
   * @param {object} data
   * @return {object} setting and chaining
   */
  query: data => {
    con.query(data.sql, data.options||[], (err, rows) => {
      if (err) {
        console.log(`${data.msg} query error`)
        throw err
      }
      console.log(`${data.msg} query successful`)
      if (typeof data.chain === 'function') {
        data.chain(rows)
      }
    })
  }
}
