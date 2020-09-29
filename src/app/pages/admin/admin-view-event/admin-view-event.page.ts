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

  // async presentAlert(msg) {
  //   const alert = await this.alertController.create({
  //     header: 'Taibat App',
  //     message: msg,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }
}
