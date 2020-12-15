import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { CustomerPopoverPage } from '../../popover/customer-popover/customer-popover.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ServiceService } from '../../../services/service.service';
@Component({
    selector: 'app-shop',
    templateUrl: './shop.page.html',
    styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

    private catogryArray: any[] = [
        {
            "name": "Foods",
            "value": "Foods",
            "img": "../../../../assets/icon/food.png"
        },
        {
            "name": "Machines",
            "value": "Machines",
            "img": "../../../../assets/icon/mac.png"
        }
        ,
        {
            "name": "Books",
            "value": "Books",
            "img": "../../../../assets/icon/book.png"
        }
        ,
        {
            "name": "Another",
            "value": "Another",
            "img": "../../../../assets/icon/onther.png"
        }

    ];

    private productArray: any[] = [];
    private matches: string[] = [];
    private tempArray: any[] = [];
    private tempArray1: any[] = [];
    private tempArray2: any[] = [];
    private isRecording: boolean = false;
    private searchtxt;
    private uid: string = "";
    private basketArray: any[] = [];
    private productskey;
    constructor(public alertController: AlertController,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase,
        public navCtr: NavController,
        private authService: ServiceService,
        public loadingController: LoadingController,
        private popoverController: PopoverController,
        private speechRecognition: SpeechRecognition) {
        this.tempArray = this.productArray;
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }
            });
        this.retrieveDataFromFirebase();
    }


    ngOnInit() {
        //this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });
        await loading.present();
        this.afData.list('products').valueChanges().subscribe((proArray) => {
            loading.dismiss();
            this.tempArray = proArray;
            this.productArray = proArray;
            this.filterProductData('Foods');
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })
        // let cartArray: any[] = [];

        // this.authService.getDataFromStorage().then((userdata) => {
        //     this.uid = userdata.uid;
        //     let userCartPath = "user/" + this.uid + "/cart"
        //     loading.dismiss;


        //     const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
        //         loading.dismiss;
        //         console.log(orderArray);
        //         userCartlist.unsubscribe();
        //         this.basketArray = orderArray;
        //         for (let i = 0; i < this.basketArray.length; i++) {
        //             cartArray.push(this.basketArray[i]);
        //         }
        //         alert(JSON.stringify(this.basketArray));
        //         loading.dismiss();

        //         if (this.basketArray.length == 0) {
        //             this.alert.presentAlert("Please Add your Order First");
        //         } else {
        //         let NavExtras: NavigationExtras = {
        //             //queryParams: productskey
        //         }
        //         this.navCtr.navigateForward('basket', NavExtras);
        //      }

        //     }, (databaseError) => {
        //         loading.dismiss();
        //         this.alert.presentAlert(databaseError.message);
        //     })
        // }).catch((storageerror) => {
        //     loading.dismiss();
        //     this.alert.presentAlert("Unable to get data from storage");
        // })
    }

    async getBasketArry() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });
        await loading.present();
        let cartArray: any[] = [];
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
                alert(JSON.stringify(this.basketArray));
                loading.dismiss();

                if (this.basketArray.length == 0) {
                    this.alert.presentAlert("Please Add your Order First");
                } else {
                    let NavExtras: NavigationExtras = {
                        //queryParams: productskey
                    }
                    this.navCtr.navigateForward('basket', NavExtras);
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
    async filterProductData(productskey) {

        this.tempArray = [];

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('products', ref => ref.orderByChild('category').equalTo(productskey)).valueChanges().subscribe((proArray) => {
            loading.dismiss();
            this.tempArray = proArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })
    }


    customerproductdetails(productskey) {

        let NavExtras: NavigationExtras = {
            queryParams: productskey
        }
        this.navCtr.navigateForward('product-details', NavExtras);
    }

    async basket(productskey) {
        await this.getBasketArry();

    }

    async CreatePopOver(ev: any) {
        const popover = await this.popoverController.create({
            component: CustomerPopoverPage,
            cssClass: 'my-custom-class1',
            event: ev,
            translucent: true
        });
        return await popover.present();
    }


    startSearch() {
        this.tempArray = [];
        for (let i = 0; i < this.productArray.length; i++) {
            if (this.productArray[i].ProductName.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.productArray[i]);
            }
        }
    }
    startStopListening() {
        this.isRecording = (!this.isRecording);
        if (this.isRecording) {
            let options = {
                language: "en-US",
                matches: 5
            }
            this.speechRecognition.startListening(options)
                .subscribe(
                    (matches: string[]) => {
                        this.matches = matches;

                        this.presentAlertRadio();
                    },
                    (onerror) => console.log('error:', onerror)
                )
        }
        else {
            this.speechRecognition.stopListening()
        }
    }

    async presentAlertRadio() {

        let inputsArray: any[] = [];
        this.matches.forEach(match => {
            let matchObj = {
                name: match,
                label: match,
                type: 'radio',
                value: match
            }
            inputsArray.push(matchObj);
        });
        const alertradio = await this.alertController.create({
            header: 'Select Product Name',
            inputs: inputsArray,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data: string) => {
                        this.tempArray = [];
                        for (let i = 0; i < this.productArray.length; i++) {
                            if (this.productArray[i].ProductName.toLowerCase().startsWith(data)) {
                                this.tempArray.push(this.productArray[i]);
                            }
                        }
                    }
                }
            ]
        });
        await alertradio.present();

    }
}
