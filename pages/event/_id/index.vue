<template>
  <v-container grid-list-lg>
    <v-switch @change="updateEvent" v-model="updateMode" label="Edit Mode"></v-switch>
    <event-form
      :data="event"
      :title="`Update ${event.eventname}`"
      save-type="update" v-if="updateMode"
    ></event-form>

    <v-layout row wrap v-if="!updateMode">
      <v-flex xs12 class="display-4">{{ event.eventname }}</v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6>Event ID</v-flex>
      <v-flex xs6>{{ event.idevents }}</v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6>Event Date/s</v-flex>
      <v-flex xs6>
        <v-chip v-for="(date, index) in JSON.parse(event.dates)" :key="index">{{ date }}</v-chip>
      </v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6>Event Venue/s</v-flex>
      <v-flex xs6>
        <v-chip v-for="(venue, index) in JSON.parse(event.venue)" :key="index">{{ venue }}</v-chip>
      </v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6>Event Organizer/s</v-flex>
      <v-flex xs6>
        <v-chip v-for="(org, index) in JSON.parse(event.managedBy)" :key="index">{{ org }}</v-chip>
      </v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6>Tag/s</v-flex>
      <v-flex xs6>
        <v-chip v-for="(tag, index) in event.tags" :key="index">{{ tag }}</v-chip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

import EventForm from '@/components/EventForm'

export default {
  components: {
    EventForm
  },
  async asyncData () {
    return {
      event: {
        eventname: null,
        idevents: null,
        dates: '[]',
        venue: '[]',
        managedBy: '[]',
        tags: []
      },
      updateMode: false
    }
  },
  async created () {
    await axios.get(`/api/event?eventId=${this.$route.params.id}`)
      .then(res => {
        this.event.eventname = res.data[0].eventname
        this.event.idevents = res.data[0].idevents
        this.event.dates = res.data[0].dates
        this.event.venue = res.data[0].venue
        this.event.managedBy = res.data[0].managedBy
        res.data.forEach(tag => {
          this.event.tags.push(tag.tagname)
        })

        if (!!res.data[0].parent) {
          this.$store.state.subevent.value = true
          this.$store.state.subevent.route = res.data[0].parent
        } else {
          this.$store.state.subevent.value = false
        }
      })
  },
  mounted () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = true
  },
  methods: {
    async updateEvent () {
      await axios.get(`/api/event?eventId=${this.$route.params.id}`)
        .then(res => {
          let tags = []

          this.event.eventname = res.data[0].eventname
          this.event.idevents = res.data[0].idevents
          this.event.dates = res.data[0].dates
          this.event.venue = res.data[0].venue
          this.event.managedBy = res.data[0].managedBy
          res.data.forEach(tag => {
            tags.push(tag.tagname)
          })
          this.event.tags = tags
        })
    }
  }
}
</script>