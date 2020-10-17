import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
  //private today: string[] = [];
  //private eventArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
    // const now = new Date();
    // this.today= now.toISOString();
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
      //this.eventArray = eveArray;
      this.tempArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      // this.presentAlert(databaseError.message);
    })

  }

  //update 
  updateEvent(eventkey) {

    if (this.checkEvent(eventkey)) {
      this.alert.presentAlert("Sorry You cannot update a event now ")
    } else {

      //alert(JSON.stringify(eventkey)); 
      let NavExtras: NavigationExtras = {
        queryParams: eventkey
      }
      this.navCtrl.navigateForward('update-event', NavExtras);

    }
  }
  //delete
  async deleteEvent(eventObj) {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    // when you want to make the table empty (All the objects will be deleted) 
    // this.afData.list('event').remove();

    //when you want to delete only 1 item
    this.afData.list('event').remove(eventObj.eventkey).then(() => {
      loading.dismiss();
      this.alert.presentAlert("Event deleted successfully");
      //this.presentAlert("Event deleted successfully");
    }).catch((error) => {
      loading.dismiss();
      this.alert.presentAlert(error.message);
      //this.presentAlert(error.message);
    });
  }
  async deleteEventAlert(eventObj) {
    if (this.checkEvent(eventObj)) {
      this.alert.presentAlert("Sorry You cannot delete a event now ")
    } else {
      const alert = await this.alertController.create({
        header: 'Taibat App',
        message:'Are you sure you want to delete ' + eventObj.Title + ' ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'headerstyle',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Ok',
            handler: () => {
              this.deleteEvent(eventObj);
            }
          }
        ]
      });
      await alert.present();
    }
  }
  checkEvent(obj) {
    let showalert: boolean = false;
    let currentdate = new Date();
    currentdate.setHours(0, 0, 0, 0);
    let eventdate = new Date(obj.date);
    eventdate.setHours(0, 0, 0, 0);

    let dateold1 = new Date(obj.date);
    dateold1.setDate(dateold1.getDate() - 1);
    dateold1.setHours(0, 0, 0, 0);

    let dateold2 = new Date(obj.date);
    dateold2.setDate(dateold2.getDate() - 2);
    dateold2.setHours(0, 0, 0, 0);

    if (dateold2.getTime() == currentdate.getTime()
      || dateold1.getTime() == currentdate.getTime() ||
      currentdate.getTime() >= eventdate.getTime()) {
      showalert = true;
    }

    return showalert;

  }


}
