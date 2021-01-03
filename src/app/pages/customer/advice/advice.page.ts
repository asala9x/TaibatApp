import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { CustomerPopoverPage } from '../../popover/customer-popover/customer-popover.page';


@Component({
    selector: 'app-advice',
    templateUrl: './advice.page.html',
    styleUrls: ['./advice.page.scss'],
})

export class AdvicePage implements OnInit {

    private adviceArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private tempArray: any[] = [];
    private searchtxt;
    subscribe: any;
    constructor(public Platform: Platform,
        public alertController: AlertController,
        private alert: AlertserviceService,
        private afData: AngularFireDatabase,
        public navCtr: NavController,
        private LoaderService: LoadingserviceServiceService,
        private popoverController: PopoverController,
        private speechRecognition: SpeechRecognition) {
            this.subscribe = this.Platform.backButton.subscribeWithPriority(666666, () => {
                if (this.constructor.name == "AdvicePage") {
                    if (window.confirm("Do you want to exit app ")) {
                        navigator["app"].exitApp();
                    }
                }
            })
        this.tempArray = this.adviceArray;
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

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.afData.list('advice').valueChanges().subscribe((adviceArray) => {

            this.LoaderService.hideLoader();
            this.adviceArray = adviceArray;
            this.tempArray = adviceArray;

        }, (databaseError) => {

            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);

        })

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

    startSearch() {
        this.tempArray = [];
        for (let i = 0; i < this.adviceArray.length; i++) {
            if (this.adviceArray[i].name.toLowerCase().includes(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.adviceArray[i]);
            }
           else if (this.adviceArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
            this.tempArray.push(this.adviceArray[i]);
        }
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
                        for (let i = 0; i < this.adviceArray.length; i++) {
                            if (this.adviceArray[i].name.toLowerCase().startsWith(data.toLowerCase())) {
                                this.tempArray.push(this.adviceArray[i]);
                            }
                        }
                    }
                }
            ]
        });

        await alertradio.present();
    }

}
