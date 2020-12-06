import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
        public loadingController: LoadingController,
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
    // Method for retrieve data from firebase

    async retrieveDataFromFirebase() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
            loading.dismiss();
            this.eventArray = eveArray;
            this.tempArray = eveArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })

    }

    //update 
    updateEvent(eventkey) {

        if (this.checkEvent(eventkey)) {
            this.alert.presentAlert("Sorry You cannot update a event now ")
        } else {
            let NavExtras: NavigationExtras = {
                queryParams: eventkey
            }
            this.navCtrl.navigateForward('update-event', NavExtras);

        }
    }
    //delete
    async deleteEvent(eventObj) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('event').remove(eventObj.eventkey).then(() => {
            loading.dismiss();
            this.alert.presentAlert("Event deleted successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });
    }
    async deleteEventAlert(eventObj) {
        if (this.checkEvent(eventObj)) {
            this.alert.presentAlert("Sorry You cannot delete a event now ")
        } else {
            const alert = await this.alertController.create({
                header: 'Taibat App',
                message: 'Are you sure you want to delete ' + eventObj.Title + ' ?',
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
            if (this.eventArray[i].Title.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
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
    //presentAlertRadio
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
            header: 'Select Advice Name',
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
