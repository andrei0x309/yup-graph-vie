

 
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
          <ion-list v-if="lastEntries.values">
            <ion-list-header style="margin-bottom:2rem;">
              <ion-label>
                Last
                <i>{{ lastNoEntries }}</i> entries
              </ion-label>
            </ion-list-header>
            <ion-item style="margin-bottom:2rem;">
              <SearchTable :entries="lastEntries" :loadGraph="loadGraph" :delRowId="delRowId"></SearchTable>
            </ion-item>
            <ion-item>
              <ion-label style="text-align:center">- Search -</ion-label>
            </ion-item>
            <ion-item>
              <p>
                User:
                <ion-input type="text" v-model="searchUser"></ion-input>
              </p>
            </ion-item>
            <ion-item>
              <p>
                Collusion Score Greater than:
                <ion-input type="text" v-model="searchCollScore"></ion-input>
              </p>
            </ion-item>
            <ion-item style="padding:1rem;">
              <div style="width:50%">
                Date From:
         <ion-datetime :showDefaultButtons="true" v-model="dateFrom"  presentation="date" @ionChange="(ev: any) => dateFrom = formatDate(ev.detail.value)"></ion-datetime>
              </div>
              <div style="width:50%">
                Date To:
            <ion-datetime :showDefaultButtons="true" v-model="dateTo"  presentation="date" @ionChange="(ev: any) => dateTo = formatDate(ev.detail.value)"></ion-datetime>

              </div>
            </ion-item>
            <ion-item>
              <ion-button @click="searchDB()" color="primary">
                <ion-icon :icon="search"></ion-icon>Search
              </ion-button>
            </ion-item>
          </ion-list>
          <ion-list v-else>
            <ion-item>
              <ion-label>No entires in DB</ion-label>
            </ion-item>
          </ion-list>
          <ion-item v-if="pressedSearch">
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label style="text-align:center">Search Results</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-list>
                    <ion-item v-if="searchResults.values">
                      <SearchTable
                        :entries="searchResults"
                        :loadGraph="loadGraph"
                        :delRowId="delRowId"
                      ></SearchTable>
                    </ion-item>
                    <ion-item v-else>
                      <ion-label>Sire your search was futile.</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </div>

      </template>
    </ion-content>
  </ion-page>
</template>
 

 
<script lang="ts">



import {
  loadingController,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonButtons,
  IonDatetime,
  IonButton,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  IonCol,
  IonRow,
  IonGrid,
  IonListHeader,
  IonIcon,

} from '@ionic/vue';
import {
  defineComponent, onMounted, Ref, ref, watch,
  //computed,
  getCurrentInstance, onBeforeMount
} from 'vue';
import { useRoute } from 'vue-router';
import { GRAPH_SNAPSHOTS_TABLE, DB_NAME, deleteDatabase } from '@/utils/sqLite'
import { calendar, search } from "ionicons/icons";
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { capSQLiteValues } from '@capacitor-community/sqlite';
import { showAllert } from '@/utils/ionic'
import { format, parseISO } from 'date-fns';
import router from '@/router';
import { Capacitor } from '@capacitor/core';
import SearchTable from '@/components/SearchTable.vue';

const local = {
  showComponent: false,
};


export default defineComponent({
  name: 'DB-index',
  components: {
    SearchTable,
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonButtons,
    IonDatetime,
    IonButton,
    IonInput,
    IonLabel,
    IonList,
    IonItem,
    IonCol,
      IonRow,
  IonGrid,
    IonListHeader,
    IonIcon,
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
    const dateFrom = ref(new Date(Date.now() - (1000 * 60 * 60 * 24 * 30)).toISOString());
    const dateTo = ref(new Date().toISOString());
    const searchUser = ref('');
    const searchCollScore = ref('');
    const searchResults: Ref<capSQLiteValues> = ref({});
    const lastNoEntries = ref(0);
    const pressedSearch = ref(false);
    const dateToExpand = ref(false);
    const datePopoverFrom = ref(false);

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

    const loadGraph = async (id: string) => {
      router.push(`/graph/index/${id}`)
    }

    const searchDB = async () => {
      const userQuery = searchUser.value ? ` user LIKE '%${searchUser.value}%'` : '';
      const collScoreQuery = searchCollScore.value ? userQuery ? ` AND collusion_score >= '${searchCollScore.value}'` : ` collusion_score >= '${searchCollScore.value}'` : '';
      const dateFromQuery = dateFrom.value && dateTo.value ? userQuery || collScoreQuery ? ` AND date_created BETWEEN '${dateFrom.value}' AND '${dateTo.value}' ` : ` date_created BETWEEN '${dateFrom.value}' AND '${dateTo.value}' ` : '';

      const query = `SELECT * FROM ${GRAPH_SNAPSHOTS_TABLE} WHERE  ${userQuery}${collScoreQuery}${dateFromQuery}  Order By date_created DESC LIMIT 100 `;
      searchResults.value = await db.query(query);
      pressedSearch.value = true;

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
      console.log(lastEntries.value, lastNoEntries.value)
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
      lastNoEntries,
      pressedSearch,
      searchResults,
      dateToExpand,
      datePopoverFrom,
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