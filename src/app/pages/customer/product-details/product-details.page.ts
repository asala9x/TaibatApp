import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  private matches: string[] = [];
  private tempArray: any[] = [];
  
  private productskey: string = "";

  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController
    ,private route: ActivatedRoute ) {

      this.route.queryParams.subscribe((data) => {
        // alert(JSON.stringify(data));
         this.productskey = data.productskey;
         this.retrieveDataFromFirebase();
       });
     }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    
    // this.afData.list('products').valueChanges().subscribe((proArray) => {
      this.afData.list('products',ref=>ref.orderByChild("productskey").equalTo(this.productskey)).valueChanges().subscribe((proArray) => {
      loading.dismiss();
      this.tempArray = proArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }

}
