<template>
  <v-card>
    <v-card-title class="mt-8">
      <p class="ml-3">{{ title }}</p>
    </v-card-title>
    <v-card-text>
      <div class="font-weight-bold ml-8 mb-2" v-if="latestEntries.length != 0">Coming Up Today</div>

      <v-timeline align-top dense>
        <v-timeline-item v-for="(item, key) in latestEntries.slice(0,3)" :key="key" color="blue" small>
          <div>
            <div class="font-weight-normal"><strong>{{ item.activity }}</strong> @{{ item.time_range }}</div>
            <!-- <div>Message</div> -->
          </div>
        </v-timeline-item>
        <v-timeline-item v-if="latestEntries.length == 0">
          <div class="font-weight-normal">
            No activities coming up.
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-card-actions>
      <v-btn depressed px-2 color="primary" link :to="'/view-table/' + table_id">View Table</v-btn>
      <v-spacer></v-spacer>
      <v-btn depressed px-2 color="error" @click="deleteTable(table_id)">Delete Table</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getAPI } from '../axios-api'

export default {
  props: {
    title: String,
    table_id: Number,
  },
  data() {
    return {
      latestEntries: [],
    }
  },
  methods: {
    deleteTable(table_id) {
      getAPI.delete(`/timetable/${table_id}`, {
        headers: {
          'Authorization' :  `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        console.log(response)

        // Destroy component, and remove from DOM.
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
        this.$store.commit('updateSnackbar', {show : true, message: "Table deleted."})
      })
      .catch(error => console.log(error))
    },
    getLatestItems() {
      getAPI.get(`/timetable/${this.table_id}`, {
        headers: {
          'Authorization' :  `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        let entries = response.data.entries
        for (let i of entries) {
          if (i.day === this.currentDay) {
            for (let j of i.items) {
              let time = new Date(`1980-01-01 ${j.time_range}`)
              if (time >= this.currentTime) {
                // Change to greater than.
                this.latestEntries.push(j)
              }
            }
          }
        }
      })
      .catch(error => console.log(error))
    }
  },
  computed: {
    currentDay() {
      let now = new Date()
      return now.toLocaleDateString("en-GB", {weekday: "long"})
    },
    currentTime() {
      let today = new Date().toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })
      return new Date(`1980-01-01 ${today}`)
    }
  },
  mounted() {
    this.getLatestItems()
  }
};
</script>