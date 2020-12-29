import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
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
        private LoaderService: LoadingserviceServiceService,
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

    async retrieveDataFromFirebase(eventkey) {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.afData.list('event', ref => ref.orderByChild('eventkey').equalTo(eventkey)).valueChanges().subscribe((eveArray) => {
            this.LoaderService.hideLoader();
            this.eventArray = eveArray;
            this.tempArray = eveArray;
            this.peopleArray = this.tempArray[0].peopleregistered;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alertservice.presentAlert(databaseError.message);

        })

    }


    async eventregister(NOofpeople) {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        if (NOofpeople > 0) {
            let newCapacity = NOofpeople - 1;
            let newCapcityObj = { "people": newCapacity };

            this.afData.list('event/' + this.eventkey + '/peopleregistered').valueChanges().subscribe((peopleregArray) => {
                this.peopleRegisterdArray = peopleregArray;
                this.LoaderService.hideLoader();
            }, (databaseError) => {
                this.LoaderService.hideLoader();
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
                        this.LoaderService.hideLoader();
                        this.alertservice.presentAlert(error.message);
                    });

                    let peopleObj = {
                        "userId": userdata.uid,
                        "userName": userdata.name,
                        "userEmail": userdata.email
                    };
                    // if (this.checkEvent(NOofpeople)) {
                    //     this.alertservice.presentAlert("Sorry  ")
                    // } else { }
                    this.afData.list("event/" + this.eventkey + "/peopleregistered").push(peopleObj).then(() => {
                        this.LoaderService.hideLoader();
                        this.alertservice.presentAlert("you have successfully registered for the event");

                    }).catch(() => {
                        this.LoaderService.hideLoader();
                        this.alertservice.presentAlert("Error while registering for the event");
                    });

                
            }
            }).catch((storageerror) => {
                this.LoaderService.hideLoader();
                this.alertservice.presentAlert("Unable to get data from storage");
            })

        }

        else {
            this.alertservice.presentAlert("No slots left for this event");
        }
    }

    checkEvent(obj) {
        let showalert: boolean = false;
        let currentdate = new Date();
        currentdate.setHours(0, 0, 0, 0);
        let eventdate = new Date(obj.date);
        eventdate.setHours(0, 0, 0, 0);

        let dateold1 = new Date(obj.date);
        dateold1.setDate(dateold1.getDate() - 1);
        dateold1.setHours(0, 0, 0, 0);

        let dateold2 = new Date(obj.date);
        dateold2.setDate(dateold2.getDate() - 2);
        dateold2.setHours(0, 0, 0, 0);

        if (dateold2.getTime() == currentdate.getTime()
            || dateold1.getTime() == currentdate.getTime() ||
            currentdate.getTime() >= eventdate.getTime()) {
            showalert = true;
        }

        return showalert;

    }
}
