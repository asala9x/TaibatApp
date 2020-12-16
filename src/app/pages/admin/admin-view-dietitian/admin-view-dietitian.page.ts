import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-admin-view-dietitian',
    templateUrl: './admin-view-dietitian.page.html',
    styleUrls: ['./admin-view-dietitian.page.scss'],
})
export class AdminViewDietitianPage implements OnInit {
    private dietitianArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private searchtxt;
    private tempArray: any[] = [];
    constructor(public alertController: AlertController,
        private afData: AngularFireDatabase,
        public loadingController: LoadingController,
        private alert: AlertserviceService,
        private popoverController: PopoverController,
        private speechRecognition: SpeechRecognition) {
        this.tempArray = this.dietitianArray;
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
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('dietitian').valueChanges().subscribe((dieArray) => {
            loading.dismiss();
            this.dietitianArray = dieArray;
            this.tempArray = dieArray;
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async updateDietitian(dietitianObj, data) {

        data.test = "Dietitian";

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('dietitian').update(dietitianObj.dietitiankey, data).then(() => {
            loading.dismiss();
            this.alert.presentAlert("Dietitian data updated successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });

    }
    async updateDietitianAlert(dietitianObj) {
        const alertprompt = await this.alertController.create({
            header: 'Update Dietitian',
            cssClass: 'headerstyle',
            inputs: [
                {
                    name: 'name',
                    value: dietitianObj.name,
                    type: 'text',
                    placeholder: 'Dietitian Name'
                },
                {
                    name: 'email',
                    value: dietitianObj.email,
                    type: 'email',
                    placeholder: 'Dietitian Email'
                },
                {
                    name: 'phone',
                    value: dietitianObj.phone,
                    type: 'number',
                    placeholder: 'Dietitian Phone'
                },
                {
                    name: 'descripion',
                    value: dietitianObj.descripion,
                    type: 'text',
                    placeholder: 'Descripion'
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
                        this.updateDietitian(dietitianObj, data);
                    }
                }
            ]
        });

        await alertprompt.present();
    }

    async deleteDietitian(dietitianObj) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('dietitian').remove(dietitianObj.dietitiankey).then(() => {
            loading.dismiss();
            this.alert.presentAlert("dietitian deleted successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });

    }
    async deleteDietitianAlert(dietitianObj) {
        const alert = await this.alertController.create({
            cssClass: 'headerstyle',
            header: 'Taibat App',
            message: 'Are you sure you want to delete ' + dietitianObj.name + ' ?',

            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'headerstyle',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.deleteDietitian(dietitianObj);
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
        for (let i = 0; i < this.dietitianArray.length; i++) {
            if (this.dietitianArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.dietitianArray[i]);
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
            header: 'Select Dietitian Name',
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
                        for (let i = 0; i < this.dietitianArray.length; i++) {
                            if (this.dietitianArray[i].name.toLowerCase().startsWith(data)) {
                                this.tempArray.push(this.dietitianArray[i]);
                            }
                        }
                    }
                }
            ]
        });
        await alertradio.present();

    }
}

