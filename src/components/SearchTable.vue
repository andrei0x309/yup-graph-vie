<template>
  <table style="width:100%">
            <tr>
                <th>Date</th>
                <th>User</th>
                <th>Col. Score</th>
                <th>No. posts</th>
                <th>No. links</th>
                <th>Load</th>
                <th>Delete</th>
            </tr>
            <tr v-for="(value) of props.entries.values" :key= "value.rowid">
                <td>{{value.date_created}}</td>
                <td>{{value.user}}</td>
                <td>{{value.collusion_score}}</td>
                <td>{{value.no_user_posts}}</td>
                <td>{{value.no_user_analytics_links}}</td>
                <td> <ion-button @click="loadGraph(value.rowid)" color="success">Load</ion-button></td>
                <td><ion-button @click="delRowId(value.rowid)" color="danger">Delete</ion-button> </td>
              </tr>
              </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonButton} from "@ionic/vue";

export default defineComponent({
  name: "SearchTable",
    components: {
        IonButton
    },
  props: {
    entries: {
      required: true,
      type: Object
    },
    loadGraph: {
      required: true,
      type: Function
    },
    delRowId: {
      required: true,
      type: Function
    },
  },
  setup(props) {

    return {
      props
    };
  },
});
</script>

<style lang="scss"></style>
