

 
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
            <ion-list-header style="margin-bottom:2rem;">
              <ion-label>Last <i>{{ lastNoEntries }}</i> entries</ion-label>
            </ion-list-header>
            <ion-item style="margin-bottom:2rem;">
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
            <tr v-for="(value) of lastEntries.values" :key= "value.rowid">
                <td>{{value.date_created}}</td>
                <td>{{value.user}}</td>
                <td>{{value.collusion_score}}</td>
                <td>{{value.no_user_posts}}</td>
                <td>{{value.no_user_analytics_links}}</td>
                <td> <ion-button @click="loadGraph(value.rowid)" color="success">Load</ion-button></td>
                <td><ion-button @click="delRowId(value.rowid)" color="danger">Delete</ion-button> </td>
              </tr>
              </table>
            </ion-item>
            <ion-item>
              <ion-label style="text-align:center"> - Search - </ion-label>
            </ion-item>
            <ion-item>
              <p>User: <ion-input type="text" v-model="searchUser"></ion-input></p>
            </ion-item>
            <ion-item>
              <p>CollusionScore Greater than: <ion-input type="text" v-model="searchCollScore"></ion-input></p>
              </ion-item>
              <ion-item style="padding:1rem;">
              <div style="width:50%">
                Date From:
                  <ion-item>
                <ion-input :value="dateFrom" />
                <ion-button fill="clear" id="open-date-input-2">
                  <ion-icon :icon="calendar" />
                </ion-button>
                <ion-popover trigger="open-date-input-2" :show-backdrop="false">
                  <ion-datetime
                    presentation="date"
                    @ionChange="(ev: any) => dateFrom = formatDate(ev.detail.value)"
                  />
                </ion-popover>
              </ion-item>
              </div>
              <div style="width:50%">
                Date To:
                                  <ion-item>
                <ion-input :value="dateTo" />
                <ion-button fill="clear" id="open-date-input-2">
                  <ion-icon :icon="calendar" />
                </ion-button>
                <ion-popover trigger="open-date-input-2" :show-backdrop="false">
                  <ion-datetime
                    presentation="date"
                    @ionChange="(ev:any) => dateTo = formatDate(ev.detail.value)"
                  />
                </ion-popover>
              </ion-item>
              </div>
            </ion-item>
            <ion-item>
              <ion-button  @click="searchDB()" color="primary"><ion-icon :icon="search"></ion-icon>Search</ion-button>
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
   IonPopover,
   IonDatetime,
  IonButton,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  // IonToggle,
  // IonRadioGroup,
  // IonRadio,
  IonListHeader,
  // IonModal,
  // IonRange,
  IonIcon,
  // IonSpinner,
  // IonCard, 
  // IonCardContent,
  //  IonCardHeader,
  //   IonCardSubtitle,
  //    IonCardTitle,


} from '@ionic/vue';
import { defineComponent, onMounted, Ref, ref, watch,
 //computed,
  getCurrentInstance, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { GRAPH_SNAPSHOTS_TABLE, DB_NAME, deleteDatabase } from '@/utils/sqLite'
import { calendar, search } from "ionicons/icons";
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { capSQLiteValues } from '@capacitor-community/sqlite';
import { showAllert } from '@/utils/ionic'
import { format, parseISO } from 'date-fns';
import router from '@/router';
import { Capacitor } from '@capacitor/core';
 
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
     IonPopover,
     IonDatetime,
    IonButton,
    IonInput,
    IonLabel,
    IonList,
    IonItem,
    // IonToggle,
    // IonRadioGroup,
    // IonRadio,
    IonListHeader,
    // IonModal,
    // IonRange,
    IonIcon,
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

    const platform = Capacitor.getPlatform()
    const app = getCurrentInstance()
    const route = useRoute();
    const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
    const compId: Ref = ref(route.params.id);
    let db: SQLiteDBConnection;
    const lastEntries: Ref<capSQLiteValues> = ref({});
    const dateFrom = ref(  new Date(Date.now() - (1000 * 60 * 60 * 24 * 30)).toISOString()  );
    const dateTo = ref( new Date().toISOString() );
    const searchUser = ref('');
    const searchCollScore = ref('');
    const searchResults:  Ref<capSQLiteValues> = ref({});
    const lastNoEntries = ref(0);

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

    const loadGraph =  async (id: string) => {
      router.push(`/graph/index/${id}`)
    }

    const searchDB = async () => {
      const userQuery = searchUser.value ? ` user LIKE '%${searchUser.value}%'` : '';
      const collScoreQuery = searchCollScore.value ? userQuery ? ` AND collusion_score >= '${searchCollScore.value}'`:  ` collusion_score >= '${searchCollScore.value}'` : '';
      const dateFromQuery = dateFrom.value && dateTo.value ? userQuery || collScoreQuery ? ` AND date_created BETWEEN '${dateFrom.value}' AND '${dateTo.value}' ` : ` date_created BETWEEN '${dateFrom.value}' AND '${dateTo.value}' ` : '';

      const query = `SELECT * FROM ${GRAPH_SNAPSHOTS_TABLE} WHERE  ${userQuery}${collScoreQuery}${dateFromQuery}  Order By date_created DESC LIMIT 100 `;
      searchResults.value= await db.query(query);

      console.log('search', searchResults.value);
    }

    const delRowId = async (id: string) => {
      if (db) {
        try {
          await db.run(`DELETE FROM ${GRAPH_SNAPSHOTS_TABLE} WHERE rowid = ?`, [id]);
          lastEntries.value.values = lastEntries.value.values?.filter(e => e.rowid !== id);
          lastNoEntries.value = lastEntries.value.values?.length || 0;
          showAllert('success', 'Row deleted');
        if (platform === 'web') {
          await sqlite.saveToStore(DB_NAME)
        }
        } catch (e) {
          showAllert('error', `Row delete error: ${e}`);
          console.log('error deleting row', e);
        }
      }
    }
 
      const formatDate = (value: string) => {
        return format(parseISO(value), 'MMM dd yyyy');
      };

    const onMountHandler = async () => {

      await (await loadingController.create({
        message: 'Loading...',
      })).present();

      lastEntries.value = await db.query(`SELECT rowid, user,collusion_score,no_user_posts,no_user_analytics_links,date_created  FROM ${GRAPH_SNAPSHOTS_TABLE} LIMIT 15`)
      lastNoEntries.value = (lastEntries.value.values as []).length;
      console.log(lastEntries.value, lastNoEntries.value )
      await loadingController.dismiss();

    };


    onMounted(onMountHandler);

    return {
      compId,
      delDB,
      local,
      lastEntries,
      dateFrom,
      loadGraph,
      delRowId,
      dateTo,
      formatDate,
      searchUser,
      searchCollScore,
      calendar,
      search,
      searchDB,
      lastNoEntries
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
  max-width: 800px;
  max-height: 600px;
  margin: 2rem auto 0 auto;
}
</style>