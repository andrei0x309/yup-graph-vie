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
            <ion-list>
              <ion-item>
                <ion-label class="ion-text-center">{{ isPaused ? 'Paused': 'Loading...' }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-spinner style="margin:auto" :paused="isPaused" name="crescent"></ion-spinner>
              </ion-item>
              <ion-item>
               <ion-label class="ion-text-center"> User <b>{{ usersProcessed }}</b> out of <b>{{ usersNo }}</b> </ion-label>
              </ion-item>
               <ion-item>
               <ion-label class="ion-text-center"> Current User: {{ currentUser  }} </ion-label>
              </ion-item>
            </ion-list>
        </div>

        <div v-if="userColScores.length" class="content-wrapper">
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
        </div>
 
        <div class="content-wrapper">
          <ion-list>
            <ion-item>
              <ion-list style="width:100%">
                <ion-item  style="text-align:center">
                  Calculate collusion score for userlist:
                </ion-item>
                      <ion-item>
                         <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-item style="text-align:center">
                    Input users separated by comma
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                    <ion-item>
                      <ion-input v-model="userList" type="text"></ion-input>
                    </ion-item>
                </ion-col>
                 </ion-row>
                  <ion-row>
                 <ion-col>
<ion-button @click="startProcess()" :disabled="processStarted" color="success">Start</ion-button>
                </ion-col>
                                 <ion-col>
<ion-button @click="isPaused ? resumeProcess() : pauseProcess()" :disabled="!processStarted" :color=" isPaused ? 'warning' : 'primary'">Pause</ion-button>
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

    </ion-content>
  </ion-page>
</template>
 

 
<script lang="ts">
import {
  loadingController,
  toastController,
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
  IonRow,
  IonCol,
  IonGrid,
  // IonToggle,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  // IonModal,
  // IonRange,
  IonIcon,
  IonSpinner,
  // IonCard, 
  // IonCardContent,
  //  IonCardHeader,
  //   IonCardSubtitle,
  //    IonCardTitle,


} from '@ionic/vue';
import { defineComponent, onMounted, Ref, ref, watch, getCurrentInstance, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import {
  getSingleUserData,
  generateData,
  getUserDeepData,
  calcuateCollusionScore
}
  from '@/utils/graphV2'
import { COL_SCORE_SNAPSHOTS_TABLE, DB_NAME } from '@/utils/sqLite'
import { showAllert } from '@/utils/ionic'
import { addCircle } from "ionicons/icons";
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
      IonRow,
  IonCol,
  IonGrid,

    // IonToggle,
    IonRadioGroup,
    IonRadio,
    IonListHeader,
    // IonModal,
    // IonRange,
    IonIcon,
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
    const openLongLoading = ref(false);
    const isPaused = ref(false);
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

      let users = userList.value.split(',').map(el => el.trim());
      if(userColScores.value.length > 0) {
        const alreadyProcessed = userColScores.value.map(el => el.user);
        const alreadyProcessedList: string[] = []
        users = users.filter(el => {
          if(alreadyProcessed.includes(el)) {
            alreadyProcessedList.push(el)
            return false
          }
          return true
        })
        
        if(alreadyProcessedList.length > 0) {
                 const toast = await toastController
        .create({
          message:  `Users ${alreadyProcessedList.join(', ')} were excluded from the process because they were already processed`,
          duration: 2500
        })
      return toast.present()
        }

        toastController
      }
      usersNo.value = users.length;
      for ( const user of users ) {
      try {
        currentUser.value = user;
        const userData = await getSingleUserData(user, Number(userVotesLimit.value), getVotesBypassCache.value);
        const linksData = await getUserDeepData(await generateData(userData), Number(userNoDeepLimit.value), getAnalyticsBypassCache.value)
        const cscore = calcuateCollusionScore(linksData);
         if( !processStarted.value ) return
         if (isPaused.value) {
           while (isPaused.value) {
             await new Promise(resolve => setTimeout(resolve, 500));
           }
         }
         userColScores.value.push({
          user,
          cscore
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
      console.log('userColScores', userColScores.value);
      console.log('openLongLoading', openLongLoading.value);
      processStarted.value = false;
      openLongLoading.value = false;
    };


    const pauseProcess = async () => {
      isPaused.value = true;
    };

    const resumeProcess = async () => {
      isPaused.value = false;
    };

    const cancelProcess = async () => {
      processStarted.value = false;
      openLongLoading.value = false;
    };

    const addToDB = async () => {
      await (await loadingController.create({
        message: 'Loading...',
      })).present();
 
      if( userColScores.value.length < 1 ){
        await loadingController.dismiss();
        await showAllert('Error', 'You first need to get some data first!');
        return;
      }
      
      const users = (userColScores.value.map(el => el.user).reduce((acc, cur) =>  acc += `${cur} ,`, '') as string).slice(0, -1);
      const cscores =  JSON.stringify(userColScores.value)

      const sqlcmd = `INSERT INTO ${COL_SCORE_SNAPSHOTS_TABLE} ( users, collusion_scores, date_created  ) VALUES ( ?, ?, ? )`;
      
      const values: Array<any> = [users, cscores, new Date().toISOString()];
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
      usersNo,
      usersProcessed
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