import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController } from '@ionic/angular';
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
//import { timeStamp } from 'console';

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
    public Router: Router,
    public alertController: AlertController) {
    this.route.queryParams.subscribe((data) => {

      this.productskey = data.productskey;
      this.uid = data.uid;
    });
    this.tempArray = this.basketArray;

    

  }

  ngOnInit() {
    this.retrieveDataFromFirebase();
    
   
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


const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
  loading.dismiss;
  console.log(orderArray);
  userCartlist.unsubscribe();
  this.basketArray  = orderArray;
  for (let i = 0; i <   this.basketArray .length; i++) {
      cartArray.push(  this.basketArray [i]);
  }
  
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

  async tot() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    for (let total = 0; total < this.basketArray.length; total++) {
      this.totalPrice = (Number(this.basketArray[total].price) * Number(this.basketArray[total].qty)) + Number(this.totalPrice); //0 = (20 + 0) = 20 * 2 = 40

    }

    this.finaltotal = Number(this.totalPrice) + Number(this.servicechaarge);

    let userPath = "user/" + this.uid 

    this.afData.list(userPath).set("total", this.finaltotal ).then((itemArray) => {
        loading.dismiss();
    }).catch((err) => {
        loading.dismiss();
        this.alert.presentAlert(err.message);
    });

  }


 



//delete
  async deleteproduct(product) {

    const loading = await this.loadingController.create({
        message: 'Please wait...',
    });
    await loading.present();


    this.authService.getDataFromStorage().then((userdata) => {
      this.uid = userdata.uid;

              this.basketArray.forEach( (item, index) => {
                if(item === product) this.basketArray.splice(index,1);
                loading.dismiss;
              });


              //  alert(JSON.stringify(this.basketArray))

              let userPath = "user/" + this.uid 
              this.afData.list(userPath).set("cart", this.basketArray ).then((itemArray) => {
                  loading.dismiss();
                  this.alert.presentAlert("Successfully added");
              }).catch((err) => {
                  loading.dismiss();
                  this.alert.presentAlert(err.message);
              });

     
           this.tot();
            

  }, (databaseError) => {
    loading.dismiss();
    this.alert.presentAlert(databaseError.message);
  })
 

}

  async deleteProductAlert(product) {
    const alert = await this.alertController.create({
        cssClass: 'headerstyle',
        header: 'Taibat App',
        message: 'Are you sure you want to delete ' + product.ProductName + ' ?',

        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'headerstyle',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: 'Okay',
                handler: () => {
                  
                    this.deleteproduct(product);
                
          
                }
            }
        ]
    });

    await alert.present();
}



}
