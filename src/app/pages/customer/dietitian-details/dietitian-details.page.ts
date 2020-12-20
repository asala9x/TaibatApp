import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { ActivatedRoute } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
@Component({
    selector: 'app-dietitian-details',
    templateUrl: './dietitian-details.page.html',
    styleUrls: ['./dietitian-details.page.scss'],
})
export class DietitianDetailsPage implements OnInit {

    private dietitianArray: any[] = [];
    private dieticiankey: string = "";

    constructor(public alertController: AlertController,
        private afData: AngularFireDatabase,
        private emailComposer: EmailComposer,
        private LoaderService: LoadingserviceServiceService,
        private alertservice: AlertserviceService,
        private route: ActivatedRoute) {

        this.route.queryParams.subscribe((data) => {
            this.dieticiankey = data.dietitiankey;
            this.retrieveDataFromFirebase();
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
        this.afData.list('dietitian', ref => ref.orderByChild("dietitiankey").equalTo(this.dieticiankey)).valueChanges().subscribe((dieArray) => {
            this.LoaderService.hideLoader();
            this.dietitianArray = dieArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alertservice.presentAlert(databaseError.message);
        })

    }
    sendemail() {

        this.emailComposer.open({
            to: this.dietitianArray[0].Email,
            subject: 'Dietitian',
            body: 'Hi',
        })


    }


}
