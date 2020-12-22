import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.page.html',
    styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
    private tempArray2: any[] = [];
    private tempArray: any[] = [];
    private AddrArray: any[] = [];
    private vieworderdArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private searchtxt;

    constructor(
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private route: ActivatedRoute,
        private LoaderService: LoadingserviceServiceService,
        private alert: AlertserviceService,
        private speechRecognition: SpeechRecognition) {
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }

            });
        this.tempArray2 = this.vieworderdArray;
        this.retrieveDataFromFirebase();
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }

    async retrieveDataFromFirebase() {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.afData.list('orders').valueChanges().subscribe((ordArray) => {
            this.LoaderService.hideLoader();
            this.afData.list('user').valueChanges().subscribe((AddressArray) => {
                this.LoaderService.hideLoader();
                this.AddrArray = AddressArray;
            }, (databaseError) => {
                this.LoaderService.hideLoader();
                this.alert.presentAlert(databaseError.message);
            })
            this.vieworderdArray= ordArray.map(function(el) {
                let o:any = Object.assign({}, el);
                o.showaddress = false;
                o.showproducts=false;
                return o;
            });
            this.tempArray2 = this.vieworderdArray;
        }, (databaseError) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(databaseError.message);
        })

    }

    async updateStatus(orderFirebaseKey, newStatus) {

        this.LoaderService.showLoader();

        setTimeout(() => {
            this.LoaderService.hideLoader();
        }, 2000);

        this.afData.list("orders/" + orderFirebaseKey).set("states", newStatus).then(() => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert("states updated successfully");
        }).catch((error) => {
            this.LoaderService.hideLoader();
            this.alert.presentAlert(error.message);
        });
    }



    startSearch() {
        this.vieworderdArray = [];
        for (let i = 0; i < this.tempArray2.length; i++) {
            if (this.tempArray2[i].states.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.vieworderdArray.push(this.tempArray2[i]);
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
            header: 'Select States',
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
                        this.vieworderdArray = [];
                        for (let i = 0; i < this.tempArray2.length; i++) {
                            if (this.tempArray2[i].states.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                                this.vieworderdArray.push(this.tempArray2[i]);
                            }
                        }
                    }
                }
            ]
        });
        await alertradio.present();

    }
}





