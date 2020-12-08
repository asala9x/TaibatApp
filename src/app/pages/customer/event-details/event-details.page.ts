import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.page.html',
    styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
    private eventArray: any[] = [];
    private tempArray: any[] = [];
    private eventkey: string = "";
    private peopleRegisterdArray: any[] = [];
    private peopleArray: any[] = [];
    private uid: string = "";

    constructor(public alertController: AlertController,
        private afData: AngularFireDatabase,
        public loadingController: LoadingController,
        private alertservice: AlertserviceService,
        public navCtrl: NavController,
        private authService: ServiceService,
        private route: ActivatedRoute
    ) {

        this.route.queryParams.subscribe((data) => {
            this.eventkey = data.eventkey;
            this.retrieveDataFromFirebase(this.eventkey);
        });
    }

    ngOnInit() {

    }
    // Method for retrieve data from firebase
    async retrieveDataFromFirebase(eventkey) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('event', ref => ref.orderByChild('eventkey').equalTo(eventkey)).valueChanges().subscribe((eveArray) => {
            loading.dismiss();
            this.eventArray = eveArray;
            this.tempArray = eveArray;
            this.peopleArray = this.tempArray[0].peopleregistered;
        }, (databaseError) => {
            loading.dismiss();
            this.alertservice.presentAlert(databaseError.message);

        })

    }

    //Resave a set button
    async eventregister(NOofpeople) {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        if (NOofpeople > 0) {
            let newCapacity = NOofpeople - 1;
            let newCapcityObj = { "people": newCapacity };

            this.afData.list('event/' + this.eventkey + '/peopleregistered').valueChanges().subscribe((peopleregArray) => {
                this.peopleRegisterdArray = peopleregArray;
                loading.dismiss();
            }, (databaseError) => {
                loading.dismiss();
                this.alertservice.presentAlert(databaseError.message);
            })


            this.authService.getDataFromStorage().then((userdata) => {

                var isUserRegistered = false

                for (let regUser of this.peopleRegisterdArray) {
                    if (regUser.userId == userdata.uid) {
                        isUserRegistered = true
                    }
                }
                if (isUserRegistered) {
                    this.alertservice.presentAlert("You are already Registered");
                } else {
                    this.afData.list('event').update(this.eventkey, newCapcityObj).then(() => {
                    }).catch((error) => {
                        loading.dismiss();
                        this.alertservice.presentAlert(error.message);
                    });

                    let peopleObj = {
                        "userId": userdata.uid,
                        "userName": userdata.Name,
                        "userEmail": userdata.Email
                    };
                    this.afData.list("event/" + this.eventkey + "/peopleregistered").push(peopleObj).then(() => {
                        loading.dismiss();
                        this.alertservice.presentAlert("you have successfully registered for the event");

                    }).catch(() => {
                        loading.dismiss();
                        this.alertservice.presentAlert("Error while registering for the event");
                    });

                }
            }).catch((storageerror) => {
                loading.dismiss();
                this.alertservice.presentAlert("Unable to get data from storage");
            })

        }

        else {
            this.alertservice.presentAlert("No slots left for this event");
        }
    }

}
