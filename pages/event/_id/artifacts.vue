<template>
  <v-container grid-list-md>
    <div class="display-1">Artifacts</div>
    <v-card class="mb-2">
      <v-card-title>
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              label="Field name"
              v-model="field.name"
            ></v-text-field>
            <v-text-field
              label="Field description"
              v-model="field.description"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text v-if="field.files">
        <v-list>
          <v-list-tile v-for="(file, index) in field.files" :key="index">
            <v-list-tile-content>
              <v-list-tile-title>{{ file }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="purple white--text" @click="selectFiles">
          <v-icon left>attach_file</v-icon>
          <span>attach file/s</span>
        </v-btn>
        <input type="file" style="display: none;" ref="fileInput" multiple @change="onFileSelect">
        <v-spacer></v-spacer>
        <v-btn depressed color="blue white--text" @click="save" :disabled="!field.name">
          <v-icon left>save</v-icon>
          <span>save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <v-card class="mb-2" v-for="artifact in artifacts" :key="artifact.elementId">
      <v-card-title>
        <div>
          <h3 class="headline mb-0">{{ artifact.fieldname }}</h3>
          <div v-if="!!artifact.text">{{ artifact.text }}</div>
        </div>
      </v-card-title>
      
      <v-list v-if="!!JSON.parse(artifact.file).length">
        <v-divider></v-divider>
        <div v-for="(file, index) in JSON.parse(artifact.file)" :key="index">
          <v-list-tile avatar>
            <v-list-tile-avatar color="grey lighten-2">
              <v-icon v-if="'bmp jpg jpeg png gif webp'.indexOf(file.split('.').pop().toLowerCase())">image</v-icon>
              <v-icon v-else>file_copy</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ file }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </div>
      </v-list>
    </v-card>
    
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment' 
import artifact from '@/plugins/PostArtifact'
import file from '@/plugins/Upload'

export default {
  data () {
    return {
      artifacts: [],
      field: {
        name: null,
        description: null,
        files: []
      },
      formData: null
    }
  },
  created () {
    this.getArtifacts ()
  },
  mounted () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = true
  },
  methods: {
    async getArtifacts () {
      await axios.get(`/api/event/artifacts?id=${this.$route.params.id}`)
        .then(res => this.artifacts = res.data)
    },
    selectFiles () {
      this.$refs.fileInput.click ()
    },
    onFileSelect (evt) {
      const formData = new FormData ()
      const files = evt.target.files

      let filenames = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filename = `${this.$route.params.id}-${moment().format('YYYY-DD-MM_hh-mm-ssa')}-${file.name}`

        formData.append('upload[]', file, filename)
        filenames.push(filename)
      }
      this.field.files = filenames
      this.formData = formData
    },
    async save () {
      this.field.id = this.$route.params.id
      await artifact.save(this.field)
      if (!!this.field.files.length) {
        await file.upload(this.formData)
      }
      this.field = {
        name: null,
        description: null,
        files: []
      }
      this.getArtifacts ()
    }
  }
}
</script>
