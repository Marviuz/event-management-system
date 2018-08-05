<template>
  <v-container grid-list-md>
    <div class="display-1">
      <span>Gallery</span>
      <v-tooltip top>
        <v-btn @click="pickImage" slot="activator" icon depressed color="red white--text">
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add image</span>
      </v-tooltip>
      <!-- Default -->
      <input type="file" ref="imageInput" style="display: none;" @change="imagePicked" multiple>
      <!-- Album -->
      <input type="file" ref="albumInput" style="display: none;" @change="albumPicked" multiple>
      <v-tooltip top>
        <v-btn @click="addAlbum" slot="activator" icon depressed color="red white--text">
          <v-icon>folder</v-icon>
        </v-btn>
        <span>Add an album/Add images to an album</span>
      </v-tooltip>
    </div>

    <v-expansion-panel>
      <v-expansion-panel-content v-for="(album, i) in albums" :key="i">
        <div slot="header">{{ album }}</div>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs2 v-for="(gallery, index) in items" :key="index">
                <v-card v-if="gallery.album === album">
                  <v-card-media
                    contain
                    height="100px"
                    :src="gallery.filename"
                  ></v-card-media>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Default dialog -->
    <v-dialog
      v-model="gallery.dialog"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          <span>Your about to upload these images:</span>
          <v-spacer></v-spacer>
          <v-btn @click="gallery.dialog = false" small icon>
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-list>
          <v-list-tile avatar v-for="(filename, i) in gallery.filenames" :key="i">
            <v-list-tile-avatar>
              <v-icon class="grey lighten-2">image</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ filename }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="upload"
          >upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Album dialog -->
    <v-dialog
      v-model="gallery.albumDiaog"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          <span>
            <v-combobox label="Album Name" v-model="gallery.albumName" :items="albums"></v-combobox>
          </span>
          <v-spacer></v-spacer>
          <v-btn @click="gallery.albumDiaog = false" small icon>
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-list>
          <v-list-tile avatar v-for="(filename, i) in gallery.filenames" :key="i">
            <v-list-tile-avatar>
              <v-icon class="grey lighten-2">image</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ filename }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="uploadAlbum"
            :disabled="!!!gallery.albumName"
          >upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import moment from 'moment'
import image from '@/plugins/Upload'
import gallery from '@/plugins/PostGallery'
import axios from 'axios'

export default {
  data () {
    return {
      items: [],
      albums: [],
      gallery: {
        formData: null,
        dialog: false,
        filenames: [],
        albumDiaog: false,
        albumName: null
      }
    }
  },
  mounted () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = true
    this.getGallery()
  },
  methods: {
    pickImage () {
      this.$refs.imageInput.click ()
    },
    imagePicked (evt) {
      this.gallery.formData = null
      this.gallery.filenames = []
      const formData = new FormData ()
      const files = evt.target.files

      let filenames = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if ('bmp jpg jpeg png gif webp'.indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
          const filename = `${this.$route.params.id}-${moment().format('YYYY-DD-MM_hh-mm-ssa')}-${file.name}`
  
          formData.append('upload[]', file, filename)
          filenames.push(filename)
        }
      }
      this.gallery.formData = formData
      this.gallery.filenames = filenames
      if (!!this.gallery.filenames.length) {
        this.gallery.dialog = true
      }
    },
    async upload () {
      gallery.save({
        pics: JSON.stringify(this.gallery.filenames),
        id: this.$route.params.id
      })

      if (!!this.gallery.filenames.length) {
        await image.upload(this.gallery.formData)
      }

      this.getGallery()
      this.gallery.dialog = false
    },
    async getGallery () {
      await axios.get(`/api/event/gallery?id=${this.$route.params.id}`)
        .then(res => {
          let filenames = []
          let albums = []

          res.data.map(gallery => {
            if (!albums.includes(gallery.albumname)) {
              albums.push(gallery.albumname)
            }
            filenames.push({
              filename: '/uploads/' + gallery.pictures,
              album: gallery.albumname
            })
          })
          this.items = filenames
          this.albums = albums
        })
    },
    addAlbum () {
      this.pickAlbum ()
    },
    pickAlbum () {
      this.$refs.albumInput.click ()
    },
    albumPicked (evt) {
      this.gallery.formData = null
      this.gallery.filenames = []
      const formData = new FormData ()
      const files = evt.target.files

      let filenames = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if ('bmp jpg jpeg png gif webp'.indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
          const filename = `${this.$route.params.id}-${moment().format('YYYY-DD-MM_hh-mm-ssa')}-${file.name}`
  
          formData.append('upload[]', file, filename)
          filenames.push(filename)
        }
      }
      this.gallery.formData = formData
      this.gallery.filenames = filenames
      if (!!this.gallery.filenames.length) {
        this.gallery.albumDiaog = true
      }
    },
    async uploadAlbum () {
      gallery.saveAlbum({
        pics: JSON.stringify(this.gallery.filenames),
        id: this.$route.params.id,
        album: this.gallery.albumName
      })

      if (!!this.gallery.filenames.length) {
        await image.upload(this.gallery.formData)
      }

      this.getGallery()
      this.gallery.albumDiaog = false
    }
  }
}
</script>
