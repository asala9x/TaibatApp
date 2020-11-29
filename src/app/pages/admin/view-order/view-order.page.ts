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
            //alert(JSON.stringify(data));
            this.orderkey = data.orderkey;
        });
        this.tempArray = this.vieworderdArray;
        this.tempArray2 = this.viewAddressArray;
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
        //this.retrieveDataFromFirebase2();
    }
    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('orders').valueChanges().subscribe((ordArray) => {
            loading.dismiss();
            this.vieworderdArray = ordArray;
            for (let i = 0; i < this.vieworderdArray.length; i++){
                this.orderArray = this.vieworderdArray[i].order
            // alert(JSON.stringify(this.vieworderdArray[i].order));
        }
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })
        // this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
        //     loading.dismiss();
        //     this.viewAddressArray = AddressArray;
        //     this.AddrArray = this.viewAddressArray;
        //     alert(JSON.stringify(this.viewAddressArray));
        // }, (databaseError) => {
        //     loading.dismiss();
        //     this.alert.presentAlert(databaseError.message);
        // })
    }
    // async retrieveDataFromFirebase2() {

    //     const loading = await this.loadingController.create({
    //         message: 'Please wait...',
    //     });
    //     await loading.present();

    //     this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
    //         loading.dismiss();
    //         this.viewAddressArray = AddressArray;
    //         this.AddrArray = this.viewAddressArray
    //         alert(JSON.stringify(this.viewAddressArray));
    //     }, (databaseError) => {
    //         loading.dismiss();
    //         this.alert.presentAlert(databaseError.message);
    //     })

    // }



    async arrive(States) {

        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        // });
        // await loading.present();
        // States.test = "progress";
        // this.vieworderdArray[0].States = "arrive"
        // let ordersObj = {
        //     "orderkey": this.vieworderdArray[0].orderkey,
        //     "States": this.vieworderdArray[0].States
        // }
        // this.afData.list('orders').update(ordersObj.orderkey, States).then(() => {
        //     loading.dismiss();
        //     this.alert.presentAlert("states updated successfully");
        // }).catch((error) => {
        //     loading.dismiss();
        //     this.alert.presentAlert(error.message);
        // });
    }

}





