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
    private uid: string = "";
    private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
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


    isPhoneValid(search: string): boolean {
        let phonevalid: boolean;

        let regexp = new RegExp(/^(?=7|9.\d.\d)[0-9]{8}$/);

        phonevalid = regexp.test(search);

        return phonevalid;
    }

    //Add address to firebase
    async addAddress() {

        let phoneNumebr = this.address.PhoneNumber
        if (this.address.Area == "") {
            this.alert.presentAlert("Please enter Area")
        } else if (this.address.Street == "") {
            this.alert.presentAlert("Please enter Street")
        } else if (this.address.HomeNumber == "") {
            this.alert.presentAlert("Please enter HomeNumber")
        } else if (phoneNumebr == "") {
            this.alert.presentAlert("Please enter PhoneNumber")
        }
        else if (phoneNumebr.length < 8) {
            this.alert.presentAlert("Phone number should be 8 digit")
        }
        else if (!this.isPhoneValid(phoneNumebr)) {
            this.alert.presentAlert("Phone number should start with 9 or 7")
        }
        else {


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
                this.alert.presentAlert("Please Select Location");
            })
        }
    }
}
