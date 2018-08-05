<template>
  <v-container grid-list-md>
    <div class="display-1">Artifacts</div>
    <v-card class="mb-2">
      <v-card-title>
        <v-layout row>
          <v-flex xs12>
            <v-combobox
              label="Field name"
              v-model="field.name"
              :items="fields"
            ></v-combobox>
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
    
    <v-card class="mb-2" v-for="artifact in artifacts" :key="artifact.elementID">
      <v-card-title>
        <div>
          <h3 class="headline mb-0">{{ artifact.fieldname }}</h3>
          <p class="body-1" v-if="!!artifact.text">{{ artifact.text }}</p>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <v-btn slot="activator" fab flat small color="blue" @click="updateArtifact(artifact)">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Edit this field</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn slot="activator" fab flat small color="red" @click="deleteArtifact(artifact.elementID)">
            <v-icon>close</v-icon>
          </v-btn>
          <span>Delete this field</span>
        </v-tooltip>
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
    
    <v-layout row justify-center>
      <v-dialog v-model="updateArtifactField.value" persistent max-width="75%">
        <v-card>
          <v-card-title>
            <v-layout row>
              <v-flex xs12>
                <v-combobox
                  label="Field name"
                  v-model="updateArtifactField.name"
                  :items="fields"
                ></v-combobox>
                <v-text-field
                  label="Field description"
                  v-model="updateArtifactField.description"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text v-if="updateArtifactField.files">
            <v-list>
              <v-list-tile v-for="(file, index) in updateArtifactField.files" :key="index">
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
            <v-btn depressed color="red white--text" @click="updateArtifactField.value = false">
              <v-icon left>save</v-icon>
              <span>cancel</span>
            </v-btn>
            <v-btn depressed color="blue white--text" @click="updateArtifactById" :disabled="buttonDisabler">
              <v-icon left>save</v-icon>
              <span>save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

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
      prevFieldname: null,
      updateArtifactField: {
        value: false,
        name: null,
        description: null,
        files: []
      },
      artifacts: [],
      fields: [],
      field: {
        name: null,
        description: null,
        files: []
      },
      formData: null
    }
  },
  created () {
    this.getFields ()
    this.getArtifacts ()
  },
  mounted () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = true
  },
  computed: {
    buttonDisabler () {
      return this.prevFieldname == this.updateArtifactField.name
    }
  },
  methods: {
    async getFields () {
      let fields = []
      axios.get('/api/artifacts')
        .then(res => {
          res.data.map((field, i) => fields.push(field.fieldname))
          this.fields = fields
        })
    },
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
    },
    async deleteArtifact (id) {
      await artifact.deleteArtifact({
        elmId: id,
        id: this.$route.params.id
      })
        .then(res => this.artifacts = res.data)
    },
    updateArtifact (artifact) {
      this.prevFieldname = artifact.fieldname
      this.updateArtifactField = {
        fieldId: artifact.fieldID,
        elementId: artifact.elementID,
        eventId: artifact.eventID,
        value: true,
        name: artifact.fieldname,
        description: artifact.text,
        files: JSON.parse(artifact.file)
      }
    },
    updateArtifactById () {
      artifact.updateArtifact (this.updateArtifactField)
        .then(res => {
          this.artifacts = res.data
          this.updateArtifactField.value = false
          this.getFields ()
        })
    }
  }
}
</script>
