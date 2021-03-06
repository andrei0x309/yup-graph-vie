<template>
  <IonApp>
    <IonSplitPane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Control Panel</ion-list-header>
            <ion-note>***</ion-note>

            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item
                style="cursor:pointer"
                @click="selectedIndex = i"
                router-direction="root"
                :router-link="p.url"
                lines="none"
                detail="false"
                class="hydrated"
                :class="{ selected: selectedIndex === i }"
              >
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </IonSplitPane>
  </IonApp>
</template>

<script lang="ts">
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import { defineComponent, ref, getCurrentInstance, watch } from 'vue';
import { useRoute } from 'vue-router';
import { settings, cube, personOutline, peopleOutline } from 'ionicons/icons';
import { useSQLite } from 'vue-sqlite-hook';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
  },

  setup () {
    const app = getCurrentInstance();
    const selectedIndex = ref(0);

    const appPages = [
      {
        title: 'User Graph Explorer',
        url: '/graph/index',
        iosIcon: personOutline,
        mdIcon: personOutline
      },
      {
        title: 'DB Entries For Graph',
        url: '/graph/db-user',
        iosIcon: cube,
        mdIcon: cube
      },
      {
        title: 'CScore For User List',
        url: '/graph/col-score-list',
        iosIcon: peopleOutline,
        mdIcon: peopleOutline
      },
      {
        title: 'DB Entries For CScore',
        url: '/graph/db-col-score-list',
        iosIcon: cube,
        mdIcon: cube
      },
      {
        title: 'Manage DB',
        url: '/graph/db-manage',
        iosIcon: settings,
        mdIcon: settings
      },


    ];

    const isModalOpen = app?.appContext.config.globalProperties.$isModalOpen;
    const contentMessage = app?.appContext.config.globalProperties.$messageContent;
    const jsonListeners = app?.appContext.config.globalProperties.$isJsonListeners;

    const path = window.location.pathname.split('graph/')[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(page => page.url.split('graph/')[1].toLowerCase() === path.toLowerCase());
    }

    const route = useRoute();

    const onProgressImport = async (progress: string) => {
      if (jsonListeners.jsonListeners.value) {
        if (!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
        contentMessage.setMessage(
          contentMessage.message.value.concat(`${progress}\n`));
      }
    }
    const onProgressExport = async (progress: string) => {
      if (jsonListeners.jsonListeners.value) {
        if (!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
        contentMessage.setMessage(
          contentMessage.message.value.concat(`${progress}\n`));
      }
    }
    if (app != null) {
      app.appContext.config.globalProperties.$sqlite = useSQLite({
        onProgressImport,
        onProgressExport
      });
    }

    watch(
      () => route.path,
      async () => {
        const path = window.location.pathname.split('graph/')[1].split('/')[0];
        selectedIndex.value = appPages.findIndex(page => page.url.split('graph/')[1].toLowerCase() === path.toLowerCase());
      }
    )

    return {
      selectedIndex,
      appPages,
    }
  }
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>