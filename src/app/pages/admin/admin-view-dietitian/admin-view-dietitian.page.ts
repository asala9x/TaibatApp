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

  //defult arry ditiain data
  private dietitian = [
    {
      "image": "../../../../assets/icon/dietition.png",
      "name": "Image",
      "descripion": "This Image Describe Dietitian about ....",
      "phone": "99882230",
      "email": "abc@gmail.com"
    },
    {
      "image": "../../../../assets/icon/dietition.png",
      "name": "Image",
      "descripion": "She is graduate of Sultan Qaboos University majoring in human nutrition",
      "phone": "9988223",
      "email": "Asma@gmail.com"
    },
    {
      "image": "../../../../assets/icon/dietition.png",
      "name": "Image",
      "descripion": "This Image Describe Dietitian about ....",
      "phone": "99882230",
      "email": "abc@gmail.com"
    }

  ];

  private dietitianArray: any[] = [];
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
      this.dietitianArray = dieArray;
      this.tempArray = dieArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }

}
