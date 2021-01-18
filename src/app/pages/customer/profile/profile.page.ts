import { Component, OnInit } from '@angular/core';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { ServiceService } from '../../../services/service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    private useroldArray: any[] = [];
    private userArray: any[] = [];
    private userlastArray: any[] = [];
    private uid: string = "";
    private tempArray2: any[] = [];
    private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
    subscribe: any;
    constructor(  public Platform: Platform,
        public navCtrl: NavController,
         private LoaderService: LoadingserviceServiceService,
        private authService: ServiceService,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase) {
            this.subscribe = this.Platform.backButton.subscribeWithPriority(666666, () => {
                    this.navCtrl.navigateForward('/customer-tab/advice');
            })
        this.tempArray2 = this.viewAddressArray;
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }


    async retrieveDataFromFirebase() {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);


        this.authService.getDataFromStorage().then((userdata) => {

            this.userlastArray = userdata;
            this.uid = userdata.uid;
            let userCartPath = "user/" + this.uid + "/Address";
            this.LoaderService.hideLoader();
            this.afData.list('user').valueChanges().subscribe((AddressArray) => {
                this.LoaderService.hideLoader();
                this.viewAddressArray = AddressArray;
                this.AddrArray = this.viewAddressArray;

            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })

        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);

        })

    }
}
