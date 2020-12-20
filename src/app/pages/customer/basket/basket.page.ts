import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-basket',
    templateUrl: './basket.page.html',
    styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
    private tempArray: any[] = [];
    private productskey: string = "";
    private uid: string = "";
    private basketArray: any[] = [];
    private orderArr: any[] = [];
    private newarray: any[] = [];
    private finaltotal = 0;
    private servicechaarge = 2;
    private totalPrice = 0;

    constructor(private afData: AngularFireDatabase,
        private LoaderService: LoadingserviceServiceService,
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

                this.tot();

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



    async deleteproduct(product) {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);


        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;

            this.basketArray.forEach((item, index) => {
                if (item === product) this.basketArray.splice(index, 1);
                this.LoaderService.hideLoader();
            });




            let userPath = "user/" + this.uid
            this.afData.list(userPath).set("cart", this.basketArray).then((itemArray) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert("Successfully Deleted");
            }).catch((err) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(err.message);
            });


            this.tot();


        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async deleteProductAlert(product) {
        const alert = await this.alertController.create({
            cssClass: 'headerstyle',
            header: 'Taibat App',
            message: 'Are you sure you want to delete ' + product.productName + ' ?',

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



    async tot() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.finaltotal = 0
        var produtPrice = 0
        for (let itemID = 0; itemID < this.basketArray.length; itemID++) {
            produtPrice = (Number(this.basketArray[itemID].price) * Number(this.basketArray[itemID].qty)); //0 = (20 + 0) = 20 * 2 = 40
            this.finaltotal += produtPrice
        }

        this.totalPrice = this.finaltotal
        this.finaltotal += Number(this.servicechaarge);

        let userPath = "user/" + this.uid

        this.afData.list(userPath).set("total", this.finaltotal).then((itemArray) => {
            this.LoaderService.hideLoader();
        }).catch((err) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(err.message);
        });

    }


    checkout() {
        if (this.basketArray.length == 0) {
            this.alert.presentAlert("Please Add your Order First");
        } else {
            this.navCtr.navigateForward('/checkout');
        }
    }
}
