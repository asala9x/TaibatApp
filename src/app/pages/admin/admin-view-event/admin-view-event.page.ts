import { Component, OnInit } from '@angular/core';
import { AlertController,LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//NavController
import { NavController } from '@ionic/angular';
//NavigationExtras
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-admin-view-event',
  templateUrl: './admin-view-event.page.html',
  styleUrls: ['./admin-view-event.page.scss'],
})
export class AdminViewEventPage implements OnInit {

  private eventArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase, 
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    public navCtrl:NavController) 
    { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }
  // Method for retrieve data from firebase

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    //this.afData.list('event').valueChanges().subscribe((eveArray) => {
      this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
      loading.dismiss();
      // console.log(JSON.stringify(advArray));
      this.eventArray= eveArray;
      this.tempArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
 this.alert.presentAlert(databaseError.message);
      // this.presentAlert(databaseError.message);
    })

  }

  //update 
  async updateEvent(eventObj,data) {

    //eventObj.eventkey - key to update the item inside the table
    // data=>{"name":"","des":""}

    data.test="Event";

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('event').update(eventObj.eventkey,data).then(()=>{
      loading.dismiss();
      this.alert.presentAlert("Event data updated successfully");
    }).catch((error)=>{
      loading.dismiss();
      this.alert.presentAlert(error.message);
      //this.presentAlert(error.message);
    });
    
  }
  //name - get the data from the input fields in alert
  //value - set the data to the input field of alert

  async  updateEventAlert(eventObj) {
    const alertprompt = await this.alertController.create({
      header: 'Update Event',
      cssClass:  'headerstyle',
      inputs: [
        {
          name: 'Title',
          value: eventObj.Title,
          type: 'text',
          placeholder: 'Event Title'
        },
        {
          name: 'date',
          value: eventObj.date,
          type: 'date',
          placeholder: 'Event Date'
        },
        {
          name: 'time',
          value: eventObj.timer,
          type: 'time',
          placeholder: 'Event Time'
        },
        {
          name: 'place',
          value: eventObj.place,
          type: 'text',
          placeholder: 'Event Place'
        },
        {
          name: 'price',
          value: eventObj.price,
          type: 'text',
          placeholder: 'Event Price'
        },
        {
          name: 'people',
          value: eventObj.people,
          type: 'number',
          placeholder: 'Number of People'
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
            this.updateEvent(eventObj,data);
          }
        }
      ]
    });

    await alertprompt.present();
  }

}
