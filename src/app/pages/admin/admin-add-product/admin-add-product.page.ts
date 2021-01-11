import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
    selector: 'app-admin-add-product',
    templateUrl: './admin-add-product.page.html',
    styleUrls: ['./admin-add-product.page.scss'],
})
export class AdminAddProductPage implements OnInit {
    private productsObj: any = {
        "productName": "",
        "price": "",
        "category": "",
        "qty": "",
        "img": "",
        "description": ""
    }
    private base64Img: string = "../../../assets/icon/AddImage.png";
    constructor(public actionSheetController: ActionSheetController,
        private camera: Camera,
        private afstorage: AngularFireStorage,
        private LoaderService: LoadingserviceServiceService,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService) {
        this.productsObj.qty = 1;
    }

    ngOnInit() {
    }
    async addProduct() {

        this.LoaderService.showLoader();

        if (this.productsObj.productName == "") {
            this.alert.presentAlert("Please Enter Product Name");
        }

        else if (this.productsObj.category == "") {
            this.alert.presentAlert("Please Select Category");
        }

        else if (this.productsObj.qty == "") {
            this.alert.presentAlert("Please Select Quantity");
        }
        else if (this.productsObj.description == "") {
            this.alert.presentAlert("Please Enter Product Description");
        }
        else if (this.productsObj.price == "") {
            this.alert.presentAlert("Please Enter Product price");
        }
        else if (this.base64Img == "../../../assets/icon/AddImage.png") {
            this.alert.presentAlert("Please Upload Product Image");
        }
        else {
            let filename = Math.floor(Date.now() / 1000);
            let imagepath = filename + '.jpg';

            this.afstorage.ref(imagepath).putString(this.base64Img, 'data_url')
                .then((storageSuccess) => {

                    let ref = this.afstorage.ref(imagepath);
                    ref.getDownloadURL().subscribe((url) => {
                        this.productsObj.img = url;
                        let date1 = new Date();
                        this.productsObj.time = date1.getTime();
                        this.afData.list("products").push(this.productsObj).then((dataresposeobj) => {
                            this.afData.list("products/" + dataresposeobj.key).set("productskey", dataresposeobj.key).then(() => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert("Product data inserted successfully");
                                this.productsObj.productName = "";
                                this.productsObj.price = "";
                                this.productsObj.category = "";
                                this.productsObj.qty = "";
                                this.productsObj.img = "";
                                this.productsObj.description = "";
                                this.base64Img = "../../../assets/icon/AddImage.png";
                            }).catch((error) => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert(error.message);
                            });

                        }).catch((databaseError) => {
                            this.LoaderService.hideLoader();
                            this.alert.presentAlert(databaseError.message);
                        });

                    });

                }).catch((storageError) => {
                    this.LoaderService.hideLoader();
                    this.alert.presentAlert(storageError.message);
                })

        }
    }

    async selectProductImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Pick Image',
            buttons: [{
                text: 'Camera',
                handler: () => {
                    this.selectImageFromCamera();
                }
            }, {
                text: 'Gallery',
                handler: () => {
                    this.selectImageFromGallery();
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }

    selectImageFromCamera() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            this.base64Img = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {

        });
    }

    selectImageFromGallery() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            this.base64Img = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {

        });
    }

    incrementQty() {
        console.log(this.productsObj.qty + 1);
        this.productsObj.qty += 1;
    }
    decrementQty() {
        if (this.productsObj.qty - 1 < 1) {
            this.productsObj.qty = 1
            console.log("1->" + this.productsObj.qty);
        } else {
            this.productsObj.qty -= 1;
            console.log("2->" + this.productsObj.qty);

        }
    }
}
