import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//NavigationExtras
import { NavigationExtras } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
//NavController
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

  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController,
    private popoverController: PopoverController,
     private speechRecognition: SpeechRecognition) {
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

  // Method for retrieve data from firebase
  async retrieveDataFromFirebase() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('advice').valueChanges().subscribe((adviceArray) => {

      loading.dismiss();
      this.adviceArray = adviceArray;
      this.tempArray = adviceArray;

    }, (databaseError) => {

      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      
    })

  }

  async CreatePopOver(ev: any) {
    const popover = await this.popoverController.create({
      component:CustomerPopoverPage,
      cssClass: 'my-custom-class1',
      event: ev,
      translucent: true
    });
    return await popover.present();
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

  startSearch() {
    this.tempArray = [];
    for(let i=0; i<this.adviceArray.length;i++){
      if(this.adviceArray[i].name.toLowerCase().startsWith(this.searchtxt.toLowerCase())){
        this.tempArray.push(this.adviceArray[i]);
      }
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
            for(let i=0; i<this.adviceArray.length;i++){
              if(this.adviceArray[i].name.toLowerCase().startsWith(data.toLowerCase())){
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
