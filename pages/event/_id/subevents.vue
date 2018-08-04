<template>
  <v-container grid-list-md>

    <v-layout row align-center>
      <div class="display-1">Subevents</div>
      <v-btn
        color="red white--text"
        fab
        @click.native="dialog = true"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs4 v-for="(subevent, index) in subevents" :key="index">
        <event-card :link="`/event/${subevent.idevents}`" :title="subevent.eventname"></event-card>
      </v-flex>
    </v-layout>
    
    <v-dialog
      v-model="dialog"
      max-width="50vw"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <event-form
            title="Add subevent"
            :data="event"
            save-type="subevent"
          ></event-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import EventForm from '@/components/EventForm'
import EventCard from '@/components/EventCard'

export default {
  components: {
    EventForm,
    EventCard
  },
  data () {
    return {
      dialog: false,
      subevents: [],
      event: {
        eventname: null,
        idevents: this.$route.params.id,
        dates: '[]',
        venue: '[]',
        managedBy: '[]',
        tags: []
      }
    }
  },
  methods: {
    async closeDialog () {
      await axios.get(`/api/subevents?id=${this.$route.params.id}`)
        .then(res => {
          this.subevents = res.data
          this.dialog = false
        })
    }
  },
  async created () {
    await axios.get(`/api/subevents?id=${this.$route.params.id}`)
      .then(res => this.subevents = res.data)
  },
  mounted () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = true
  }
}
</script>
