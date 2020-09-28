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
  //decler var for image 
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
  //Method to add Dietitian to firebase
  async addDietitian() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    if (this.dietitianObj.name == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Dietitian Name");
    }

    else if (this.dietitianObj.descripion == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Dietitian Descripion");
    }
    else if (this.dietitianObj.phone == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Dietitian Phone Number");
    }
    else if (this.dietitianObj.email == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Dietitian Email");
    }
    else if (this.base64Img == "../../../../assets/icon/camera.png") {

      this.dietitianObj.img = this.tempbase64Img;
      this.afData.list("dietitian").push(this.dietitianObj).then((dataresposeobj) => {

        this.afData.list("dietitian/" + dataresposeobj.key).set("dietitiankey", dataresposeobj.key).then(() => {
          loading.dismiss();
          this.alert.presentAlert("Dietitian data inserted successfully");
          //this.presentAlert("Dietitian data inserted successfully");

        }).catch((error) => {
          loading.dismiss();
          this.alert.presentAlert(error.message);
          // this.presentAlert(storageError.message);
        });

      }).catch((storageError) => {
        loading.dismiss();
        this.alert.presentAlert(storageError.message);
        // this.presentAlert(storageError.message);
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
                //this.presentAlert("Dietitian data inserted successfully");
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
          // this.presentAlert(storageError.message);
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
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
