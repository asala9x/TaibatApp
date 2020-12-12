import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router'
import { ServiceService } from '../../../services/service.service';
import { of } from 'rxjs';

@Component({
    selector: 'app-states',
    templateUrl: './states.page.html',
    styleUrls: ['./states.page.scss'],
})
export class StatesPage implements OnInit {

    private orderArray: any[] = [];
    private orderuserArray: any[] = [];
    private lastorderuserArray: any[] = [];

    private uid: string = "";

    constructor(public loadingController: LoadingController,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        private route: ActivatedRoute,
        private authService: ServiceService) {

    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }

    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.authService.getDataFromStorage().then((userdata) => {
            this.uid = userdata.uid;
            loading.dismiss;


            //get order data
            this.afData.list('orders').valueChanges().subscribe((orderArry) => {
                loading.dismiss();
                this.orderArray = orderArry;

                for (let i = 0; i < this.orderArray.length; i++) {
                    if (this.uid == this.orderArray[i].userId) {
                        let j = 0;
                        this.orderuserArray[j] = this.orderArray[i];
                        this.lastorderuserArray.push(this.orderuserArray[j])

                        j++;

                    }
                }


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