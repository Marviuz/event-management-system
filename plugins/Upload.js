import axios from 'axios'

export default {
  upload (data) {
    return axios.post('/api/upload', data)
  }
}