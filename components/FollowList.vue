<template>
  <v-list>
    <v-row no-gutters>  
      <v-col v-for="user in users" :key="user.id" cols="12" md="4" style="display: inline-blick">
      <v-list-item>
        <v-list-item-avatar color="indigo">
          <span class="white--text headline">{{ user.nickname[0] }}</span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.nickname }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon @click="remove(user.id)">mdi-minus-circle-outline</v-icon> 
        </v-list-item-action>
      </v-list-item>
      </v-col>
    </v-row>
  </v-list>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
    remove: {
      type: Function,
      required: true,
    }
  }
}
</script>

<style>

</style>