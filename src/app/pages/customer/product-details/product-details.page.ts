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

  // private matches: string[] = [];
  private tempArray: any[] = [];
  private tempArray1: any[] = [];
  qty: any;
  private productskey: string = "";
  private uid: string = "";


  private order = {
    "ProductName": "",
    "price": "",
    "qty": "",
    "productid":""
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


  //not sure
  async viewProductData() {


    this.afData.list("user/" + this.uid + "/cart").valueChanges().subscribe((suceess) => {

      console.log(suceess);
      let temp2 = suceess;

      

      let temp: any[] = [];
      for (let i = 0; i < temp2.length; i++) {
        console.log(temp2);
        temp.push(temp2[i]);
      }

      console.log(temp);



      console.log(suceess);
    }, (error) => {

    });



  }


  //AddToCart
  async AddToCart(order) {
    //add order in products (older code)

    // let temp2;
    // let temp: any[] = [];

    // this.afData.list("products/" + this.productskey + "/orders").valueChanges().subscribe((suceess) => {

    //   console.log(suceess);
    //   temp2 = suceess;

    //   for (let i = 0; i < temp2.length; i++) {
    //     console.log(temp2);
    //     temp.push(temp2[i]);
    //   }

    //   console.log(temp);

    //   console.log(suceess);
    // }, (error) => {

    // });


    // let orderObj = {
    //   "ProductName": this.order.ProductName,
    //   "price": this.order.price,
    //   "qty": this.order.qty,
    //   "CustomerId": this.order.CustomerId

    // };
    // orderObj.ProductName = this.tempArray[0].ProductName;
    // orderObj.price = this.tempArray[0].price;
    // orderObj.qty = this.qty;


    // const loading = await this.loadingController.create({
    //   message: 'Please wait...',
    // });
    // await loading.present();


    // this.authService.getDataFromStorage().then((userdata) => {


    //   orderObj.CustomerId = userdata.uid;
    //   temp.push(orderObj);
    //   console.log(temp);
    //   this.afData.list('/products/' + this.productskey).update("orders", temp).then((sucess) => {
    //     loading.dismiss();
    //     this.alert.presentAlert("you have successfully added for the cart");
    //   }).catch((err) => {
    //     loading.dismiss();
    //     this.alert.presentAlert(err.message);
    //   });
    //   loading.dismiss();


    // }).catch((storageerror) => {
    //   loading.dismiss();
    //   this.alert.presentAlert("Unable to get data from storage");
    // })



    //add cart in user (new code)

    let temp2;
    let temp: any[] = [];

    this.afData.list("user/" + this.uid + "/cart").valueChanges().subscribe((suceess) => {

      console.log(suceess);
      temp2 = suceess;
       alert(JSON.stringify(temp2))


      // i = 0 ,       0 < 0
      for (let i = 0; i < temp2.length; i++) {
        console.log(temp2);
        temp.push(temp2[i]);
        
      }


      console.log(temp);

      console.log(suceess);
    }, (error) => {

    });


    let orderObj = {
      "ProductName": this.order.ProductName,
      "price": this.order.price,
      "qty": this.order.qty,
      "productid": this.order.productid

    };
    orderObj.ProductName = this.tempArray[0].ProductName;
    orderObj.price = this.tempArray[0].price;
    orderObj.qty = this.qty;
    orderObj.productid=this.productskey;


    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();


    this.authService.getDataFromStorage().then((userdata) => {
      this.uid = userdata.uid;
      //orderObj.CustomerId = userdata.uid;

      temp.push(orderObj);
      console.log(temp);
      this.afData.list('/user/' + this.uid).update("cart", temp).then((sucess) => {
        // temp.push(orderObj);
        loading.dismiss();
        this.alert.presentAlert("you have successfully added for the cart");
      }).catch((err) => {
        loading.dismiss();
        this.alert.presentAlert(err.message);
      });
      loading.dismiss();


    }).catch((storageerror) => {
      loading.dismiss();
      this.alert.presentAlert("Unable to get data from storage");
    })



   
  }

}
