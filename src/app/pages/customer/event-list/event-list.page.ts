import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { CustomerPopoverPage } from '../../popover/customer-popover/customer-popover.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.page.html',
    styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {
    private eventArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private tempArray: any[] = [];
    private searchtxt;
    constructor(public alertController: AlertController,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase,
        public navCtr: NavController,
        private LoaderService: LoadingserviceServiceService,
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

    // Method for retrieve event data from DB
    async retrieveDataFromFirebase() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
            this.LoaderService.hideLoader();
            this.eventArray = eveArray;
            this.tempArray = eveArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })
    }

    //to move to details
    customereventdetails(eventkey) {
        let NavExtras: NavigationExtras = {
            queryParams: eventkey
        }
        this.navCtr.navigateForward('event-details', NavExtras);
    }
    async CreatePopOver(ev: any) {
        const popover = await this.popoverController.create({
            component: CustomerPopoverPage,
            cssClass: 'my-custom-class1',
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
        }
    }


    customereventsdetails(eventkey) {

        let NavExtras: NavigationExtras = {
            queryParams: eventkey
        }
        this.navCtr.navigateForward('customer-events-details', NavExtras);
    }
    //startStopListening
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
                            if (this.eventArray[i].title.toLowerCase().startsWith(data.toLowerCase())) {
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
