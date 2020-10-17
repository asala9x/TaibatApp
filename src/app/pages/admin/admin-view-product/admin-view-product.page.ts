import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-admin-view-product',
  templateUrl: './admin-view-product.page.html',
  styleUrls: ['./admin-view-product.page.scss'],
})
export class AdminViewProductPage implements OnInit {
  private catogryArray: any[] = [
    {
      "name": "Foods",
      "value": "Foods",
      "img": "../../../../assets/icon/food.png"
    },
    {
      "name": "Machines",
      "value": "Machines",
      "img": "../../../../assets/icon/mac.png"
    }
    ,
    {
      "name": "Books",
      "value": "Books",
      "img": "../../../../assets/icon/book.png"
    }
    ,
    {
      "name": "Another",
      "value": "Another",
      "img": "../../../../assets/icon/onther.png"
    }

  ];

  //private productArray: any[] = [];
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
  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.afData.list('products').valueChanges().subscribe((proArray) => {
      loading.dismiss();
      // console.log(JSON.stringify(dieArray));
      //this.productArray = proArray;
      this.tempArray = proArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }

  async filterProductData(productskey) {

    this.tempArray = [];

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('products', ref => ref.orderByChild('category').equalTo(productskey)).valueChanges().subscribe((proArray) => {
      loading.dismiss();
      this.tempArray = proArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })
  }

}