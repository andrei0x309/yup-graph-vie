import { alertController } from '@ionic/vue';


const showAllert = async (title: string, msg: string) => {
    const alert = await alertController
        .create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            subHeader: title,
            message: msg,
            buttons: ['OK'],
        });
    await alert.present();
}

export {
    showAllert
}