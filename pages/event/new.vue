<template>
  <v-container>
    <event-form :data="event" save-type="new"></event-form>
  </v-container>
</template>

<script>
import EventForm from '@/components/EventForm'

export default {
  components: {
    EventForm
  },
  data() {
    return {
      event: {
        eventname: null,
        idevents: null,
        dates: '[]',
        venue: '[]',
        managedBy: '[]',
        tags: []
      }
    }
  },
  mounted () {
    this.$store.state.sidebarExpanded = false
  }
}
</script>
