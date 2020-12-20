import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { ServiceService } from '../../../services/service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
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
    private totalArry: any[] = [];
    private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
    constructor(private route: ActivatedRoute,
        private LoaderService: LoadingserviceServiceService,
        private authService: ServiceService,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        public navCtrl: NavController) { }


    ngOnInit() {
        this.retrieveDataFromFirebase();

    }


    async retrieveDataFromFirebase() {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/cart"
            let userCartPath2 = "user/" + this.uid + "/Address"
            this.totalArry = userdata
            this.LoaderService.hideLoader();

            this.afData.list('products').valueChanges().subscribe((proArray) => {
                this.LoaderService.hideLoader();
                this.tempArray = proArray;

                this.afData.list('user').valueChanges().subscribe((userArray) => {
                    this.LoaderService.hideLoader();

                    this.totalArry = userArray;


                    for (let i = 0; i < this.totalArry.length; i++) {
                        if (this.totalArry[i].email == userdata.email) {
                            this.total = this.totalArry[i].total;

                        }
                    }

                }, (databaseError) => {
                    this.LoaderService.hideLoader();
                    this.alert.presentAlert(databaseError.message);
                })



            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })
            const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
                this.LoaderService.hideLoader();
                userCartlist.unsubscribe();
                this.basketArray = orderArray;
                for (let i = 0; i < this.basketArray.length; i++) {
                    this.cartArray.push(this.basketArray[i]);
                }

                this.LoaderService.hideLoader();


            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })


            const userCartlist2 = this.afData.list(userCartPath2).valueChanges().subscribe((AddressArray) => {
                this.LoaderService.hideLoader();
                userCartlist2.unsubscribe();
                this.viewAddressArray = AddressArray;
                for (let i = 0; i < this.viewAddressArray.length; i++) {
                    this.AddrArray = this.viewAddressArray[i];

                }
            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })

        }).catch((storageerror) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Unable to get data from storage");
        })


    }

    async order() {

        if (this.AddrArray.length == 0) {

            this.alert.presentAlert("Please Select your Location");
        } else {
            this.LoaderService.showLoader();

            setTimeout(() => {
                this.LoaderService.hideLoader();
            }, 2000);
            this.authService.getDataFromStorage().then((userdata) => {

                let orderObj = {
                    "userId": userdata.uid,
                    "userName": userdata.name,
                    "userEmail": userdata.email,
                    "order": this.basketArray,
                    "total": this.total,
                    "states": "Send",

                };



                this.LoaderService.hideLoader();

                this.afData.list('orders').push(orderObj).then((ifSeccess) => {
                    this.afData.list("orders/" + ifSeccess.key).set("orderkey", ifSeccess.key).then(() => {
                        this.LoaderService.hideLoader();


                    }).catch((error) => {
                        this.LoaderService.hideLoader();
                        this.alert.presentAlert(error.message);
                    });
                    this.LoaderService.hideLoader();

                    for (let i = 0; i < this.basketArray.length; i++) {
                        let productid = this.basketArray[i].productid
                        let productQty = this.basketArray[i].qty

                        let productPath = "/products/" + productid


                        for (let j = 0; j < this.tempArray.length; j++) {

                            if (productid == this.tempArray[j].productskey) {
                                let newProductQty = this.tempArray[j].qty - productQty

                                this.afData.list(productPath).set("qty", newProductQty);
                            }

                        }
                    }



                    this.total = "";
                    this.basketArray = [];

                    let userPath1 = "/user/" + this.uid
                    this.afData.list(userPath1).set("cart", this.basketArray).then((itemArray) => {


                        let userPath = "user/" + this.uid

                        this.afData.list(userPath).set("total", this.total).then((itemArray) => {
                            this.LoaderService.hideLoader();
                        }).catch((err) => {
                            this.LoaderService.hideLoader();
                            this.alert.presentAlert(err.message);
                        });

                        this.LoaderService.hideLoader();

                    }).catch((err) => {
                        this.LoaderService.hideLoader();
                        this.alert.presentAlert(err.message);
                    });
                    this.navCtrl.navigateForward('/states');

                }).catch((Error) => {
                    this.LoaderService.hideLoader();
                    this.alert.presentAlert(Error.message);
                });

            }).catch((storageerror) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert("Unable to get data from storage");
            })








        }


    }
}
