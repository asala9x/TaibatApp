import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoadingController, ToastController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
import { JsonpInterceptor } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  private total: string = "";
  private uid: string = "";
  private basketArray: any[] = [];
  private tempArray: any[] = [];
  private cartArray: any[] = [];
  private productskey: string = "";
  private succArry: any[] = [];
  private newProductQty = 0;
  private newproductArry: any[] = [];
  private totalArry: any[] = [];
  private viewAddressArray: any[] = [];
  private AddrArray: any[] = [];
  constructor(private route: ActivatedRoute, public loadingController: LoadingController,
    private authService: ServiceService,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService, public navCtrl: NavController) {
    // this.retrieveDataFromFirebase();


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
      // alert(JSON.stringify(userdata))
      this.totalArry = userdata
      // this.total = userdata.total;
      //  alert(JSON.stringify(userdata))
      loading.dismiss;

      this.afData.list('products').valueChanges().subscribe((proArray) => {
        loading.dismiss();
        // console.log(JSON.stringify(dieArray));
        //  this.total = userdata.total;
        this.tempArray = proArray;

        this.afData.list('user').valueChanges().subscribe((userArray) => {
          loading.dismiss();

          this.totalArry = userArray;


          for (let i = 0; i < this.totalArry.length; i++) {
            if (this.totalArry[i].Email == userdata.Email) {
              this.total = this.totalArry[i].total;
              alert(JSON.stringify(this.totalArry[i]))
            }
          }

        }, (databaseError) => {
          loading.dismiss();
          this.alert.presentAlert(databaseError.message);
        })

        // alert(JSON.stringify(proArray))

      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })

      //get cart arry
      const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
        loading.dismiss;
        // console.log(orderArray);
        userCartlist.unsubscribe();
        this.basketArray = orderArray;
        for (let i = 0; i < this.basketArray.length; i++) {
          this.cartArray.push(this.basketArray[i]);
        }


        // this.total = userdata.total;

        loading.dismiss();


      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })


      this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
        loading.dismiss();
        this.viewAddressArray = AddressArray;
        for (let i = 0; i < this.viewAddressArray.length; i++) {
          if (this.viewAddressArray[i].userId == this.uid) {
            this.AddrArray = this.viewAddressArray[i];
          }

        }
      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })

    }).catch((storageerror) => {
      loading.dismiss();
      this.alert.presentAlert("Unable to get data from storage");
    })


  }

  // async updatyt() {

  //   const loading = await this.loadingController.create({
  //     message: 'Please wait...',
  //   });
  //   await loading.present();

  //   //product arry (pr name . pro key , qty)
  //   //qty 10 =/ 6
  //   //prodarry [ qty 6]

  //   this.afData.list('products').update(this.tempArray[0].productskey, this.tempArray).then(() => {
  //     loading.dismiss();
  //     this.alert.presentAlert("Product data updated successfully");
  //   }).catch((error) => {
  //     loading.dismiss();
  //     this.alert.presentAlert(error.message);
  //   });

  // }

  async order() {



    //get cart data from FB
    //save incoming arry to new arry
    //if array lenght = 0 (erre)
    //else
    //get address data from FB
    //save incoming arry to new arry
    //if array lenght = 0 (erre)
    //else 

    if (this.AddrArray.length == 0) {

      this.alert.presentAlert("Please Select your Location");
    } else {

      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      await loading.present();

      //get curent user data 
      this.authService.getDataFromStorage().then((userdata) => {

        let orderObj = {
          "userId": userdata.uid,
          "userName": userdata.Name,
          "userEmail": userdata.Email,
          "order": this.basketArray,
          "Total": this.total,
          "States": "in-progress",
          "img": "https://firebasestorage.googleapis.com/v0/b/taibatapp.appspot.com/o/1606025189.jpg?alt=media&token=544c4c3c-f40c-435e-ba92-2b15d1d0e7df",

        };

        // alert(JSON.stringify(orderObj))

        loading.dismiss;

        //move data from cart to orders
        this.afData.list('orders').push(orderObj).then((ifSeccess) => {
          this.afData.list("orders/" + ifSeccess.key).set("orderkey", ifSeccess.key).then(() => {
            loading.dismiss();
            // this.alert.presentAlert("Product data inserted successfully");

          }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
            //this.presentAlert(error.message);
          });
          loading.dismiss();

          for (let i = 0; i < this.basketArray.length; i++) {
            let productid = this.basketArray[i].productid
            let productQty = this.basketArray[i].qty

            let productPath = "/products/" + productid
            // alert(JSON.stringify(this.tempArray))

            for (let j = 0; j < this.tempArray.length; j++) {
              //  alert(j)
              if (productid == this.tempArray[j].productskey) {
                let newProductQty = this.tempArray[j].qty - productQty
                // alert(newProductQty)
                this.afData.list(productPath).set("qty", newProductQty);
              }

            }
          }

          // alert(JSON.stringify(this.basketArray))
          //clere cart and total
          this.total = "";
          this.basketArray = [];
          alert(this.basketArray)
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
          this.navCtrl.navigateForward('/states');
          // this.alert.presentAlert("Thank you for shopping with us. Waiting for you again");
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
}
