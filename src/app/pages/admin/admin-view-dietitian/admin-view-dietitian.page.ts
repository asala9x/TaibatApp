import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
  selector: 'app-admin-view-dietitian',
  templateUrl: './admin-view-dietitian.page.html',
  styleUrls: ['./admin-view-dietitian.page.scss'],
})
export class AdminViewDietitianPage implements OnInit {
  //private dietitianArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
  ) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }
  // Method for retrieve data from firebase

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('dietitian').valueChanges().subscribe((dieArray) => {
      loading.dismiss();
      //this.dietitianArray = dieArray;
      this.tempArray = dieArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }
   //update 
   async updateDietitian(dietitianObj,data) {

    //DietitianObj.dietitiankey - key to update the item inside the table
    // data=>{"name":"","des":""}

    data.test="Dietitian";

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('dietitian').update(dietitianObj.dietitiankey,data).then(()=>{
      loading.dismiss();
      this.alert.presentAlert("Dietitian data updated successfully");
      //this.presentAlert("Dietitian data updated successfully");
    }).catch((error)=>{
      loading.dismiss();
      this.alert.presentAlert(error.message);
      //this.presentAlert(error.message);
    });
    
  }
  //name - get the data from the input fields in alert
  //value - set the data to the input field of alert

  async  updateDietitianAlert(dietitianObj) {
    const alertprompt = await this.alertController.create({
      header: 'Update Dietitian',
      cssClass:  'headerstyle',
      inputs: [
        {
          name: 'name',
          value: dietitianObj.name,
          type: 'text',
          placeholder: 'Dietitian Name'
        },
        {
          name: 'email',
          value: dietitianObj.email,
          type: 'email',
          placeholder: 'Dietitian Email'
        },
        {
          name: 'phone',
          value: dietitianObj.phone,
          type: 'number',
          placeholder: 'Dietitian Phone'
        },
        {
          name: 'descripion',
          value: dietitianObj.descripion,
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
            this.updateDietitian(dietitianObj,data);
          }
        }
      ]
    });

    await alertprompt.present();
  }
  //delete
async deleteDietitian(dietitianObj) {

  const loading = await this.loadingController.create({
    message: 'Please wait...',
  });
  await loading.present();

  // when you want to make the table empty (All the objects will be deleted) 
  // this.afData.list('dietitian').remove();

  //when you want to delete only 1 item
  this.afData.list('dietitian').remove(dietitianObj.dietitiankey).then(() => {
    loading.dismiss();
     this.alert.presentAlert("dietitian deleted successfully");
    //this.presentAlert("dietitian deleted successfully");
  }).catch((error) => {
    loading.dismiss();
    this.alert.presentAlert(error.message);
    //this.presentAlert(error.message);
  });

}
async deleteDietitianAlert(dietitianObj) {
    const alert = await this.alertController.create({
      cssClass: 'headerstyle',
      header: 'Taibat App',
      message: 'Are you sure you want to delete '+dietitianObj.name+' ?',
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'headerstyle',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteDietitian(dietitianObj);
          }
        }
      ]
    });

    await alert.present();
  }


}
