import { Component, OnInit } from '@angular/core';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController, LoadingController } from '@ionic/angular';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-dietitian-details',
  templateUrl: './dietitian-details.page.html',
  styleUrls: ['./dietitian-details.page.scss'],
})
export class DietitianDetailsPage implements OnInit {

  private dietitianArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  private dieticiankey: string = "";
  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService, 
    private alertservice: AlertserviceService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe((data) => {
        // alert(JSON.stringify(data));
         this.dieticiankey = data.dietitiankey;
         this.retrieveDataFromFirebase();
       });
    }
  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

   // Method for retrieve data from firebase

   async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    //get the key from previous page and use it here

    this.afData.list('dietitian',ref=>ref.orderByChild("dietitiankey").equalTo(this.dieticiankey)).valueChanges().subscribe((dieArray) => {
      loading.dismiss();
      // console.log(JSON.stringify(dieArray));
      this.dietitianArray = dieArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alertservice.presentAlert(databaseError.message);
      // this.presentAlert(databaseError.message);
    })

  }
  

}
