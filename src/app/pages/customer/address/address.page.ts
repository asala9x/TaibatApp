import { Component, OnInit } from '@angular/core';
//import Fire Storage
import { AngularFireStorage } from '@angular/fire/storage';
//imoprt loading and alert
import { LoadingController, AlertController } from '@ionic/angular';
//imoprt Fire Database
import { AngularFireDatabase } from '@angular/fire/database';
//Alertservice
//import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertserviceService } from '../../../services/alertservice.service';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
@Component({
    selector: 'app-address',
    templateUrl: './address.page.html',
    styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
    private address: any = {
        "Area": "",
        "Street": "",
        "HomeNumber": "",
        "PhoneNumber": "",
        "latitude": "",
        "longitude": "",
        "userId":""
    }
    //private uid: string = "";
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
            //alert(JSON.stringify(data));

            this.locationdata = data;
            this.address.latitude = data.latitude;
            this.address.longitude = data.longitude;
        });

    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.authService.getDataFromStorage().then((userdata)=>{
                loading.dismiss;
             this.afData.object('Address/'+userdata.uid).valueChanges().subscribe((addressobj:any) => {
                loading.dismiss();
                this.address=addressobj;
    
            }, (databaseError) => {
    
                loading.dismiss();
                this.alert.presentAlert(databaseError.message);
    
            })
        }).catch((error)=>{
            loading.dismiss();
            this.alert.presentAlert("Unable to get data from storage");
        })

       

    }

    //Method to add address to firebase
    async addAddress() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.authService.getDataFromStorage().then((userdata) => {
            this.address.userId=userdata.uid;
            this.afData.list("Address").set(userdata.uid,this.address).then((dataresposeobj) => {
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

          // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        // });
        // await loading.present();

        // this.authService.getDataFromStorage().then((userdata) => {

        //     let addressobj = {
       
        //         "Area": this.address,
        //         "Street": this.address,
        //         "HomeNumber": this.address,
        //         "PhoneNumber": this.address,
        //         "latitude": this.address,
        //         "longitude": this.address,
        //     };

        //     // alert(JSON.stringify(addressobj))

        //     loading.dismiss;


        //     this.afData.list('orders').push(this.address).then((ifSeccess) => {
        //         this.afData.list("orders/" + ifSeccess.key).set("addresskey", ifSeccess.key).then(() => {
        //             loading.dismiss();
        //             this.alert.presentAlert("address data inserted successfully");

        //         }).catch((error) => {
        //             loading.dismiss();
        //             this.alert.presentAlert(error.message);
        //             //this.presentAlert(error.message);
        //         });
        //     }).catch((Error) => {
        //         loading.dismiss();
        //         this.alert.presentAlert(Error.message);
        //     });


        // }).catch((storageerror) => {
        //     loading.dismiss();
        //     this.alert.presentAlert("Unable to get data from storage");
        // })
    }
}
