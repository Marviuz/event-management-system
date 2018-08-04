<template>
  <v-card :to="link" ripple>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ title }}</h3>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: [
    'link',
    'title'
  ]
}
</script>
