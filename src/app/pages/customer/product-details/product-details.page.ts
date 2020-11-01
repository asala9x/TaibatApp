import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router'

import { ServiceService } from '../../../services/service.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  private matches: string[] = [];
  private tempArray: any[] = [];
  private tempArray1: any[] = [];
  qty: any;
  private productskey: string = "";


  private order = {
    "ProductName": "",
    "price":"",
    "qty":"",
    "CustomerId":""
  };
  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController
    , private route: ActivatedRoute, 
    private authService: ServiceService) {

    this.route.queryParams.subscribe((data) => {
      
      this.productskey = data.productskey;
      this.retrieveDataFromFirebase(this.productskey);
    });
    this.qty = 1;
  }

  ngOnInit() {
    
  }

  async retrieveDataFromFirebase(productskey) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    
    this.afData.list('products', ref => ref.orderByChild("productskey").equalTo(productskey)).valueChanges().subscribe((proArray) => {
      loading.dismiss();

      this.tempArray = proArray;
      
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }

 

  // increment product qty
  incrementQty() {
    console.log(this.qty + 1);
    this.qty += 1;
  }

  // decrement product qty
  decrementQty() {
    if (this.qty - 1 < 1) {
      this.qty = 1
      console.log("1->" + this.qty);
    } else {
      this.qty -= 1;
      console.log("2->" + this.qty);
    }
  }
  //AddToCart
  async AddToCart(order) {
   
    let orderObj = {
      "ProductName": this.order.ProductName,
      "price":this.order.price,
      "qty":this.order.qty,
      "CustomerId":this.order.CustomerId

    };
    orderObj.ProductName=this.tempArray[0].ProductName;
    orderObj.price=this.tempArray[0].price;
    orderObj.qty=this.qty;
    

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

     //this.afData.list('products').update(this.productskey, orderObj).then(() => {
     this.authService.getDataFromStorage().then((userdata ) => {
     
     
     orderObj.CustomerId=userdata.uid;
    this.afData.list("products/" + this.productskey + "/orders").push(orderObj).then(() => {
      
      loading.dismiss();
      this.alert.presentAlert("you have successfully added for the cart");

      })
      .catch(() => {
        loading.dismiss();
        this.alert.presentAlert("Error while added for the cart");
      });

    }).catch((storageerror) => {
      loading.dismiss();
      this.alert.presentAlert("Unable to get data from storage");
    })
   //}).catch((error) => {
  //     loading.dismiss();
  //     this.alert.presentAlert(error.message);
  //   });
  //   // this.alert.presentAlert("No item");
   }
}
