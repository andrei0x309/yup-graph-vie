

 
<template>
  <ion-page :key="compId" style="margin-bottom: 2rem;">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <template v-if="local.showComponent">
        <div class="content-wrapper">
           <ion-list>
            <ion-item>
              <ion-button @click="delDB()" color="danger">Delete DB</ion-button>
            </ion-item>
          </ion-list>
          <ion-list v-if="lastEntries.values">
            <ion-list-header>
              <ion-label>Last 15 entries</ion-label>
            </ion-list-header>
            <ion-item>
              <table>
            <tr>
                <th>Date</th>
                <th>User</th>
                <th>Col. Score</th>
                <th>No. posts</th>
                <th>No. links</th>
                <th>Load</th>
                <th>Delete</th>
            </tr>
            <tr v-for="(value) of lastEntries.values" :key= "value.rowid">
                <td>{{value.date}}</td>
                <td>{{value.user}}</td>
                <td>{{value.collusion_score}}</td>
              </tr>
              </table>
            </ion-item>
          </ion-list>
            <ion-list v-else>
            <ion-item>
              <ion-label>No entires in DB</ion-label>
            </ion-item>
          </ion-list>
        </div>

        <!-- <div class="content-wrapper">
    <ion-list>
    
      <ion-item>
      <ion-list style="width:100%">
      <ion-item>
      <ion-label>Get Last Votes:</ion-label>
      </ion-item>
      <ion-item>
            <ion-list>
    <ion-radio-group  v-model="userVotesLimit">
      <ion-list-header>
        <ion-label>Number of Votes:</ion-label>
      </ion-list-header>

      <ion-item>
        <ion-label>100</ion-label>
        <ion-radio slot="start" value="100"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>200</ion-label>
        <ion-radio slot="start"  value="200"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>300</ion-label>
        <ion-radio slot="start"  value="300"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
      </ion-item>
      <ion-item>
      User:&nbsp;&nbsp;
      <ion-input v-model="currentUser" :value="currentUser" type="text" ></ion-input>
      <ion-button @click="graphFetchCurrentUser()" color="warning">Get data</ion-button>
      </ion-item>
      </ion-list>
      </ion-item>

    <ion-item>
      <ion-label>Bypass Cache </ion-label>
      <ion-toggle
        @IonChange="toggleSwitch('getVotesBypassCache')"
        :checked="getVotesBypassCache" >
      </ion-toggle>
    </ion-item>
  </ion-list>
        </div>-->

        <!-- <div class="content-wrapper">
    <ion-list>
    
      <ion-item>
      <ion-list style="width:100%">
      <ion-item>
      <ion-label>Analyze User: {{currentUser}}</ion-label>
      </ion-item>
      <ion-item>
            <ion-list>
    <ion-radio-group  v-model="userNoDeepLimit">
      <ion-list-header>
        <ion-label>Analyze level:</ion-label>
      </ion-list-header>

      <ion-item>
        <ion-label>Low - 1000 Nodes / Links</ion-label>
        <ion-radio slot="start" value="1000"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>Medium - 2500 Nodes / Links</ion-label>
        <ion-radio slot="start"  value="2500"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>High - 5000 Nodes / Links</ion-label>
        <ion-radio slot="start"  value="5000"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
      </ion-item>
      <ion-item>
      User:&nbsp;&nbsp;{{currentUser}}&nbsp;&nbsp;
      <ion-button @click="graphFetchUserDeepData()" color="warning">Get Data</ion-button>
      </ion-item>
      </ion-list>
      </ion-item>

    <ion-item>
      <ion-label>Bypass Cache </ion-label>
      <ion-toggle
        @IonChange="toggleSwitch('getAnalyticsBypassCache')"
        :checked="getAnalyticsBypassCache" >
      </ion-toggle>
    </ion-item>
      <ion-item>
         <ion-label>Collusion Score:&nbsp;&nbsp; {{ computedCollusionScore }} </ion-label>
          </ion-item>
        <ion-item>Collusion Scale:
        &nbsp;{{colScoreMin}}<ion-range :min="colScoreMin" :max="colScoreMax" step="10" :value="collusionScore" disabled :color=" collusionScore < colScoreMax/2 ? 'success' : collusionScore < colScoreMax/3 ? 'warning': 'danger'">
        </ion-range>{{colScoreMax}}&nbsp;<ion-icon slot="end" color="success" :icon="thermometer" ></ion-icon>
      </ion-item>
     <ion-item>
       <ion-button @click="addToDB()"><ion-icon :icon="addCircle"></ion-icon> ADD this Snappost to database</ion-button>
       </ion-item>
  </ion-list>
 
        </div>-->
      </template>
    </ion-content>
  </ion-page>
