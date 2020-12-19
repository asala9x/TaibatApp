import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router'
import { ServiceService } from '../../../services/service.service';


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

    constructor(private LoaderService: LoadingserviceServiceService,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        private route: ActivatedRoute,
        private authService: ServiceService) {

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
            this.uid = userdata.uid;
            this.LoaderService.hideLoader();


            this.afData.list('orders').valueChanges().subscribe((orderArry) => {
                this.LoaderService.hideLoader();
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
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);

            })



        }).catch((storageerror) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Unable to get data from storage");
        })


    }
}