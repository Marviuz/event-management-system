import Vuex from 'vuex'

export default () => {
  return new Vuex.Store({
    state: {
      eventPage: false,
      sidebarExpanded: true,
      subevent: {
        value: false,
        route: null
      }
    }
  })
}
