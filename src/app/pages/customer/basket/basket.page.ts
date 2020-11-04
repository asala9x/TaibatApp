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
    });
    this.tempArray = this.basketArray;

    // this.tot();

  }

  ngOnInit() {
    this.retrieveDataFromFirebase();

    // this.tot();
  }

  async retrieveDataFromFirebase() {
    let OrderArrayTemp: any[] = [];
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('products').valueChanges().subscribe((orderArray) => {
      this.basketArray = orderArray;
      console.log(this.basketArray);


      this.authService.getDataFromStorage().then((userdata) => {




        for (let i = 0; i < this.basketArray.length; i++) {
          this.orderArr = this.basketArray[i].orders;
          console.log(this.basketArray[i].orders);


          if (this.basketArray[i].orders != undefined) {



            for (let index = 0; index < this.basketArray[i].orders.length; index++) {
              OrderArrayTemp.push(this.basketArray[i].orders[index]);

            }

            for (let z = 0; z < OrderArrayTemp.length; z++) {



              if (OrderArrayTemp[z].CustomerId != userdata.uid) {
                OrderArrayTemp.splice(z, 1);
              }
            }

          }

          loading.dismiss();


        }

        console.log(OrderArrayTemp);
        this.basketArray = OrderArrayTemp;

        loading.dismiss();
      }).catch((storageerror) => {
        loading.dismiss();
        this.alert.presentAlert("Unable to get data from storage");
      })


    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
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
