import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { CustomerPopoverPage } from '../../popover/customer-popover/customer-popover.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
@Component({
    selector: 'app-dietitian-list',
    templateUrl: './dietitian-list.page.html',
    styleUrls: ['./dietitian-list.page.scss'],
})
export class DietitianListPage implements OnInit {

    private dietitianArray: any[] = [];
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
        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);
        this.afData.list('dietitian').valueChanges().subscribe((dieArray,) => {
            this.LoaderService.hideLoader();
            this.dietitianArray = dieArray;
            this.tempArray = dieArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);

        })

    }


    customerdietitiandetails(dietitiankey) {
        let NavExtras: NavigationExtras = {
            queryParams: dietitiankey
        }
        this.navCtr.navigateForward('dietitian-details', NavExtras);
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
        for (let i = 0; i < this.dietitianArray.length; i++) {
            if (this.dietitianArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.dietitianArray[i]);
            }
            //  if (this.dietitianArray[i].name.toLowerCase().includes(this.searchtxt.toLowerCase())) {
            //     this.tempArray.push(this.dietitianArray[i]);
            // }
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
                            if (this.dietitianArray[i].name.toLowerCase().startsWith(data.toLowerCase())) {
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
