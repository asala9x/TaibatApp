import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-admin-view-advice',
    templateUrl: './admin-view-advice.page.html',
    styleUrls: ['./admin-view-advice.page.scss'],
})
export class AdminViewAdvicePage implements OnInit {
    private adviceArray: any[] = [];
    private tempArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private searchtxt;
    subscribe: any;
    constructor(public Platform: Platform,
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private alert: AlertserviceService,
        private LoaderService: LoadingserviceServiceService,
        private popoverController: PopoverController,
        private speechRecognition: SpeechRecognition) {
        this.subscribe = this.Platform.backButton.subscribeWithPriority(666666, () => {
            if (this.constructor.name == "AdminViewAdvicePage") {
                if (window.confirm("Do you want to exit app ")) {
                    navigator["app"].exitApp();
                }
            }
        })
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }
            });
        this.tempArray = this.adviceArray;
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }


    async retrieveDataFromFirebase() {
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.afData.list('advice', ref => ref.orderByChild('time')).valueChanges().subscribe((advArray) => {
            this.LoaderService.hideLoader();
            this.adviceArray = advArray;
            this.tempArray = advArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async updateAdvice(adviceObj, data) {
        data.test = "Advice";

        if (data.name == "") {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        } else if (data.descripion == "") {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        }
        else {
            this.LoaderService.showLoader();



            this.afData.list('advice').update(adviceObj.advicekey, data).then(() => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert("Advice data updated successfully");
            }).catch((error) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(error.message);
            });
        }
    }

    async updateAdviceAlert(adviceObj) {
        const alertprompt = await this.alertController.create({
            header: 'Update Advice',
            cssClass: 'headerstyle',
            inputs: [
                {
                    name: 'name',
                    value: adviceObj.name,
                    type: 'text',
                    placeholder: 'Title, Required'
                },
                {
                    name: 'descripion',
                    value: adviceObj.descripion,
                    type: 'text',
                    placeholder: 'Descripion, Required'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'headerstyle',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        this.updateAdvice(adviceObj, data);
                    }
                }
            ]
        });
        await alertprompt.present();
    }


    async deleteAdvice(adviceObj) {

        this.LoaderService.showLoader();


        this.afData.list('advice').remove(adviceObj.advicekey).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Advice deleted successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(error.message);
        });

    }
    async deleteAdviceAlert(adviceObj) {
        const alert = await this.alertController.create({
            cssClass: 'headerstyle',
            header: 'Taibat App',
            message: 'Are you sure you want to delete ' + adviceObj.name + ' ?',

            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'headerstyle',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blsah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.deleteAdvice(adviceObj);
                    }
                }
            ]
        });

        await alert.present();
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
        for (let i = 0; i < this.adviceArray.length; i++) {
            if (this.adviceArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.adviceArray[i]);
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
            this.speechRecognition.startListening(options).subscribe(
                (matches: string[]) => {
                    this.matches = matches;
                    this.presentAlertRadio();
                },
                (onerror) =>
                    console.log('error:', onerror))
        }
        else {
            this.speechRecognition.stopListening()
        }
    }


    async presentAlertRadio() {
        let inputArray: any[] = [];
        this.matches.forEach(match => {
            let matcheOBJ = {
                name: match,
                label: match,
                type: 'radio',
                value: match
            }
            inputArray.push(matcheOBJ);
        });
        const alertradio = await this.alertController.create({
            header: 'Select Advice name: ',
            inputs: inputArray,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('Confirm Cancel');
                }
            },
            {
                text: 'Ok',
                handler: (data: string) => {
                    this.tempArray = [];
                    for (let i = 0; i < this.adviceArray.length; i++) {
                        if (this.adviceArray[i].name.toLowerCase().startsWith(data)) {
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
