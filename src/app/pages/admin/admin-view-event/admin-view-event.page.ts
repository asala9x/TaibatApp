import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-admin-view-event',
    templateUrl: './admin-view-event.page.html',
    styleUrls: ['./admin-view-event.page.scss'],
})
export class AdminViewEventPage implements OnInit {
    private eventArray: any[] = [];
    private matches: string[] = [];
    private tempArray: any[] = [];
    private isRecording: boolean = false;
    private searchtxt;
    constructor(public alertController: AlertController,
        private afData: AngularFireDatabase,
        private LoaderService: LoadingserviceServiceService,
        private alert: AlertserviceService,
        public navCtrl: NavController,
        private popoverController: PopoverController,
        private speechRecognition: SpeechRecognition) {
        this.tempArray = this.eventArray;
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }
            });
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }


    async retrieveDataFromFirebase() {
    

        this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
            this.LoaderService.hideLoader();
            this.eventArray = eveArray;
            this.tempArray = eveArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }


    updateEvent(eventkey) {

        if (this.checkEvent(eventkey)) {
            this.alert.presentAlert("Sorry You cannot update the event if the date is over")
        } else {
            let NavExtras: NavigationExtras = {
                queryParams: eventkey
            }
            this.navCtrl.navigateForward('update-event', NavExtras);

        }
    }

    async deleteEvent(eventObj) {

        this.LoaderService.showLoader();

       
        this.afData.list('event').remove(eventObj.eventkey).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Event deleted successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(error.message);
        });
    }


    async deleteEventAlert(eventObj) {
        if (this.checkEvent(eventObj)) {
            this.alert.presentAlert("Sorry You cannot delete a event now ")
        } else {
            const alert = await this.alertController.create({
                header: 'Taibat App',
                message: 'Are you sure you want to delete ' + eventObj.title + ' ?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'headerstyle',
                        handler: (blah) => {
                            console.log('Confirm Cancel: blah');
                        }
                    }, {
                        text: 'Ok',
                        handler: () => {
                            this.deleteEvent(eventObj);
                        }
                    }
                ]
            });
            await alert.present();
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


    peopleRegistr(eventkey) {
        let NavExtras: NavigationExtras = {
            queryParams: eventkey
        }
        this.navCtrl.navigateForward('people-register', NavExtras);
    }


    async CreatePopOver(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverComponentPage,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    startSearch() {
        this.tempArray = [];
        for (let i = 0; i < this.eventArray.length; i++) {
            if (this.eventArray[i].title.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.eventArray[i]);
            }
           else if (this.eventArray[i].title.toLowerCase().includes(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.eventArray[i]);
            }
        }
    }

    
    startStopListening() {
        this.isRecording = (!this.isRecording);
        if (this.isRecording) {
            let options = {
                language: "en-US",
                matches: 5
            }
            this.speechRecognition.startListening(options)
                .subscribe(
                    (matches: string[]) => {
                        this.matches = matches;

                        this.presentAlertRadio();
                    },
                    (onerror) => console.log('error:', onerror)
                )
        }
        else {
            this.speechRecognition.stopListening()
        }
    }

    async presentAlertRadio() {

        let inputsArray: any[] = [];
        this.matches.forEach(match => {
            let matchObj = {
                name: match,
                label: match,
                type: 'radio',
                value: match
            }
            inputsArray.push(matchObj);
        });
        const alertradio = await this.alertController.create({
            header: 'Select Event Name',
            inputs: inputsArray,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data: string) => {
                        this.tempArray = [];
                        for (let i = 0; i < this.eventArray.length; i++) {
                            if (this.eventArray[i].Title.toLowerCase().startsWith(data)) {
                                this.tempArray.push(this.eventArray[i]);
                            }
                        }
                    }
                }
            ]
        });
        await alertradio.present();

    }

}
