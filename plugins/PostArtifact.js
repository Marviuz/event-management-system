import axios from 'axios'

export default {
  save (data) {
    return axios.post('/api/artifact/save', data)
  },
  deleteArtifact (data) {
    return axios.post('/api/artifact/delete', data)
  }
}