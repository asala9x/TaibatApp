import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoadingController, ToastController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  private total: string = "";
  private uid: string = "";
  private basketArray: any[] = [];
  private totalArray: any[] = [];
  private orderArr: any[] = [];
  private cartArray: any[] = [];

  constructor(private route: ActivatedRoute, public loadingController: LoadingController,
    private authService: ServiceService,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService) {


  }
  ngOnInit() {
    this.retrieveDataFromFirebase();
  }



  async retrieveDataFromFirebase() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    //get current data user
    this.authService.getDataFromStorage().then((userdata) => {
      this.uid = userdata.uid;
      let userCartPath = "user/" + this.uid + "/cart"
      let userCartPath1 = "user/" + this.uid + "/total"
      loading.dismiss;

      //get cart arry
      const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
        loading.dismiss;
        // console.log(orderArray);
        userCartlist.unsubscribe();
        this.basketArray = orderArray;

        for (let i = 0; i < this.basketArray.length; i++) {
          this.cartArray.push(this.basketArray[i]);
        }

       
        this.total=userdata.total;

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

  async order() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();



     //get curent user data 
    this.authService.getDataFromStorage().then((userdata) => {
     
      let orderObj = {
        "userId": userdata.uid,
        "order": this.basketArray,
        "Total": this.total,
        "States":"in-progress"

      };

      // alert(JSON.stringify(orderObj))

      loading.dismiss;

      //move data from cart to orders
      this.afData.list('orders').push(orderObj).then((ifSeccess) => {
        loading.dismiss();

        //clere cart and total
       this.total="";
        this.basketArray = [];
      
        //update cart
        let userPath1 = "/user/" + this.uid
        this.afData.list(userPath1).set("cart", this.basketArray).then((itemArray) => {

          //update total
          let userPath = "user/" + this.uid

          this.afData.list(userPath).set("total", this.total).then((itemArray) => {
            loading.dismiss();
          }).catch((err) => {
            loading.dismiss();
            this.alert.presentAlert(err.message);
          });

          loading.dismiss();

        }).catch((err) => {
          loading.dismiss();
          this.alert.presentAlert(err.message);
        });

        this.alert.presentAlert("Thank you for shopping with us. Waiting for you again");
      }).catch((Error) => {
        loading.dismiss();
        this.alert.presentAlert(Error.message);
      });

    }).catch((storageerror) => {
      loading.dismiss();
      this.alert.presentAlert("Unable to get data from storage");
    })



  }

}
