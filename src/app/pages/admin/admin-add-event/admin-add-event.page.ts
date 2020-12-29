import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
    selector: 'app-admin-add-event',
    templateUrl: './admin-add-event.page.html',
    styleUrls: ['./admin-add-event.page.scss'],
})
export class AdminAddEventPage implements OnInit {
    private eventsObj: any = {
        "title": "",
        "place": "",
        "date": "",
        "timer": "",
        "price": "",
        "people": "",
        "img": "",
        "time": ""
    }
    private base64Img: string =  "../../../assets/icon/AddImage.png";
    constructor(public actionSheetController: ActionSheetController,
        private camera: Camera,
        private afstorage: AngularFireStorage,
        private LoaderService: LoadingserviceServiceService,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService) { }

    ngOnInit() {
    }
    async addEvents() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        if (this.eventsObj.title == "") {
            this.alert.presentAlert("Please Enter Event Title");
        } else if (this.eventsObj.place == "") {
            this.alert.presentAlert("Please Enter Event Place");
        } else if (this.eventsObj.datetime == "") {
            this.alert.presentAlert("Please Enter Event DateTime");
        } else if (this.eventsObj.price == "") {
            this.alert.presentAlert("Please Enter Event Price");
        } else if (this.eventsObj.people == "") {
            this.alert.presentAlert("Please Enter  People Alawed for This Event");
        } else if (this.base64Img ==  "../../../assets/icon/AddImage.png") {
            this.alert.presentAlert("Please Upload Event Image");
        } else {

            let filename = Math.floor(Date.now() / 1000);
            let imagepath = filename + '.jpg';
            this.afstorage.ref(imagepath).putString(this.base64Img, 'data_url')
                .then((storageSuccess) => {
                    let ref = this.afstorage.ref(imagepath);
                    ref.getDownloadURL().subscribe((url) => {
                        this.eventsObj.img = url;
                        let date1 = new Date();
                        this.eventsObj.time = date1.getTime();
                        this.afData.list("event").push(this.eventsObj).then((dataresposeobj) => {
                            this.afData.list("event/" + dataresposeobj.key).set("eventkey", dataresposeobj.key).then(() => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert("Event data inserted successfully");
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

    async selectEventsImage() {
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
}
