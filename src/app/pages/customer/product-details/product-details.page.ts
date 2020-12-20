import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'

import { ServiceService } from '../../../services/service.service';


@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.page.html',
    styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
    private tempArray: any[] = [];
    qty: any;
    private productskey: string = "";
    private uid: string = "";
    private basketArray: any[] = [];
    private order = {
        "productName": "",
        "price": "",
        "qty": "",
        "productid": ""
    };


    constructor(public alertController: AlertController,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase,
        public navCtr: NavController,
        private LoaderService: LoadingserviceServiceService,
        private route: ActivatedRoute,
        private authService: ServiceService) {

        this.route.queryParams.subscribe((data) => {

            this.productskey = data.productskey;
            this.retrieveDataFromFirebase(this.productskey);
        });

        this.qty = 1;
    }

    ngOnInit() {
        this.viewProductData();
    }

    async retrieveDataFromFirebase(productskey) {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);


        this.afData.list('products', ref => ref.orderByChild("productskey").equalTo(productskey)).valueChanges().subscribe((proArray) => {
            this.LoaderService.hideLoader();

            this.tempArray = proArray;

        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }


    incrementQty() {
        console.log(this.qty + 1);
        this.qty += 1;
    }


    decrementQty() {
        if (this.qty - 1 < 1) {
            this.qty = 1
            console.log("1->" + this.qty);
        } else {
            this.qty -= 1;
            console.log("2->" + this.qty);
        }
    }



    async viewProductData() {
        let cartArray: any[] = [];

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);


        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/cart"
            this.LoaderService.hideLoader();


            const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
                this.LoaderService.hideLoader();
                console.log(orderArray);
                userCartlist.unsubscribe();
                this.basketArray = orderArray;
                for (let i = 0; i < this.basketArray.length; i++) {
                    cartArray.push(this.basketArray[i]);
                }

                this.LoaderService.hideLoader();

            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })
        }).catch((storageerror) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Unable to get data from storage");
        })


    }

    async AddToCart(order) {


        let previousCartItmes: any[] = [];
        let cartArray: any[] = [];

        let orderObj = {
            "productName": null,
            "price": null,
            "qty": 0,
            "productid": this.order.productid

        };
        orderObj.productName = this.tempArray[0].productName;
        orderObj.price = this.tempArray[0].price;
        orderObj.qty = this.qty;
        orderObj.productid = this.tempArray[0].productskey;
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/cart"
            this.LoaderService.hideLoader();

            const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((itemArray) => {
                this.LoaderService.hideLoader();
                console.log(itemArray);
                userCartlist.unsubscribe();

                previousCartItmes = itemArray;
                for (let i = 0; i < previousCartItmes.length; i++) {
                    cartArray.push(previousCartItmes[i]);
                }

                let isRecordFound = false;
                let isQuatityExceeded = false

                if (orderObj.qty > this.tempArray[0].qty) {
                    this.LoaderService.hideLoader();
                    isQuatityExceeded = true
                    this.alert.presentAlert("Only " + this.tempArray[0].qty + " items are available in stock");
                    return
                }

                for (let i = 0; i < cartArray.length; i++) {

                    if (cartArray[i].productid == orderObj.productid) {
                        {
                            isRecordFound = true;
                            let finalQuantity = cartArray[i].qty + orderObj.qty;
                            if (finalQuantity > this.tempArray[0].qty) {
                                this.LoaderService.hideLoader();
                                isQuatityExceeded = true
                                this.alert.presentAlert("Only " + this.tempArray[0].qty + " items are available in stock");
                            } else {
                                cartArray[i].qty += orderObj.qty;
                            }

                        }

                    }
                }
                if (!isRecordFound) {
                    isRecordFound = false;
                    cartArray.push(orderObj)
                }

                if (!isQuatityExceeded) {
                    let userPath = "/user/" + this.uid
                    this.afData.list(userPath).set("cart", cartArray).then((itemArray) => {
                        this.LoaderService.hideLoader();
                        this.alert.presentAlert("Successfully Added To Cart ");
                    }).catch((err) => {
                        this.LoaderService.hideLoader();
                        alert("Error")
                        this.alert.presentAlert(err.message);

                    });
                }
                this.LoaderService.hideLoader();


            })
        }).catch((storageerror) => {
            this.LoaderService.hideLoader();
            alert("Add to cart Error");

            this.alert.presentAlert("Unable to get data from storage");
        }).catch((err) => {
            alert("Add to cart Error 2");

            this.LoaderService.hideLoader();
            this.alert.presentAlert(err.message);
        });

    }
}
