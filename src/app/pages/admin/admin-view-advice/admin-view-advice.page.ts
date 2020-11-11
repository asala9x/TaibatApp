import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
@Component({
  selector: 'app-admin-view-advice',
  templateUrl: './admin-view-advice.page.html',
  styleUrls: ['./admin-view-advice.page.scss'],
})
export class AdminViewAdvicePage implements OnInit {

  private adviceArray: any[] = [];
  //temp Array
  private tempArray: any[] = [];
  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService,
    public loadingController: LoadingController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }
  // Method for retrieve data from firebase

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    // this.afData.list('advice').valueChanges().subscribe((advArray) => {
    this.afData.list('advice', ref => ref.orderByChild('time')).valueChanges().subscribe((advArray) => {
      loading.dismiss();
      // console.log(JSON.stringify(advArray));
      this.adviceArray = advArray;
      this.tempArray = advArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      //this.presentAlert(databaseError.message);
    })

  }
  //update 
  async updateAdvice(adviceObj, data) {
    data.test = "Advice";
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('advice').update(adviceObj.advicekey, data).then(() => {
      loading.dismiss();
      this.alert.presentAlert("Advice data updated successfully");
    }).catch((error) => {
      loading.dismiss();
      this.alert.presentAlert(error.message);
    });

  }
  async updateAdviceAlert(adviceObj) {
    const alertprompt = await this.alertController.create({
      header: 'Update Dietitian',
      cssClass: 'headerstyle',
      inputs: [
        {
          name: 'name',
          value: adviceObj.name,
          type: 'text',
          placeholder: 'Advice Title'
        },
        {
          name: 'descripion',
          value: adviceObj.descripion,
          type: 'text',
          placeholder: 'Descripion'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'headerstyle',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updateAdvice(adviceObj, data);
          }
        }
      ]
    });
    await alertprompt.present();
  }

  //delete
  async deleteAdvice(adviceObj) {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.afData.list('advice').remove(adviceObj.advicekey).then(() => {
      loading.dismiss();
      this.alert.presentAlert("Advice deleted successfully");
    }).catch((error) => {
      loading.dismiss();
      this.alert.presentAlert(error.message);
      //this.presentAlert(error.message);
    });

  }
  async deleteAdviceAlert(adviceObj) {
    const alert = await this.alertController.create({
      cssClass: 'headerstyle',
      header: 'Taibat App',
      message: 'Are you sure you want to delete ' + adviceObj.name + ' ?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'headerstyle',
          handler: (blah) => {
            console.log('Confirm Cancel: blsah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteAdvice(adviceObj);
          }
        }
      ]
    });

    await alert.present();
  }

  async CreatePopOver(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponentPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
