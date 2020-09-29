import { Component, OnInit } from '@angular/core';
// Action for camera 
import { ActionSheetController } from '@ionic/angular';
//import camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//import Fire Storage
import { AngularFireStorage } from '@angular/fire/storage';
//imoprt loading and alert
import { LoadingController, AlertController } from '@ionic/angular';
//imoprt Fire Database
import { AngularFireDatabase } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
  selector: 'app-admin-add-event',
  templateUrl: './admin-add-event.page.html',
  styleUrls: ['./admin-add-event.page.scss'],
})
export class AdminAddEventPage implements OnInit {
  //object for name & descripion
  private eventsObj: any = {
    "Title": "",
    "descripion": "",
    "place": "",
    "Date": "",
    "Time": "",
    "price": "",
    "people": "",
    "img": "",
    "time": ""
  }
  //decler var for image 
  private base64Img: string = "../../../assets/icon/camera.png";
  constructor(public actionSheetController: ActionSheetController,
    private camera: Camera,
    private afstorage: AngularFireStorage,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService) { }

  ngOnInit() {
  }
  //Method to add events to firebase
  async addEvents() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    if (this.eventsObj.Title == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Event Title");
    }

    else if (this.eventsObj.about == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Event About");
    }
    else if (this.eventsObj.place == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Event Place");
    }
    else if (this.eventsObj.DateTime == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Event DateTime");
    }
    else if (this.eventsObj.people == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter  People Alawed for This Event");
    }
    else {
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
                loading.dismiss();
                this.alert.presentAlert("Event data inserted successfully");
                //this.presentAlert("Event data inserted successfully");
              }).catch((error) => {
                loading.dismiss();
                this.alert.presentAlert(error.message);
                //this.presentAlert(error.message);
              });

            }).catch((databaseError) => {
              loading.dismiss();
              this.alert.presentAlert(databaseError.message);
              //this.presentAlert(databaseError.message);
            });

          });

        }).catch((storageError) => {
          loading.dismiss();
          this.alert.presentAlert(storageError.message);
          //this.presentAlert(storageError.message);
        })

    }
  }
   // Action for add image for  Event from Camera or Gallery
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
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
