import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService, Address } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../services/service.service';

@Component({
    selector: 'app-address',
    templateUrl: './address.page.html',
    styleUrls: ['./address.page.scss'],
})

export class AddressPage implements OnInit {


    private address: Address = {
        "Area": "",
        "Street": "",
        "HomeNumber": "",
        "PhoneNumber": "",
        "latitude": "",
        "longitude": "",
        "userId": ""
    }


    private locationdata: any;
    constructor(
        private afstorage: AngularFireStorage,
        public loadingController: LoadingController,
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        private authService: ServiceService,
        private route: ActivatedRoute) {

        this.route.queryParams.subscribe((data) => {
            this.locationdata = data;
            this.address.latitude = data.latitude;
            this.address.longitude = data.longitude;

            this.retrieveDataFromFirebase();
        });

    }

    ngOnInit() { }


    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.authService.getDataFromStorage().then((userdata) => {

            this.afData.object('Address/' + userdata.uid).valueChanges().subscribe((addressobj: Address) => {
                loading.dismiss();
                this.address.Area = addressobj.Area;
                this.address.Street = addressobj.Street;
                this.address.HomeNumber = addressobj.HomeNumber;
                this.address.PhoneNumber = addressobj.PhoneNumber;
                this.address.latitude = addressobj.latitude;
                this.address.longitude = addressobj.longitude;
                this.address.userId = addressobj.userId;

            }, (databaseError) => {

                loading.dismiss();
                this.alert.presentAlert(databaseError.message);

            })
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert("Unable to get data from storage");
        })
    }



    //Add address to firebase
    async addAddress() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.authService.getDataFromStorage().then((userdata) => {
            this.address.userId = userdata.uid;
            this.afData.list("Address").set(userdata.uid, this.address).then((dataresposeobj) => {
                loading.dismiss();
                this.alert.presentAlert("Address data inserted successfully");
            }).catch((databaseError) => {
                loading.dismiss();
                this.alert.presentAlert(databaseError.message);
            });
        }).catch((storageerror) => {
            loading.dismiss();
            this.alert.presentAlert("Unable to get data from storage");
        })
    }
}
