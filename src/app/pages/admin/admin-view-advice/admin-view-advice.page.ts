import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
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
    public loadingController: LoadingController)  { }

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
      this.tempArray=advArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      //this.presentAlert(databaseError.message);
    })

  }

}
