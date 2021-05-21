<template>
  <div class="page">
    <div v-if="loading" class="loader"></div>
    <v-sheet min-height="70vh" rounded="lg" color="transparent" v-else>
      <h1 class="display-1 ml-2">My Timetables</h1>
      <v-container class="my-2" fluid>
        <v-row>
          <v-col lg="4" md="6" sm="12" v-for="(table, index) in tables" :key="index">
            <Card :title="table.title" :table_id="table.id" :fetchTables="fetchTables" />
          </v-col>

          <v-col v-if="tables.length == 0">
            <span>You haven't added any timetables.</span>
          </v-col>

          <v-col cols="12">
            <v-btn @click="showForm = !showForm">
              <v-icon left>mdi-plus</v-icon>
              Add Table
            </v-btn>
          </v-col>
        </v-row>

        <AddTable v-if="showForm" :fetchTables="fetchTables" />
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card.vue";
import AddTable from '@/components/AddTable.vue'
import { getAPI } from '../axios-api'


export default {
  name: "Home",
  data() {
    return {
      showForm: false,
      loading: false,
      tables: []
    }
  },
  components: {
    Card,
    AddTable
  },
  methods: {
    fetchTables() {
      this.loading = true;
        getAPI.get("/timetable/", {
        headers: {
        'Authorization' :  `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        this.tables = response.data
      })
      .catch(error => console.log(error))
      .finally(() => this.loading = false)
    }
  },
  created() {
    this.fetchTables()
  }
};
</script>

<style scoped>

.loader {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>