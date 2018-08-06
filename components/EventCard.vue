<template>
  <v-card :to="link" ripple>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ title }}</h3>
        <v-chip v-for="(date, i) in JSON.parse(dates)" :key="i">{{ date }}</v-chip>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: [
    'link',
    'title',
    'dates'
  ]
}
</script>
