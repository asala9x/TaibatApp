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
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.page.html',
  styleUrls: ['./admin-add-product.page.scss'],
})
export class AdminAddProductPage implements OnInit {
//object for data
private productsObj: any = {
  "ProductName": "",
  "price": "",
  "category": "",
  "qty":"",
  "img": "",
  "Description": ""
}
  private base64Img: string = "../../../../assets/icon/AddImage.png";
  constructor(public actionSheetController: ActionSheetController,
    private camera: Camera,
    private afstorage: AngularFireStorage,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService) {
      this.productsObj.qty=1;
     }

  ngOnInit() {
  }
  //Method to add product to firebase
  async addProduct() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    if (this.productsObj.ProductName == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Product Name");
    }

    else if (this.productsObj.category == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Select Category");
    }
    else if (this.productsObj.Description == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Product Description");
    }
    else if (this.productsObj.price == "") {
      loading.dismiss();
      this.alert.presentAlert("Please Enter Product price");
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
                loading.dismiss();
                this.alert.presentAlert("Product data inserted successfully");
          
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
  // Action for add image for  Advices from Camera or Gallery
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
// increment product qty
incrementQty() {
  console.log(this.productsObj.qty+1);
  this.productsObj.qty += 1;
  }
  decrementQty() {
    if( this.productsObj.qty-1 < 1 ){
      this.productsObj.qty = 1
    console.log("1->"+ this.productsObj.qty);
    }else{
      this.productsObj.qty -= 1;
    console.log("2->"+ this.productsObj.qty);

    }  
  }
}
