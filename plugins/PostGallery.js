import axios from 'axios'

export default {
  save (data) {
    return axios.post('/api/gallery/save', data)
  },
  saveAlbum (data) {
    return axios.post('/api/gallery/album', data)
  }
}