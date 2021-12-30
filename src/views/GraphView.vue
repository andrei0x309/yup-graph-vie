

 
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
        <ion-modal
          :is-open="openLongLoading"
          :swipe-to-close="true"
          :presenting-element="($parent as any).$refs.ionRouterOutlet"
        >
          <ion-content>
            <ion-list>
              <ion-item>
                <ion-label>Loading</ion-label>
              </ion-item>
              <ion-item>
                <ion-spinner name="crescent"></ion-spinner>
              </ion-item>
              <ion-item v-for="(value, key) of loadingListMsgs" :key="key">
                <ion-label>{{ value }}</ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-modal>

        <div width="600" height="600" ref="graphElement" class="content-wrapper"></div>

        <div v-if="selectedNode !== ''" class="content-wrapper">
          <ion-list>
            <ion-item>Selected Node: {{ selectedNode }}</ion-item>
            <ion-item>Type: {{ selectedNodeType }}</ion-item>
          </ion-list>
        </div>

        <div class="content-wrapper">
          <ion-list>
            <ion-item>
              <ion-list style="width:100%">
                <ion-item>
                  <ion-label>Get Last Votes:</ion-label>
                </ion-item>
                <ion-item>
                  <ion-list>
                    <ion-radio-group v-model="userVotesLimit">
                      <ion-list-header>
                        <ion-label>Number of Votes:</ion-label>
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
                  User:&nbsp;&nbsp;
                  <ion-input v-model="currentUser" :value="currentUser" type="text"></ion-input>
                  <ion-button @click="graphFetchCurrentUser()" color="warning">Get data</ion-button>
                </ion-item>
              </ion-list>
            </ion-item>

            <ion-item>
              <ion-label>Bypass Cache</ion-label>
              <ion-toggle
                @IonChange="toggleSwitch('getVotesBypassCache')"
                :checked="getVotesBypassCache"
              ></ion-toggle>
            </ion-item>
          </ion-list>
        </div>

        <div v-if="loadedLinks" class="content-wrapper">
          <ion-list>
            <ion-item>
              <ion-list style="width:100%">
                <ion-item>
                  <ion-label>Analyze User: {{ currentUser }}</ion-label>
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
  IonButton,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  IonToggle,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonModal,
  IonRange,
  IonIcon,
  IonSpinner,
  // IonCard, 
  // IonCardContent,
  //  IonCardHeader,
  //   IonCardSubtitle,
  //    IonCardTitle,


} from '@ionic/vue';
import { defineComponent, onMounted, Ref, ref, watch, computed, getCurrentInstance, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import ForceGraph3D from '3d-force-graph';
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
    IonToggle,
    IonRadioGroup,
    IonRadio,
    IonListHeader,
    IonModal,
    IonRange,
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

    const graphElement = ref<HTMLDivElement>();
    const graph: Ref = ref(null);
    const currentUser = ref('');
    const userVotesLimit = ref('100');
    const userNoDeepLimit = ref('1000');
    const getVotesBypassCache = ref(false);
    const getAnalyticsBypassCache = ref(false);
    let currentUserData: any = null;
    let currentUserDeepData: any = null;
    const loadedLinks = ref(false);
    const openLongLoading = ref(false);
    const collusionScore = ref(0);
    const loadingListMsgs: Ref<string[]> = ref([]);
    const compId: Ref = ref(route.params.id);
    const colScoreMax = 25;
    const colScoreMin = 0;
    const platform = Capacitor.getPlatform()
    const selectedNode = ref('')
    const selectedNodeType = ref('')
    const selectedPrevNode = ref()
    const selectedNodeLastColor = ref('')



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

  
    const toggleSwitch = (switchEl: string) => {
      switch (switchEl) {
        case 'getVotesBypassCache':
          getVotesBypassCache.value = !getVotesBypassCache.value;
          break;
        case 'getAnalyticsBypassCache':
          getAnalyticsBypassCache.value = !getAnalyticsBypassCache.value;
          break;
        default:
          break;
      }
    }

    const loadingCallback = (msg: string): void => {
      if (loadingListMsgs.value.length > 10) {
        loadingListMsgs.value.shift();
        loadingListMsgs.value.push(msg as string);
      } else {
        loadingListMsgs.value.push(msg as string);
      }
    }



    const graphFetchCurrentUser = async () => {
      await (await loadingController.create({
        message: 'Loading...',
      })).present();
      try {
        console.log(getVotesBypassCache.value)
        const userData = await getSingleUserData(currentUser.value, Number(userVotesLimit.value), getVotesBypassCache.value)
        currentUserData = await generateData(userData);
        graph.value.graphData(currentUserData);
        loadedLinks.value = true;
      } catch (e) {
        console.log(e);
        await showAllert('Error', 'User not found');
      }

      graph.value.cameraPosition(
        { x: 0, y: 0, z: currentUserData.nodes.length * 1.5 },
        0, 2000)

      await loadingController.dismiss();
    };

    const graphFetchUserDeepData = async () => {

      if (currentUser.value === '' || currentUserData === null) {
        await showAllert('Error', 'You first need to get some links for a user');
        return;
      }

      await (await loadingController.create({
        message: 'Loading...',
      })).present();

      const isTakeingLong = setTimeout(async () => {
        openLongLoading.value = true;
        try {
          await loadingController.dismiss();
        } catch (e) {
          e
        }
      }, 150);

      try {
        currentUserDeepData = await getUserDeepData(currentUserData, Number(userNoDeepLimit.value), getAnalyticsBypassCache.value, loadingCallback as () => void)
        graph.value.graphData(currentUserDeepData);
        collusionScore.value = calcuateCollusionScore(currentUserDeepData);
        graph.value.cameraPosition(
          { x: 0, y: 0, z: currentUserDeepData.nodes.length * 1.5 },
          0, 2000)
      } catch (e) {
        console.log(e);
        await showAllert('Error', 'Error fetching deep data');
      } finally {
        openLongLoading.value = false;
        try {
          loadingController.dismiss().then().catch(e => e);
          clearTimeout(isTakeingLong);
        } catch (e) { e }
      }
    }

    const addToDB = async () => {
      await (await loadingController.create({
        message: 'Loading...',
      })).present();
      const sqlcmd = `INSERT INTO ${GRAPH_SNAPSHOTS_TABLE} (user, graph_user_links, graph_user_analytics, collusion_score, no_user_posts, no_user_analytics_links, date_created ) VALUES (?,?,?,?,?,?,?)`;
      const values: Array<any> = [currentUser.value, JSON.stringify(currentUserData), JSON.stringify(currentUserDeepData), collusionScore.value, currentUserData.nodes.length - 1, currentUserDeepData.links.length, new Date().toISOString()];
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

    const setSelectedNode = (node: any) => {
      if (selectedNode.value !== node.id) {

        if (selectedNode.value !== '') {
          if (selectedPrevNode.value)
            selectedPrevNode.value.color = selectedNodeLastColor.value;
        }

        selectedNodeLastColor.value = node.color;
        const distance = 80;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        graph.value.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node, 800)
        selectedNode.value = node.id;
        node.color = "#00ff00";
        graph.value.nodeColor(graph.value.nodeColor())
        selectedPrevNode.value = node;
        selectedNodeType.value = node.group;
      } else {
        selectedNode.value = '';
        graph.value.cameraPosition(
          { x: Math.abs(0 - node.x), y: (0 - node.y), z: 500 },
          node, 1200)
        node.color = selectedNodeLastColor.value;
        graph.value.nodeColor(graph.value.nodeColor())
      }

    }

    const onMountHandler = async () => {

      await (await loadingController.create({
        message: 'Loading...',
      })).present();

      graph.value = ForceGraph3D()(graphElement.value as HTMLElement)
        .backgroundColor('#222')
        .width(600)
        .height(600)
        .nodeOpacity(1)
        .nodeAutoColorBy('group')
        .nodeLabel('id')
        .nodeColor(d => (d as any).color)
        .linkColor('#0f0f0f')
        .onNodeClick(node => {
          setSelectedNode(node as any);
        })

      await loadingController.dismiss();

    };


    onMounted(onMountHandler);

    return {
      compId,
      graphElement,
      currentUser,
      graphFetchCurrentUser,
      userVotesLimit,
      getVotesBypassCache,
      getAnalyticsBypassCache,
      userNoDeepLimit,
      graphFetchUserDeepData,
      toggleSwitch,
      computedCollusionScore,
      collusionScore,
      loadingListMsgs,
      openLongLoading,
      thermometer,
      addCircle,
      addToDB,
      colScoreMin,
      colScoreMax,
      local,
      selectedNode,
      selectedNodeType,
      loadedLinks
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