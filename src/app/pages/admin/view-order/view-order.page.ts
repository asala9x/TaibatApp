import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.page.html',
    styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
    private orderArray: any[] = [];
    private orderkey: string = "";
    private uid: string = "";
    private tempArray: any[] = [];
    private tempArray2: any[] = [];
    private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
    private vieworderdArray: any[] = [];
    constructor(
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private route: ActivatedRoute,
        public loadingController: LoadingController,
        private alert: AlertserviceService,
        private authService: ServiceService) {
        this.route.queryParams.subscribe((data) => {
            this.orderkey = data.orderkey;
        });
        this.tempArray = this.vieworderdArray;
        this.tempArray2 = this.viewAddressArray;
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('orders').valueChanges().subscribe((ordArray) => {
            loading.dismiss();
            this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
                loading.dismiss();
                this.viewAddressArray = AddressArray;
                this.AddrArray = this.viewAddressArray;
            }, (databaseError) => {
                loading.dismiss();
                this.alert.presentAlert(databaseError.message);
            })
            this.vieworderdArray = ordArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })
    }

    async updateStatus(orderFirebaseKey, newStatus) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list("orders/" + orderFirebaseKey).set("States", newStatus).then(() => {
            loading.dismiss();
            this.alert.presentAlert("states updated successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });
    }
}





