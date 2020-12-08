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
    qty: any;
    private productskey: string = "";
    private uid: string = "";
    // private finalqty =0;
    private basketArray: any[] = [];
    private order = {
        "ProductName": "",
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
            //this.ordercart();
            // this.finalqty = this.tempArray[0].qty

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

                // alert(JSON.stringify(this.basketArray))

                loading.dismiss();

            }, (databaseError) => {
                loading.dismiss();
                this.alert.presentAlert(databaseError.message);
            })
        }).catch((storageerror) => {
            loading.dismiss();
            this.alert.presentAlert("Unable to get data from storage");
        })


        // this.afData.list("user/" + this.uid + "/cart").valueChanges().subscribe((suceess) => {

        //     console.log(suceess);
        //     let temp2 = suceess;

        //     alert(temp2);

        //     let temp: any[] = [];
        //     for (let i = 0; i < temp2.length; i++) {
        //         console.log(temp2);
        //         temp.push(temp2[i]);

        //     }

        //     console.log(temp);



        //     console.log(suceess);
        // }, (error) => {

        // });



    }

    // private finalqty = this.tempArray[0].qty;
    //AddToCart
    async AddToCart(order) {

       
        let previousCartItmes: any[] = [];
        let cartArray: any[] = [];

        let orderObj = {
            "ProductName": null,
            "price": null,
            "qty": 0,
            "productid": this.order.productid

        };
        orderObj.ProductName = this.tempArray[0].ProductName;
        orderObj.price = this.tempArray[0].price;
        orderObj.qty = this.qty;
        orderObj.productid = this.tempArray[0].productskey;

        // alert(JSON.stringify(orderObj))
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

                // alert(JSON.stringify(cartArray))
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
                /** If the product is not found in the previous cart 
                 * add them to Cart Array
                 */
                if (!isRecordFound) {
                    isRecordFound = false;
                    cartArray.push(orderObj)
                }

                if (!isQuatityExceeded) {
                    //alert(JSON.stringify(cartArray))
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
