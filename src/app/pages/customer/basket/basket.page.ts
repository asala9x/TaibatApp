import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
// import { privateEncrypt } from 'crypto';
// import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
//import { runInThisContext } from 'vm';

import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
  private productsArray: any[] = [];
  private tempArray: any[] = [];
  private productskey: string = "";
  private uid: string = "";
  private basketArray: any[] = [];
  private orderArr: any[] = [];
  private finaltotal = 0;
  private servicechaarge = 2;
  private totalPrice = 0;

  constructor(private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    private route: ActivatedRoute,
    private authService: ServiceService,
    public navCtr: NavController,
    public Router: Router) {
    this.route.queryParams.subscribe((data) => {

      this.productskey = data.productskey;
      this.uid = data.uid;
    });
    this.tempArray = this.basketArray;

    // this.tot();

  }

  ngOnInit() {
    this.retrieveDataFromFirebase();

    // this.tot();
  }

  async retrieveDataFromFirebase() {
    let cartArray: any[] = [];
    




    let OrderArrayTemp: any[] = [];
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
   this.authService.getDataFromStorage().then((userdata) => {
    this.uid = userdata.uid;
     let userCartPath = "user/" + this.uid + "/cart"
    loading.dismiss;
//alert(userCartPath)

const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
  loading.dismiss;
  console.log(orderArray);
  userCartlist.unsubscribe();
  this.basketArray  = orderArray;
  for (let i = 0; i <   this.basketArray .length; i++) {
      cartArray.push(  this.basketArray [i]);
  }
 // alert(JSON.stringify(cartArray));
  this.tot();
         loading.dismiss();
  
      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })
    }).catch((storageerror) => {
          loading.dismiss();
          this.alert.presentAlert("Unable to get data from storage");
        })
        
    }

  tot() {

    for (let total = 0; total < this.basketArray.length; total++) {
      this.totalPrice = (Number(this.basketArray[total].price) * Number(this.basketArray[total].qty)) + Number(this.totalPrice); //0 = (20 + 0) = 20 * 2 = 40

    }

    this.finaltotal = Number(this.totalPrice) + Number(this.servicechaarge);



  }



  checkOut() {

    this.Router.navigate(['checkout'], { queryParams: { amount: this.finaltotal } });
  }
}
