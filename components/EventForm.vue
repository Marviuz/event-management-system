<template>
  <v-container grid-list-xl elevation-1>
    <div class="display-1">{{ title||'Add Event' }}</div>
    <v-layout row wrap>
      <!-- event name -->
      <v-flex xs6>
        <v-tooltip top>
          <v-text-field
            slot="activator"
            label="Event Name"
            v-model="event.name"
            clearable
            prepend-icon="event"
          ></v-text-field>
          <span>This Field is required</span>
        </v-tooltip>
      </v-flex>

      <!-- organizer -->
      <v-flex xs6>
        <v-tooltip top>
          <v-combobox
            slot="activator"
            label="Organizer/s"
            v-model="event.organizer"
            multiple
            chips
            clearable
            prepend-icon="people"
            append-icon=""
          >
            <template
              slot="selection"
              slot-scope="{ item, parent }"
            >
              <v-chip>
                <span class="pr-2">{{ item }}</span>
                <v-icon @click="parent.selectItem(item)">close</v-icon>
              </v-chip>
            </template>
          </v-combobox>
          <span>This Field is required</span>
        </v-tooltip>
      </v-flex>

      <!-- venue -->
      <v-flex xs6>
        <v-tooltip top>
          <v-combobox
            slot="activator"
            label="Venue/s"
            v-model="event.venue"
            multiple
            chips
            clearable
            prepend-icon="place"
            append-icon=""
          >
            <template
              slot="selection"
              slot-scope="{ item, parent }"
            >
              <v-chip>
                <span class="pr-2">{{ item }}</span>
                <v-icon @click="parent.selectItem(item)">close</v-icon>
              </v-chip>
            </template>
          </v-combobox>
          <span>This Field is required</span>
        </v-tooltip>
      </v-flex>

      <!-- tags -->
      <v-flex xs6>
        <v-tooltip top>
          <v-combobox
            :items="tags"
            slot="activator"
            label="Tag/s"
            v-model="event.tags"
            multiple
            chips
            clearable
            prepend-icon="label"
          >
            <template
              slot="selection"
              slot-scope="{ item, parent }"
            >
              <v-chip>
                <span class="pr-2">{{ item }}</span>
                <v-icon @click="parent.selectItem(item)">close</v-icon>
              </v-chip>
            </template>
          </v-combobox>
          <span>This Field is required</span>
        </v-tooltip>
      </v-flex>

      <!-- dates -->
      <v-flex xs6>
        <v-date-picker
          full-width
          no-title
          v-model="date"
          @input="addDate"
        ></v-date-picker>
      </v-flex>

      <v-flex xs6>
        <!-- <v-tooltip top> -->
          <v-combobox
            slot="activator"
            label="Date/s"
            v-model="event.dates"
            multiple
            chips
            readonly
            clearable
            prepend-icon="date_range"
            append-icon=""
          >
            <template
              slot="selection"
              slot-scope="{ item, parent }"
            >
              <v-chip>
                <span class="pr-2">{{ item }}</span>
                <v-icon @click="parent.selectItem(item)">close</v-icon>
              </v-chip>
            </template>
          </v-combobox>
          <!-- <span>Press backspace to remove dates</span>
        </v-tooltip> -->

        <v-btn
          @click="save"
          color="blue white--text"
        >
          <v-icon left>save</v-icon>
          <span>save</span>
        </v-btn>
      </v-flex>

      <!-- {{ JSON.stringify(data) }} -->
      <!-- {{ JSON.stringify(event) }} -->

    </v-layout>

    <v-dialog
      v-model="saving"
      persistent
      width="300"
    >
      <v-card>
        <v-card-text>
          Please wait...
          <v-progress-linear
            indeterminate
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import event from '@/plugins/PostEvent'

export default {
  props: ['title', 'save-type', 'data'],
  data () {
    return {
      event: {
        name: this.data.eventname,
        organizer: JSON.parse(this.data.managedBy),
        venue: JSON.parse(this.data.venue),
        tags: this.data.tags,
        dates: JSON.parse(this.data.dates)
      },
      tags: [],
      date: null,
      saving: false
    }
  },
  async created () {
    await axios.get('/api/tags')
      .then(res => {
        res.data.forEach(tag => {
          this.tags.push(tag.tagname)
        })
      })
  },
  methods: {
    addDate () {
      const checkDate = this.event.dates.filter(date => date === this.date)
      if (!!!checkDate.length) {
        this.event.dates.push(this.date)
      }
    },
    async save () {
      this.saving = !this.saving
      if (this.saveType === 'new') {
        await event.save(this.event)
          .then(res => this.saving = !this.saving)
      } else if (this.saveType === 'subevent') {
        this.event.id = this.data.idevents
        await event.saveSubevent(this.event)
          .then(res => this.saving = !this.saving)
      } else {
        this.event.id = this.data.idevents
        await event.update(this.event)
          .then(res => this.saving = !this.saving)
      }
    }
  }
}
</script>
