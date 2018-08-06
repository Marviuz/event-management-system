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
        
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="date"
            label="Something"
            prepend-icon="event"
            readonly
          ></v-text-field>

          <v-date-picker
            :type="type"
            v-model="date"
            no-title
          >
            <v-radio-group v-model="type" row>
              <v-radio label="Date" value="date"></v-radio>
              <v-radio label="month" value="month"></v-radio>
            </v-radio-group>
          </v-date-picker>
        </v-menu>

      </v-container>
    </v-navigation-drawer>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      date: null,
      type: 'date',
      dark: false,
      menu: false
    }
  },
}
</script>