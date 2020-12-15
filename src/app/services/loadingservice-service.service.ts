import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class LoadingserviceServiceService {

    constructor(public loadingController: LoadingController) { }
    // async loading(msg) {
    //     const loading = await this.loadingController.create({
    //         message: 'Please wait...',
    //     });
    //     await loading.present();
    //     loading.dismiss();
    // }
}
