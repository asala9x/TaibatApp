import { Component, OnInit } from '@angular/core';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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
    setMessage: any;
    constructor(public alertController: AlertController,
        public toastCtrl: ToastController,
        private afData: AngularFireDatabase,
        private LoaderService: LoadingserviceServiceService,
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
        this.LoaderService.showLoader();


        this.afData.list('dietitian').valueChanges().subscribe((dieArray) => {
            this.LoaderService.hideLoader();
            this.dietitianArray = dieArray;
            this.tempArray = dieArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }
    isPhoneValid(search: string): boolean {
        let phonevalid: boolean;

        let regexp = new RegExp(/^(?=7|9.\d.\d)[0-9]{8}$/);

        phonevalid = regexp.test(search);

        return phonevalid;
    }


    async updateDietitian(dietitianObj, data) {

        data.test = "Dietitian";

        this.LoaderService.showLoader();

     
        this.afData.list('dietitian').update(dietitianObj.dietitiankey, data).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("Dietitian data updated successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(error.message);
        });
       
    }
    async showErrorToast(data: any) {
        const toast = await this.toastCtrl.create({
            message: data,
            duration: 2000
        });
        toast.present();
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
                        if (data.name == "") {
                           // this.showErrorToast('Please Enter Dietitian Name');
                           this.alert.alertController.dismiss('<b style="color: red;">Enter valid email id.</b>');
                        } else if (data.descripion == "") {
                            this.showErrorToast('Please Enter Dietitian Description');
                        } else if (data.phone == "") {
                            this.showErrorToast('Please Enter Dietitian Phone Number');
                        } else if (data.phone.length < 8) {

                            this.showErrorToast('Phone number should be 8 digit');
                        } else if (!this.isPhoneValid(data.phone)) {
                            this.showErrorToast('Phone number should start with 9 or 7');
                        } else if (data.email == "") {
                            this.showErrorToast('Please Enter Dietitian Email');
                        } else {
                            this.updateDietitian(dietitianObj, data);
                        }
                    }
                }
            ]
        });

        await alertprompt.present();
    }

    async deleteDietitian(dietitianObj) {

        this.LoaderService.showLoader();

        
        this.afData.list('dietitian').remove(dietitianObj.dietitiankey).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("dietitian deleted successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
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

