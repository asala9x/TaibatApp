import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
    selector: 'app-people-register',
    templateUrl: './people-register.page.html',
    styleUrls: ['./people-register.page.scss'],
})
export class PeopleRegisterPage implements OnInit {
    private eventkey: string = "";
    private peopleRegisterdArray: any[] = [];
    constructor(
        private emailComposer: EmailComposer,
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private route: ActivatedRoute,
        private LoaderService: LoadingserviceServiceService,
        private alert: AlertserviceService,) {
        this.route.queryParams.subscribe((data) => {
            this.eventkey = data.eventkey;
        });

    }
    ngOnInit() {

        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.afData.list('event/' + this.eventkey + '/peopleregistered').valueChanges().subscribe((peopleregArray) => {
            this.peopleRegisterdArray = peopleregArray;
            this.LoaderService.hideLoader();
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }


    sendemail() {

        this.emailComposer.open({
            to: this.peopleRegisterdArray[0].email,
            subject: 'Event',
            body: 'Your registration has been accepted for this event ',
        })


    }

}

