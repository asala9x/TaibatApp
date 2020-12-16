import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-update-event',
    templateUrl: './update-event.page.html',
    styleUrls: ['./update-event.page.scss'],
})
export class UpdateEventPage implements OnInit {
    private eventArray: any[] = [];
    private eventkey: string = "";
    constructor(private afData: AngularFireDatabase,
        public loadingController: LoadingController,
        private alert: AlertserviceService,
        private route: ActivatedRoute) {
        this.route.queryParams.subscribe((data) => {
            this.eventkey = data.eventkey;
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
        this.afData.list('event', ref => ref.orderByChild("eventkey").equalTo(this.eventkey)).valueChanges().subscribe((eveArray) => {
            loading.dismiss();
            this.eventArray = eveArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async updateEvent(eventArray) {
        eventArray.test = "Event";

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('event').update(eventArray.eventkey, eventArray).then(() => {
            loading.dismiss();
            this.alert.presentAlert("Event data updated successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });

    }
}
