import axios from 'axios'

export default {
  save (data) {
    return axios.post('/api/save', data)
  },
  update (data) {
    return axios.post('/api/update', data)
  },
  saveSubevent (data) {
    return axios.post('/api/new/subevent', data)
  }
}