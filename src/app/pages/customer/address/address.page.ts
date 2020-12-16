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
    // private viewAddressArray: any[] = [];
    // private AddrArray: any[] = [];
    private address: Address = {
        "area": "",
        "street": "",
        "homeNumber": "",
        "phoneNumber": "",
        "latitude": "",
        "longitude": "",
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
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/Address"
            loading.dismiss;


            const userCartlist = this.afData.object(userCartPath).valueChanges().subscribe((addressobj: Address) => {
                loading.dismiss();
                userCartlist.unsubscribe();
                this.address.area = addressobj.area;
                this.address.street = addressobj.street;
                this.address.homeNumber = addressobj.homeNumber;
                this.address.phoneNumber = addressobj.phoneNumber;
                this.address.latitude = addressobj.latitude;
                this.address.longitude = addressobj.longitude;
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


    async addAddress() {

        let phoneNumebr = this.address.phoneNumber
        if (this.address.area == "") {
            this.alert.presentAlert("Please enter Area")
        } else if (this.address.street == "") {
            this.alert.presentAlert("Please enter Street")
        } else if (this.address.homeNumber == "") {
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
                this.uid = userdata.uid;
                let userCartPath = "user/" + this.uid
                loading.dismiss();
                const userCartlist = this.afData.list(userCartPath).set("Address", this.address).then((dataresposeobj) => {
                    loading.dismiss;
                    this.alert.presentAlert("Address data inserted successfully");
                }, (databaseError) => {
                    loading.dismiss();
                    this.alert.presentAlert(databaseError.message);
                })
            }).catch((storageerror) => {
                loading.dismiss();
                this.alert.presentAlert("Unable to get data from storage");
            })
        }
    }
}
