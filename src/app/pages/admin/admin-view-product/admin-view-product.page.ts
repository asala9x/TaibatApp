import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-admin-view-product',
    templateUrl: './admin-view-product.page.html',
    styleUrls: ['./admin-view-product.page.scss'],
})
export class AdminViewProductPage implements OnInit {
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
    private isRecording: boolean = false;
    private searchtxt;
    constructor(public alertController: AlertController,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase,
        public navCtr: NavController,
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
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('products').valueChanges().subscribe((proArray) => {
            loading.dismiss();
            this.productArray = proArray;
            this.tempArray = proArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
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

    async deleteProduct(productObj) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('products').remove(productObj.productskey).then(() => {
            loading.dismiss();
            this.alert.presentAlert("Product deleted successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });

    }
    async deleteProductAlert(productObj) {
        const alert = await this.alertController.create({
            cssClass: 'headerstyle',
            header: 'Taibat App',
            message: 'Are you sure you want to delete ' + productObj.productName + ' ?',

            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'headerstyle',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.deleteProduct(productObj);
                    }
                }
            ]
        });
        await alert.present();
    }


    async updateProduct(productObj, data) {
        data.test = "Product";

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('products').update(productObj.productskey, data).then(() => {
            loading.dismiss();
            this.alert.presentAlert("Product data updated successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });
    }
    async updateProductAlert(productObj) {
        const alertprompt = await this.alertController.create({
            header: 'Update Product',
            cssClass: 'headerstyle',
            inputs: [
                {
                    name: 'productName',
                    value: productObj.productName,
                    type: 'text',
                    placeholder: 'Product Name'
                },
                {
                    name: 'price',
                    value: productObj.price,
                    type: 'text',
                    placeholder: 'Product Price'
                },
                {
                    name: 'category',
                    value: productObj.category,
                    type: 'text',
                    placeholder: 'Product category'
                },
                {
                    name: 'qty',
                    value: productObj.qty,
                    type: 'text',
                    placeholder: 'Product qty'
                },
                {
                    name: 'description',
                    value: productObj.description,
                    type: 'text',
                    placeholder: 'Product Description'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'headerstyle',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        this.updateProduct(productObj, data);
                    }
                }
            ]
        });

        await alertprompt.present();
    }

    async CreatePopOver(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverComponentPage,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    startSearch() {
        this.tempArray = [];
        for (let i = 0; i < this.productArray.length; i++) {
            if (this.productArray[i].category.toLowerCase().startsWith(this.searchtxt.toLowerCase()) || this.productArray[i].productName.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
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


    viewOrder(uid) {
        let NavExtras: NavigationExtras = {
            queryParams: uid
        }
        this.navCtr.navigateForward('view-order', NavExtras);
    }

}