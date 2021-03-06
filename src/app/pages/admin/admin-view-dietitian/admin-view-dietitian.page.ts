import { Component, OnInit } from '@angular/core';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentPage } from '../../popover/popover-component/popover-component.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AlertController } from '@ionic/angular';

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
     isEmailValid(search: string){
 
    	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = re.test(search);
        
        if (!result) {
        	return {
        		'email:validation:fail' : true
            }
            return null;
        }
    }
    async updateDietitian(dietitianObj, data) {

        data.test = "Dietitian";

        if (data.name == "" ) {
           this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        } else if (data.descripion == "") {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        } else if (data.phone == "") {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        }  else if (data.email=="") {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        }else if (this.isEmailValid(data.email)) {
            this.alert.presentAlert("Sorry We are unable to update , you are missing one or more data, Please update with correct information");
        }
        else if(data.phone.length < 8){
            this.alert.presentAlert("Sorry We are unable to update , Phone number should be 8 digit, Please update with correct information"); 
        }
        else if(!this.isPhoneValid(data.phone)){
            this.alert.presentAlert("Sorry We are unable to update , Phone number should start with 9 or 7, Please update with correct information"); 
        }
        else { 

        this.LoaderService.showLoader();
      
            this.afData.list('dietitian').update(dietitianObj.dietitiankey, data).then(() => {
                this.LoaderService.hideLoader();
                
                this.alert.presentAlert("Dietitian data updated successfully");
            }).catch((error) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(error.message);
            });
       }
    }

    private errormasge;
    async updateDietitianAlert(dietitianObj) {
        const alertprompt = await this.alertController.create({
            header: 'Update Dietitian',
            cssClass: 'headerstyle',
            inputs: [
                {
                    name: 'name',
                    value: dietitianObj.name,
                    type: 'text', 
                    placeholder: 'name, Required'
                },
                {
                    name: 'email',
                    value: dietitianObj.email,
                    type: 'email',
                    placeholder: 'Required & should be formatting'
                },
                {
                    name: 'phone',
                    value: dietitianObj.phone,
                    type: 'tel',
                    placeholder: 'Required, start with 9or7 & 8 digit'
                },
                {
                    name: 'descripion',
                    value: dietitianObj.descripion,
                    type: 'text',
                    placeholder: 'descripion, Required'
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
            if (this.dietitianArray[i].name.toLowerCase().includes(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.dietitianArray[i]);
            }
            else if (this.dietitianArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
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
