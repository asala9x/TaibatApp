import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
//sms
import { SMS } from '@ionic-native/sms/ngx';

@Component({
    selector: 'app-people-register',
    templateUrl: './people-register.page.html',
    styleUrls: ['./people-register.page.scss'],
})
export class PeopleRegisterPage implements OnInit {

    private eventArray: any[] = [];
    private eventkey: string = "";
    private matches: string[] = [];
    private tempArray: any[] = [];
    private peopleRegisterdArray: any[] = [];
    constructor(
        public alertController: AlertController,
        private afData: AngularFireDatabase,
        private route: ActivatedRoute,
        public loadingController: LoadingController,
        private alert: AlertserviceService,
        private sms: SMS) {
        this.route.queryParams.subscribe((data) => {
            //alert(JSON.stringify(data));
            this.eventkey = data.eventkey;
        });
        this.tempArray = this.peopleRegisterdArray;
    }
    ngOnInit() {

        this.retrieveDataFromFirebase();
    }
    async retrieveDataFromFirebase() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        this.afData.list('event/' + this.eventkey + '/peopleregistered').valueChanges().subscribe((peopleregArray) => {
            this.peopleRegisterdArray = peopleregArray;
            loading.dismiss();
        }, (databaseError) => {
            loading.dismiss();
            this.alert.presentAlert(databaseError.message);
        })

    }

    // send sms
    sendsms() {
        this.sms.send('97163202', 'Hello world!')
        .then(()=>{
                  console.log('sms worked')
              }).catch((err)=>{
                  alert(JSON.stringify(err))
              });
              
        //   let options:{
        //       replaceLineBreaks: true,
        //       android: {
        //         intent:'INTENT'
        //       }
        //   }
        //   this.sms.send('97163202', 'Message', options).then(()=>{
        //       console.log('sms worked')
        //   }).catch((err)=>{
        //       alert(JSON.stringify(err))
        //   });


        // var options = {

        //     replaceLineBreaks: false, // true to replace \n by a new line, false by default

        //     android: {

        //         //intent: 'INTENT' // send SMS with the native android SMS messaging

        //         intent: '' // send SMS without open any other app

        //     }

        // };


        // this.sms.send('97163202', 'SMS content', options)

        //     .then(function () {

        //         // Success! SMS was sent

        //         alert("sent");

        //     }, function (error) {

        //         // An error occurred

        //         alert("can't sent");

        //     });

    }

}

