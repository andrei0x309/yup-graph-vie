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
 
        <div v-if="openLongLoading" class="content-wrapper">
             <ion-content>
            <ion-list>
              <ion-item>
                <ion-label>Loading</ion-label>
              </ion-item>
              <ion-item>
                <ion-spinner name="crescent"></ion-spinner>
              </ion-item>
              <ion-item>
               <ion-label> User {{ }} out of {{ }} </ion-label>
              </ion-item>
               <ion-item>
               <ion-label> Current User: {{ currentUser  }} </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </div>

        <div v-if="userColScores.length" class="content-wrapper">
             <ion-content>
            <ion-list>
              <ion-item>
                <ion-label>Results</ion-label>
              </ion-item>
              <ion-item v-for="user of userColScores" :key="user.user">
               <ion-label><b>User:</b> {{ user.user }} ; <b>CScore:</b> {{ user.cscore }}  </ion-label>
              </ion-item>
               <ion-item>
              <ion-button @click="addToDB()">
                <ion-icon :icon="addCircle"></ion-icon>ADD this result to Database
              </ion-button>
              </ion-item>
            </ion-list>
          </ion-content>
        </div>
 
        <div class="content-wrapper">
          <ion-list>
            <ion-item>
              <ion-list style="width:100%">
                <ion-item>
                  <ion-label style="text-align:center">Calculate collusion score for userlist:</ion-label>
                </ion-item>
                      <ion-item>
                         <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label style="text-align:center">Input users separated by comma</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                    <ion-item>
                      <ion-input v-model="userList" type="text"></ion-input>
                    </ion-item>
                </ion-col>
                 <ion-col>
<ion-button @click="startProcess()" :disabled="processStarted" color="success">Start</ion-button>
                </ion-col>
                                 <ion-col>
<ion-button @click="isPaused ? resumeProcess() : pauseProcess()" :color=" isPaused ? 'warning' : 'primary'">Pause</ion-button>
                </ion-col>
                                 <ion-col>
