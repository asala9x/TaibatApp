import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
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
            "img": "../../../../assets/icon/food.png",
            "selected": false
        },
        {
            "name": "Machines",
            "value": "Machines",
            "img": "../../../../assets/icon/mac.png",
            "selected": false
        }
        ,
        {
            "name": "Books",
            "value": "Books",
            "img": "../../../../assets/icon/book.png",
            "selected": false
        }
        ,
        {
            "name": "Another",
            "value": "Another",
            "img": "../../../../assets/icon/onther.png",
            "selected": false
        }
        ,
        {
            "name": "Gift",
            "value": "Gifts",
            "img": "../../../../assets/icon/gift.png",
            "selected": false
        }

    ];

    private previousindex: number = 0;

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
        private LoaderService: LoadingserviceServiceService,
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
    }
    async retrieveDataFromFirebase() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

    
        this.afData.list('products').valueChanges().subscribe((proArray) => {
            this.LoaderService.hideLoader();
            this.tempArray = proArray;
            this.productArray = proArray;

            this.filterProductData('Foods', 0);

           

        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

       
    }

    async getBasketArry() {
        
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        let cartArray: any[] = [];
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

                if (this.basketArray.length == 0) {
                    this.alert.presentAlert("Please Add your Order First");
                } else {
                    let NavExtras: NavigationExtras = {
                    }
                    this.navCtr.navigateForward('basket', NavExtras);
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
    async filterProductData(productskey, selectedindex) {


        this.catogryArray[this.previousindex].selected = false;
        this.catogryArray[selectedindex].selected = true;
        this.previousindex = selectedindex;

        this.tempArray = [];
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.afData.list('products', ref => ref.orderByChild('category').equalTo(productskey)).valueChanges().subscribe((proArray) => {
            this.LoaderService.hideLoader();
            this.tempArray = proArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
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
