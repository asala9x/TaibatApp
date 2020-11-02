import { Component, OnInit } from '@angular/core';
//import Fire Storage
import { AngularFireStorage } from '@angular/fire/storage';
//imoprt loading and alert
import { LoadingController, AlertController } from '@ionic/angular';
//imoprt Fire Database
import { AngularFireDatabase } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  private ordersObj: any = {
    "Area": "",
    "Street": "",
    "HomeNumber": "",
    "PhoneNumber":""
  }
  constructor(
    private afstorage: AngularFireStorage,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService) { }

  ngOnInit() {
  }
    //Method to add product to firebase
    async addOrder() {

      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      await loading.present();

              this.afData.list("orders").push(this.ordersObj).then((dataresposeobj) => {
                this.afData.list("orders/" + dataresposeobj.key).set("orderskey", dataresposeobj.key).then(() => {
                  loading.dismiss();
                  this.alert.presentAlert("Order data inserted successfully");
            
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
}
}
