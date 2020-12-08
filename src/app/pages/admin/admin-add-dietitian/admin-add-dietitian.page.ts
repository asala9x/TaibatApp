import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
    selector: 'app-admin-add-dietitian',
    templateUrl: './admin-add-dietitian.page.html',
    styleUrls: ['./admin-add-dietitian.page.scss'],
})
export class AdminAddDietitianPage implements OnInit {
    private dietitianObj: any = {
        "name": "",
        "descripion": "",
        "phone": "",
        "email": "",
        "img": ""
    }
    private base64Img: string = "../../../../assets/icon/camera.png";
    private tempbase64Img: string = "https://firebasestorage.googleapis.com/v0/b/taibatapp.appspot.com/o/defultdietitian.png?alt=media&token=39c99615-2dd1-4c4e-b46d-0d6b73cf4d40";
    constructor(public actionSheetController: ActionSheetController,
        private camera: Camera,
        private afstorage: AngularFireStorage,
        public loadingController: LoadingController,
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService) { }
    ngOnInit() {
    }

    isPhoneValid(search: string): boolean {
        let phonevalid: boolean;

        let regexp = new RegExp(/^(?=7|9.\d.\d)[0-9]{8}$/);

        phonevalid = regexp.test(search);

        return phonevalid;
    }

    //Method to add Dietitian to firebase
    async addDietitian() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        if (this.dietitianObj.name == "") {
            this.alert.presentAlert("Please Enter Dietitian Name");
        } else if (this.dietitianObj.descripion == "") {
            this.alert.presentAlert("Please Enter Dietitian Descripion");
        } else if (this.dietitianObj.phone == "") {
            this.alert.presentAlert("Please Enter Dietitian Phone Number");
        } else if (this.dietitianObj.phone == "") {
            this.alert.presentAlert("Please enter PhoneNumber")
        }
        else if (this.dietitianObj.phone.length < 8) {
            this.alert.presentAlert("Phone number should be 8 digit")
        }
        else if (!this.isPhoneValid(this.dietitianObj.phone)) {
            this.alert.presentAlert("Phone number should start with 9 or 7")
        } else if (this.dietitianObj.email == "") {
            this.alert.presentAlert("Please Enter Dietitian Email");
        } else if (this.base64Img == "../../../../assets/icon/camera.png") {
            await loading.present();
            this.dietitianObj.img = this.tempbase64Img;
            this.afData.list("dietitian").push(this.dietitianObj).then((dataresposeobj) => {
                this.afData.list("dietitian/" + dataresposeobj.key).set("dietitiankey", dataresposeobj.key).then(() => {
                    loading.dismiss();
                    this.alert.presentAlert("Dietitian data inserted successfully");
                }).catch((error) => {
                    loading.dismiss();
                    this.alert.presentAlert(error.message);
                });
            }).catch((storageError) => {
                loading.dismiss();
                this.alert.presentAlert(storageError.message);
            });
        }
        else {
            let filename = Math.floor(Date.now() / 1000);
            let imagepath = filename + '.jpg';
            this.afstorage.ref(imagepath).putString(this.base64Img, 'data_url')
                .then((storageSuccess) => {
                    let ref = this.afstorage.ref(imagepath);
                    ref.getDownloadURL().subscribe((url) => {
                        this.dietitianObj.img = url;
                        this.afData.list("dietitian").push(this.dietitianObj).then((dataresposeobj) => {
                            this.afData.list("dietitian/" + dataresposeobj.key).set("dietitiankey", dataresposeobj.key).then(() => {
                                loading.dismiss();
                                this.alert.presentAlert("Dietitian data inserted successfully");
                            }).catch((error) => {
                                loading.dismiss();
                                this.alert.presentAlert(error.message);
                            });
                        }).catch((databaseError) => {
                            loading.dismiss();
                            this.alert.presentAlert(databaseError.message);
                        });
                    });
                }).catch((storageError) => {
                    loading.dismiss();
                    this.alert.presentAlert(storageError.message);
                })
        }
    }
    // Action for add image for  Advices from Camera or Gallery
    async selectDietitianImage() {
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
    //Method camera to  open it
    selectImageFromCamera() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            this.base64Img = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            // Handle error
        });
    }
    //Method gallery to  open it
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
            // Handle error
        });
    }
}
