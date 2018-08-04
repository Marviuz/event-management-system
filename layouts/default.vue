<template>
  <v-app :dark="dark">
    <v-toolbar app>
      <v-list-tile-title v-if="!$store.state.sidebarExpanded" class="title">SLU Events</v-list-tile-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/"><v-icon left>home</v-icon>home</v-btn>
        <v-btn flat to="/event/new"><v-icon left>add</v-icon>add event</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer
      v-if="$store.state.sidebarExpanded"
      permanent
      app
    >
      <v-toolbar>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="title">SLU Events</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" v-if="$store.state.eventPage">
        <v-list-tile :to="`/event/${$route.params.id}`" exact>
          <v-list-tile-content>
            <v-list-tile-title>Overview</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="$store.state.subevent.value" :to="`/event/${$store.state.subevent.route}`" exact>
          <v-list-tile-content>
            <v-list-tile-title>Main event</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="`/event/${$route.params.id}/subevents`">
        <v-list-tile-content>
          <v-list-tile-title>Sub-events</v-list-tile-title>
        </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="`/event/${$route.params.id}/artifacts`">
          <v-list-tile-content>
            <v-list-tile-title>Artifacts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="`/event/${$route.params.id}/gallery`">
          <v-list-tile-content>
            <v-list-tile-title>Gallery</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-container v-else-if="!$store.state.eventPage">
        <v-date-picker
          v-if="type !== 'year'"
          :type="type"
          v-model="date"
          no-title
          full-width
        ></v-date-picker>
        <!-- <v-select
          @change.native="date = null"
          v-if="type === 'year'"
          :items="years"
          v-model="date"
          cache-items
        ></v-select> -->

        <div class="title">Filter Event by:</div>

        <v-radio-group v-model="type">
          <v-radio label="Date" value="date"></v-radio>
          <v-radio label="month" value="month"></v-radio>
          <!-- <v-radio label="Year" value="year"></v-radio> -->
        </v-radio-group>
        {{date}}
      </v-container>
    </v-navigation-drawer>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
// import moment from 'moment'

export default {
  data () {
    return {
      date: null,
      type: 'date',
      dark: false
      // years: null
    }
  },
  // created () {
  //   const start = moment().format('YYYY') - 100
  //   const end = moment().format('YYYY') - 100 + 200
  //   let years = []
  //   for (let i = start; i <= end; i++) {
  //     years.push(i)
  //   }
  //   this.years = years
  // }
}
</script>