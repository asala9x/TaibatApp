import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//NavigationExtras
import { NavigationExtras } from '@angular/router';
//NavController
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  private catogryArray:any[]=[
    {
      "name":"Food",
      // "value":"freedelivery",
      "img":"../../../../assets/icon/food.png"
    }
  ,
  {
    "name":"Machines",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/mac.png"
  }
  ,
  {
    "name":"Book",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/book.png"
  }
  ,
  {
    "name":"onther",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/onther.png"
  }
  
  ];

  private productArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];

  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

   // Method for retrieve event data from DB
   async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('Product', ref => ref.orderByChild('ProductName')).valueChanges().subscribe((proArray) => {
      loading.dismiss();
      this.productArray = proArray;
      this.tempArray = proArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })
  }


  


}
