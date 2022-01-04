<template>
  <table style="width:100%">
            <tr>
                <th>Date</th>
                <th>Users:</th>
                <th>View</th>
                <th>Delete</th>
            </tr>
            <tr v-for="(value) of props.entries.values" :key= "value.rowid">
                <td>{{value.date_created}}</td>
                <td>{{value.users}}</td>
                <td> <ion-button @click="viewScores(value.collusion_scores)" color="success">View</ion-button></td>
                <td><ion-button @click="delRowId(value.rowid)" color="danger">Delete</ion-button> </td>
              </tr>
              </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonButton} from "@ionic/vue";

export default defineComponent({
  name: "SearchTableColScore",
    components: {
        IonButton
    },
  props: {
    entries: {
      required: true,
      type: Object
    },
    viewScores: {
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
