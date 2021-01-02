import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class LoadingserviceServiceService {



    loading;
    

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
      async showLoader() {

           this.loading = await this.loadingController.create({ message: 'Please wait...' });
            return await this.loading.present();
    
      }
    
      // Hide the loader if already created otherwise return error
      hideLoader() {
    
            return this.loading.dismiss();
       
      }
}
