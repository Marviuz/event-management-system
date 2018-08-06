<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap>
      <v-flex xs3 v-for="({idevents, eventname, dates}, index) in events" :key="index">
        <EventCard
          :link="`/event/${idevents}`"
          :title="eventname"
          :dates="dates"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EventCard from '@/components/EventCard'
import axios from 'axios'

export default {
  components: {
    EventCard
  },
  async asyncData () {
    return {
      events: []
    }
  },
  async created () {
    this.$store.state.sidebarExpanded = true
    this.$store.state.eventPage = false
    await axios.get('/api/events')
      .then(res => this.events = res.data)
  }
}
</script>
