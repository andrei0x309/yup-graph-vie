

 
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
            <ion-item>Manage DB</ion-item>
            <ion-item>
              <ion-button @click="delDB()" color="danger">Delete DB</ion-button>
            </ion-item>
            <ion-item>
              <ion-button @click="exportDBtoJSON()" color="primary">Export DB to JSON</ion-button>
            </ion-item>
            <ion-item>
              <div>
                <div class="dropzone" v-bind="(getRootProps() as any)">
                  <input v-bind="(getInputProps() as any)" />
                  <p v-if="isDragActive">Drop the files here ...</p>
                  <p v-else>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <ion-button
                  @click="() => { (open as unknown as Function)() }"
                  color="primary"
                >Import From JSON</ion-button>
              </div>
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
  IonList,
  IonItem,



} from '@ionic/vue';
import {
  defineComponent, onMounted, Ref, ref, watch,
  getCurrentInstance, onBeforeMount
} from 'vue';
import { useRoute } from 'vue-router';
import { DB_NAME, deleteDatabase } from '@/utils/sqLite'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { showAllert } from '@/utils/ionic'
import { exportFile } from '@/utils/misc';
import { useDropzone } from "vue3-dropzone";

const local = {
  showComponent: false,
};


export default defineComponent({
  name: 'DB-Manage',
  components: {
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
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
    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });


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

    const exportDBtoJSON = async () => {
      if (db) {
        try {
          const ret = await db.exportToJson('full');
          const date = new Date().toISOString();
          exportFile(`db-${date}.json`, JSON.stringify(ret.export, null, 2)
            .replace(/\\"/g, '')
          );
          console.log('ret', ret);
          showAllert('success', 'Database exported to JSON');
        } catch (e) {
          showAllert('error', `Database export error: ${e}`);
          console.log('error exporting database', e);
        }
      }
    }

    const importDBfromJSON = async (jsonString: string) => {
      if (db) {
        try {
          await sqlite.importFromJson(jsonString);
          console.log('ret', jsonString);
          showAllert('success', 'Database imported from JSON');
        } catch (e) {
          showAllert('error', `Database import error: ${e}`);
          console.log('error importing database', e);
        }
      }
    }


    const onMountHandler = async () => {

      await (await loadingController.create({
        message: 'Loading...',
      })).present();

      await loadingController.dismiss();

    };


    onMounted(onMountHandler);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onDrop (acceptFiles: any, rejectReasons: any) {
      if (acceptFiles.length > 0) {
        const file = acceptFiles[0];
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const json = JSON.parse(e.target.result);
          console.log('json', json);
          try {
            await importDBfromJSON(e.target.result);
          } catch (e) {
            showAllert('error', `Database import error: ${e}`);
            console.log('error importing database', e);
          }
        }
        reader.readAsText(file);
      }
    }


    return {
      compId,
      delDB,
      local,
      exportDBtoJSON,
      getRootProps,
      getInputProps,
      ...rest
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

.dropzone {
  background-color: #383a3e;
  padding: 2rem;
  border: 2px solid #999999;
  margin: 1rem;
  border-radius: 2px;
}
</style>