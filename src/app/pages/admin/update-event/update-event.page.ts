import { Component, OnInit } from '@angular/core';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
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
    private minDate: string = new Date().toISOString();
    constructor(private afData: AngularFireDatabase,
        private LoaderService: LoadingserviceServiceService,
        private alert: AlertserviceService,
        private route: ActivatedRoute) {
        this.route.queryParams.subscribe((data) => {
            this.eventkey = data.eventkey;
        });
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }

    isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
    async retrieveDataFromFirebase() {
        this.LoaderService.showLoader();

        this.afData.list('event', ref => ref.orderByChild("eventkey").equalTo(this.eventkey)).valueChanges().subscribe((eveArray) => {
            this.LoaderService.hideLoader();
            this.eventArray = eveArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async updateEvent(eventArray) {
        eventArray.test = "Event";

        if(eventArray.title ==""){
            this.alert.presentAlert("Event title is Required");
        } 
        else if(eventArray.date ==""){
            this.alert.presentAlert("Event date is Required");
        }
        else if(eventArray.timer ==""){
            this.alert.presentAlert("Event time is Required");
        }
        else if(eventArray.place ==""){
            this.alert.presentAlert("Event place is Required");
        }
        else if(eventArray.price ==""){
            this.alert.presentAlert("Event price is Required");
        }
        else if(eventArray.people ==""){
            this.alert.presentAlert("Event number of people can attend is Required");
        }else if (!this.isNumber(eventArray.people)) {
            this.alert.presentAlert("Not Alawe");
        }
        else{
        this.LoaderService.showLoader();

        

        this.afData.list('event').update(eventArray.eventkey, eventArray).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Event data updated successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(error.message);
        });
    }
    }
}