<ion-button @click="cancelProcess()" :disabled="!processStarted" color="danger">Cancel</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
                </ion-item>

                <ion-item>
                  <ion-list>
                    <ion-radio-group v-model="userVotesLimit">
                      <ion-list-header>
                        <ion-label>Number of Votes for each Users:</ion-label>
                      </ion-list-header>

                      <ion-item>
                        <ion-label>100</ion-label>
                        <ion-radio slot="start" value="100"></ion-radio>
                      </ion-item>

                      <ion-item>
                        <ion-label>200</ion-label>
                        <ion-radio slot="start" value="200"></ion-radio>
                      </ion-item>

                      <ion-item>
                        <ion-label>300</ion-label>
                        <ion-radio slot="start" value="300"></ion-radio>
                      </ion-item>
                    </ion-radio-group>
                  </ion-list>
                </ion-item>
                
                <ion-item>
                  <ion-list>
                    <ion-radio-group v-model="userNoDeepLimit">
                      <ion-list-header>
                        <ion-label>Analyze level:</ion-label>
                      </ion-list-header>

                      <ion-item>
                        <ion-label>Low - 1000 Nodes / Links</ion-label>
                        <ion-radio slot="start" value="1000"></ion-radio>
                      </ion-item>

                      <ion-item>
                        <ion-label>Medium - 2500 Nodes / Links</ion-label>
                        <ion-radio slot="start" value="2500"></ion-radio>
                      </ion-item>

                      <ion-item>
                        <ion-label>High - 5000 Nodes / Links</ion-label>
                        <ion-radio slot="start" value="5000"></ion-radio>
                      </ion-item>
                    </ion-radio-group>
                  </ion-list>
                </ion-item>
                
              </ion-list>
            </ion-item>

 
          </ion-list>
        </div>

        <!-- <div v-if="loadedLinks" class="content-wrapper">
          <ion-list>
            <ion-item>
              <ion-list style="width:100%">
                <ion-item>
                  <ion-label>Analyze User: {{ currentUser }}</ion-label>
                </ion-item>
                
                <ion-item>
                  User:&nbsp;&nbsp;{{ currentUser }}&nbsp;&nbsp;
                  <ion-button @click="graphFetchUserDeepData()" color="warning">Get Data</ion-button>
                </ion-item>
              </ion-list>
            </ion-item>

            <ion-item>
              <ion-label>Bypass Cache</ion-label>
              <ion-toggle
                @IonChange="toggleSwitch('getAnalyticsBypassCache')"
                :checked="getAnalyticsBypassCache"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Collusion Score:&nbsp;&nbsp; {{ computedCollusionScore }}</ion-label>
            </ion-item>
            <ion-item>
              Collusion Scale:
              &nbsp;{{ colScoreMin }}
              <ion-range
                :min="colScoreMin"
                :max="colScoreMax"
                step="10"
                :value="collusionScore"
                disabled
                :color="collusionScore < colScoreMax / 2 ? 'success' : collusionScore < colScoreMax / 3 ? 'warning' : 'danger'"
              ></ion-range>
              {{ colScoreMax }}&nbsp;
              <ion-icon slot="end" color="success" :icon="thermometer"></ion-icon>
            </ion-item>
            <ion-item>
              <ion-button @click="addToDB()">
                <ion-icon :icon="addCircle"></ion-icon>ADD this Snappost to database
              </ion-button>
            </ion-item>
          </ion-list>
        </div> -->
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
  IonButton,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  // IonToggle,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  // IonModal,
  // IonRange,
  // IonIcon,
  IonSpinner,
  // IonCard, 
  // IonCardContent,
  //  IonCardHeader,
  //   IonCardSubtitle,
  //    IonCardTitle,


} from '@ionic/vue';
import { defineComponent, onMounted, Ref, ref, watch, computed, getCurrentInstance, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import {
  getSingleUserData,
  generateData,
  getUserDeepData,
  calcuateCollusionScore
}
  from '@/utils/graphV2'
import { GRAPH_SNAPSHOTS_TABLE, DB_NAME } from '@/utils/sqLite'
import { showAllert } from '@/utils/ionic'
import { thermometer, addCircle } from "ionicons/icons";
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { Capacitor } from '@capacitor/core';

const local = {
  showComponent: false,
};


export default defineComponent({
  name: 'Graph-index',
  components: {
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonInput,
    IonLabel,
    IonList,
    IonItem,
    // IonToggle,
    IonRadioGroup,
    IonRadio,
    IonListHeader,
    // IonModal,
    // IonRange,
    // IonIcon,
    IonSpinner,
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
    let db: SQLiteDBConnection;

    const userList = ref('');
    const userVotesLimit = ref('100');
    const userNoDeepLimit = ref('1000');
    const getVotesBypassCache = ref(false);
    const getAnalyticsBypassCache = ref(false);
    let currentUserData: any = null;
    let currentUserDeepData: any = null;
    const openLongLoading = ref(false);
    const isPaused = ref(false);
    const collusionScore = ref(0);
    const userColScores: Ref<Record<string, number | string>[]> = ref([]);
    const compId: Ref = ref(route.params.id);
    const usersNo = ref(0);
    const currentUser = ref('');
    const usersProcessed = ref(0);
    const processStarted = ref(false);
    const platform = Capacitor.getPlatform()
    
    // const colScoreMax = 25;
    // const colScoreMin = 0;
    //
    // const selectedNode = ref('')
    // const selectedNodeType = ref('')
    // const selectedPrevNode = ref()
    // const selectedNodeLastColor = ref('')



    const computedCollusionScore = computed(() => {
      return collusionScore.value > 0 ? collusionScore.value : '';
    });

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
 
    // const loadingCallback = (msg: string): void => {
    //   if (loadingListMsgs.value.length > 10) {
    //     loadingListMsgs.value.shift();
    //     loadingListMsgs.value.push(msg as string);
    //   } else {
    //     loadingListMsgs.value.push(msg as string);
    //   }
    // }
 
    const startProcess = async () => {
      
      openLongLoading.value = true;
      processStarted.value = true;

      const users = userList.value.split(',').map(el => el.trim());
      usersNo.value = users.length;
      for ( const user of users ) {
      try {
        currentUser.value = user;
        const userData = await getSingleUserData(user, Number(userVotesLimit.value), getVotesBypassCache.value);
        const linksData = await getUserDeepData(await generateData(userData), Number(userNoDeepLimit.value), getAnalyticsBypassCache.value)
         calcuateCollusionScore(linksData);

         userColScores.value.push({
          user,
          cscore: collusionScore.value
         })
         userList.value = userList.value.split(',').filter(el => el !== user).join(',');
         usersProcessed.value++;
      } catch (e) {
        userColScores.value.push({
          user,
          cscore: 'User not found'
         })
      }
      }
      openLongLoading.value = false;
    };


    const pauseProcess = async () => {
      await (await loadingController.create({
        message: 'Pausing...',
      })).present();
      await loadingController.dismiss();
    };

    const resumeProcess = async () => {
      await (await loadingController.create({
        message: 'Resuming...',
      })).present();
      await loadingController.dismiss();
    };

    const cancelProcess = async () => {
      await (await loadingController.create({
        message: 'Cancelling...',
      })).present();
      await loadingController.dismiss();
    };

    // const graphFetchUserDeepData = async () => {

    //   if (currentUser.value === '' || currentUserData === null) {
    //     await showAllert('Error', 'You first need to get some links for a user');
    //     return;
    //   }

    //   await (await loadingController.create({
    //     message: 'Loading...',
    //   })).present();

    //   const isTakeingLong = setTimeout(async () => {
    //     openLongLoading.value = true;
    //     try {
    //       await loadingController.dismiss();
    //     } catch (e) {
    //       e
    //     }
    //   }, 150);

    //   try {
    //     currentUserDeepData = 
    //     graph.value.graphData(currentUserDeepData);
    //     collusionScore.value =
    //     graph.value.cameraPosition(
    //       { x: 0, y: 0, z: currentUserDeepData.nodes.length * 1.5 },
    //       0, 2000)
    //   } catch (e) {
    //     console.log(e);
    //     await showAllert('Error', 'Error fetching deep data');
    //   } finally {
    //     openLongLoading.value = false;
    //     try {
    //       loadingController.dismiss().then().catch(e => e);
    //       clearTimeout(isTakeingLong);
    //     } catch (e) { e }
    //   }
    // }

    const deGraph = (data: any) =>{
          const degraphLinks = (e: any) => {
            if(typeof e.source === 'string'){
              return { source: e.source, target: e.target}
            }
            return { source: e.source.id, target: e.target.id}
          }
          return { nodes:data.nodes.map( (e:any) => ({ id:e.id, group:e.group, color:e.color, ...(e.postId && {postId: e.postId }) })), links: data.links.map( degraphLinks ) }
    }

    const addToDB = async () => {
      await (await loadingController.create({
        message: 'Loading...',
      })).present();
 
      if( !currentUserData || !currentUserDeepData || !currentUser.value  ){
        await loadingController.dismiss();
        await showAllert('Error', 'You first need to generate the date in order to load it!');
        return;
      }

      
      const sqlcmd = `INSERT INTO ${GRAPH_SNAPSHOTS_TABLE} (user, graph_user_links, graph_user_analytics, collusion_score, no_user_posts, no_user_analytics_links, date_created ) VALUES (?,?,?,?,?,?,?)`;
      
      
      const values: Array<any> = [currentUser.value, JSON.stringify(deGraph(currentUserData)), JSON.stringify(deGraph(currentUserDeepData)), collusionScore.value, currentUserData.nodes.length - 1, currentUserDeepData.links.length, new Date().toISOString()];
      try {
        await db.run(sqlcmd, values);
        if (platform === 'web') {
          await sqlite.saveToStore(DB_NAME)
        }
        await showAllert('Success', `Added to DB`);
      } catch (e) {
        await showAllert('Error', `Saving to DB failed ${e}`);
      }
      await loadingController.dismiss();
    }

 
    const onMountHandler = async () => {

      await (await loadingController.create({
        message: 'Loading...',
      })).present();
      
 
      await loadingController.dismiss();

    };


    onMounted(onMountHandler);

    return {
      compId,
      userList,
      openLongLoading,
      isPaused,
      resumeProcess,
      pauseProcess,
      cancelProcess,
      startProcess,
      processStarted,
      userColScores,
      currentUser,
      // graphFetchCurrentUser,
      userVotesLimit,
      // getAnalyticsBypassCache,
      userNoDeepLimit,
      // graphFetchUserDeepData,
      // toggleSwitch,
      // computedCollusionScore,
      // collusionScore,
      // loadingListMsgs,
      // thermometer,
      addCircle,
      addToDB,
      // colScoreMin,
      // colScoreMax,
      // loadedLinks
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