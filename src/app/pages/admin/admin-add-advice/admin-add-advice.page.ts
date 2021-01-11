import { Component, OnInit } from '@angular/core';
import { ActionSheetController,LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
@Component({
    selector: 'app-admin-add-advice',
    templateUrl: './admin-add-advice.page.html',
    styleUrls: ['./admin-add-advice.page.scss'],
})
export class AdminAddAdvicePage implements OnInit {
    private adviceObj: any = {
        "name": "",
        "img1": "",
        "img2": "",
        "descripion": "",
        "time": ""
    }
    private imagesarray: any[] = [];
    constructor(public actionSheetController: ActionSheetController,
        private camera: Camera,
        private afstorage: AngularFireStorage,
        private LoaderService: LoadingserviceServiceService,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        private loadingController:LoadingController) { }

    ngOnInit() {
    }
    async addAdvice() {


        if (this.imagesarray.length == 0) {
            this.alert.presentAlert("select atleast one image");
        }
        else if (this.imagesarray.length < 2) {
            this.alert.presentAlert("please select 2 images");
        }
        else if (this.imagesarray.length > 2) {
            this.alert.presentAlert("you can select only two images");
        }
        else if (this.adviceObj.name == "") {
            this.alert.presentAlert("Please Enter Advice Title");
        } else if (this.adviceObj.descripion == "") {
            this.alert.presentAlert("Please Enter  Advice Description");
        }
        else if (this.imagesarray == null) {
            this.alert.presentAlert("Please Upload Advice Image");
        }
        else {


            const loading = await this.loadingController.create({
                message: 'Please wait...',
              });
              await loading.present();


            let date1 = new Date();
            this.adviceObj.time = date1.getTime();

            this.afData.list("advice").push(this.adviceObj).then((dataresposeobj) => {
                this.afData.list("advice/" + dataresposeobj.key).set("advicekey", dataresposeobj.key).then(() => {


                    let filename1 = Math.floor(Date.now() / 1000);
                    let imagepath1 = filename1 + '.jpg';
                    let tempobj: any = {};

                    this.afstorage.ref(imagepath1).putString(this.imagesarray[0], 'data_url')
                        .then((storageSuccess) => {

                            let ref1 = this.afstorage.ref(imagepath1);
                            ref1.getDownloadURL().subscribe((url) => {
                                tempobj.img1 = url


                                let filename2 = Math.floor(Date.now() / 1000);
                                let imagepath2 = filename2 + '.jpg';

                                this.afstorage.ref(imagepath2).putString(this.imagesarray[1], 'data_url')
                                    .then((storageSuccess) => {

                                        let ref2 = this.afstorage.ref(imagepath2);
                                        ref2.getDownloadURL().subscribe((url) => {
                                            tempobj.img2 = url;

                                            this.afData.list("advice").update(dataresposeobj.key, tempobj).then(() => {
                                                loading.dismiss();
                                                this.alert.presentAlert("Advice data inserted successfully");

                                                this.adviceObj.name = "";
                                                this.adviceObj.descripion = "";
                                                this.imagesarray=[];
                                            }).catch((updateerror) => {
                                                loading.dismiss();
                                                this.alert.presentAlert(updateerror.message);
                                            })

                                        });

                                    }).catch((storageError) => {
                                        loading.dismiss();
                                        this.alert.presentAlert(storageError.message);
                                    })
                            });

                        }).catch((storageError) => {
                            loading.dismiss();
                            this.alert.presentAlert(storageError.message);

                        })


                }).catch((error) => {
                    loading.dismiss();
                    this.alert.presentAlert(error.message);

                });

            }).catch((databaseError) => {
                loading.dismiss();
                this.alert.presentAlert(databaseError.messagee);

            });


        }
    }
    async selectAdviceImage() {

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
            quality: 30,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Img = 'data:image/jpeg;base64,' + imageData;
            this.imagesarray.push(base64Img);
        }, (err) => {
        });
    }


    selectImageFromGallery() {
        const options: CameraOptions = {
            quality: 30,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Img = 'data:image/jpeg;base64,' + imageData;
            this.imagesarray.push(base64Img);
        }, (err) => {
        });
    }
}
