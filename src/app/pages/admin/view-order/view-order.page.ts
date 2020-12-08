import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.page.html',
    styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
    // private orderArray: any[] = [];
    private orderkey: string = "";
    //private uid: string = "";
    private tempArray: any[] = [];
    private tempArray2: any[] = [];
    private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
    private vieworderdArray: any[] = [];
    private isRecording: boolean = false;
    private matches: string[] = [];
    private searchtxt;
    private vieworderdArray1: any[] = [];
  
    constructor(
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private route: ActivatedRoute,
        public loadingController: LoadingController,
        private alert: AlertserviceService,
        private authService: ServiceService,
        private speechRecognition: SpeechRecognition) {
        this.route.queryParams.subscribe((data) => {
            this.orderkey = data.orderkey;
        });
        // this.tempArray = this.vieworderdArray;
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }
            });
        this.tempArray = this.vieworderdArray1;
        this.tempArray2 = this.viewAddressArray;
    }

    ngOnInit() {
        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('orders').valueChanges().subscribe((ordArray) => {
            loading.dismiss();
            this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
                loading.dismiss();
                this.viewAddressArray = AddressArray;
                this.AddrArray = this.viewAddressArray;

            }, (databaseError) => {
                loading.dismiss();
                this.alert.presentAlert(databaseError.message);
            })
            this.vieworderdArray = ordArray;
            this.vieworderdArray1 = ordArray;

        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })
    }

    async updateStatus(orderFirebaseKey, newStatus) {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.afData.list("orders/" + orderFirebaseKey).set("States", newStatus).then(() => {
            loading.dismiss();
            this.alert.presentAlert("states updated successfully");
        }).catch((error) => {
            loading.dismiss();
            this.alert.presentAlert(error.message);
        });
    }

    
    //Search
    startSearch() {
        this.tempArray = [];
        for (let i = 0; i < this.vieworderdArray1.length; i++) {
            if (this.vieworderdArray1[i].States.toLowerCase().startsWith(this.searchtxt.toLowerCase())) {
                this.tempArray.push(this.vieworderdArray1[i]);
            }
        }
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
                        for (let i = 0; i < this.vieworderdArray1.length; i++) {
                            if (this.vieworderdArray1[i].States.toLowerCase().startsWith(data)) {
                                this.tempArray.push(this.vieworderdArray1[i]);
                            }
                        }
                    }
                }
            ]
        });
        await alertradio.present();

    }
}