</template>
 

 
<script lang="ts">
import {
  loadingController,
  //   alertController,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonButtons,
  // IonButton,
  // IonInput,
  IonLabel,
  IonList,
  IonItem,
  // IonToggle,
  // IonRadioGroup,
  // IonRadio,
  IonListHeader,
  // IonModal,
  // IonRange,
  // IonIcon,
  // IonSpinner,
  // IonCard, 
  // IonCardContent,
  //  IonCardHeader,
  //   IonCardSubtitle,
  //    IonCardTitle,


} from '@ionic/vue';
import { defineComponent, onMounted, Ref, ref, watch, computed, getCurrentInstance, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { GRAPH_SNAPSHOTS_TABLE, DB_NAME, deleteDatabase } from '@/utils/sqLite'
// import { thermometer, addCircle } from "ionicons/icons";
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { capSQLiteValues } from '@capacitor-community/sqlite';
import { showAllert } from '@/utils/ionic'

const local = {
  showComponent: false,
};


export default defineComponent({
  name: 'DB-index',
  components: {
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonButtons,
    //          IonButton,
    // IonInput,
    IonLabel,
    IonList,
    IonItem,
    // IonToggle,
    // IonRadioGroup,
    // IonRadio,
    IonListHeader,
    // IonModal,
    // IonRange,
    // IonIcon,
    // IonSpinner,
    //     IonCard, 
    // IonCardContent,
    //  IonCardHeader,
    //   IonCardSubtitle,
    //    IonCardTitle
  },
  ionViewWillEnter () {
    local.showComponent = true;
  },
  ionViewWillLeave () {
    local.showComponent = false;
  },
  setup () {

    const app = getCurrentInstance()
    const route = useRoute();
    const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
    const compId: Ref = ref(route.params.id);
    let db: SQLiteDBConnection;
    const lastEntries: Ref<capSQLiteValues> = ref({});

    // const myForceGraph = ForceGraph3D()(document.getElementById('3d-graph'))
    //   .backgroundColor('white')
    //   .linkColor(() => '#0f0f0f') //Not working?
    //   .nodeOpacity(1)
    //   .height(document.getElementsByClassName('right')[0].offsetHeight)
    //   .width(document.getElementsByClassName('right')[0].offsetWidth)
    //   .nodeLabel('id')
    //   .nodeColor(d => d.color)
    //   .onNodeClick(node => {
    //     getCorrespondingNodes(node);
    //   })
    //   .onNodeRightClick(node => {
    //     addSelectNode(node);
    //   });


    watch(
      () => route.params.id,
      async () => {
        window.location.reload()
      }
    )

    onBeforeMount(async () => {
      const ret = await sqlite.checkConnectionsConsistency();
      const isConn = (await sqlite.isConnection(DB_NAME)).result;
      if (ret.result && isConn) {
        db = await sqlite.retrieveConnection(DB_NAME);
      } else {
        db = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1);
      }
      await db.open();
      console.log('db', db);
    })

    const delDB = async () => {
      if (db) {
        try {
          await deleteDatabase(db);
          showAllert('success', 'Database deleted');
        } catch (e) {
          showAllert('error', `Database delete error: ${e}`);
          console.log('error deleting database', e);
        }
      }
    }
 
    const onMountHandler = async () => {

      await (await loadingController.create({
        message: 'Loading...',
      })).present();

      lastEntries.value = await db.query(`SELECT rowid, user,collusion_score,no_user_posts,no_user_analytics_links,date_created  FROM ${GRAPH_SNAPSHOTS_TABLE} LIMIT 15`)
      console.log(lastEntries.value)
      await loadingController.dismiss();

    };


    onMounted(onMountHandler);

    return {
      compId,
      delDB,
      local,
      lastEntries
    };
  }

});
</script>
 
<style scoped>
#container {
  text-align: center;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

.content-wrapper {
  max-width: 600px;
  max-height: 600px;
  margin: 2rem auto 0 auto;
}
</style>