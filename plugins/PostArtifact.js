import axios from 'axios'

export default {
  save (data) {
    return axios.post('/api/artifact/save', data)
  }
}