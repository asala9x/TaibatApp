import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
    // private matches: string[] = [];

    private tempArray: any[] = [];
    qty: any;
    private productskey: string = "";
    private uid: string = "";
    // private finalqty =0;
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
        this.viewProductData();
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
                this.basketArray = orderArray;
                for (let i = 0; i < this.basketArray.length; i++) {
                    cartArray.push(this.basketArray[i]);
                }

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

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/cart"
            loading.dismiss;

            const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((itemArray) => {
                loading.dismiss;
                console.log(itemArray);
                userCartlist.unsubscribe();

                previousCartItmes = itemArray;
                for (let i = 0; i < previousCartItmes.length; i++) {
                    cartArray.push(previousCartItmes[i]);
                }

                let isRecordFound = false;
                let isQuatityExceeded = false

                if (orderObj.qty > this.tempArray[0].qty) {
                    loading.dismiss();
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
                                loading.dismiss();
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
                        loading.dismiss();
                        this.alert.presentAlert("Successfully Added To Cart ");
                    }).catch((err) => {
                        loading.dismiss();
                        alert("Error")
                        this.alert.presentAlert(err.message);
                        
                    });
                }
                loading.dismiss();

                
            })
        }).catch((storageerror) => {
            loading.dismiss();
            alert("Add to cart Error");

            this.alert.presentAlert("Unable to get data from storage");
        }).catch((err) => {
            alert("Add to cart Error 2");

            loading.dismiss();
            this.alert.presentAlert(err.message);
        });

    }


    // }
}
