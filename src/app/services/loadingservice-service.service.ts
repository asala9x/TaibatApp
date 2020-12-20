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
    showHideAutoLoader() {

        this.loadingController.create({
          message: 'This Loader Will Auto Hide in 2 Seconds',
        }).then((res) => {
          res.present();
    
          res.onDidDismiss().then((dis) => {
            console.log('Loading dismissed! after 2 Seconds', dis);
          });
        });
    
      }
    
      // Show the loader for infinite time
      showLoader() {
    
        this.loadingController.create({
          message: 'Please wait...'
        }).then((res) => {
          res.present();
        });
    
      }
    
      // Hide the loader if already created otherwise return error
      hideLoader() {
    
        this.loadingController.dismiss().then((res) => {
          console.log('Loading dismissed!', res);
        }).catch((error) => {
          console.log('error', error);
        });
    
      }
}
