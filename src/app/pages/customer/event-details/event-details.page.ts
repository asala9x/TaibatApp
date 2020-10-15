import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//NavController
import { NavController } from '@ionic/angular';
//Service
import { ServiceService } from '../../../services/service.service';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  //var
  private eventArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  private eventkey: string = "";

  constructor(public alertController: AlertController,
    private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    public navCtrl: NavController,
    private authService: ServiceService,
    private route: ActivatedRoute
  ) {
    //retrieve Data with email coustomer
    this.route.queryParams.subscribe((data) => {
      // alert(JSON.stringify(data));
      this.eventkey = data.eventkey;
     this.retrieveDataFromFirebase();
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


    this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
      loading.dismiss();

      this.eventArray = eveArray;
      this.tempArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);

    })

  }

  //Resave a set button
  async eventregister(NOofpeople) {
    //get number of people - 1 and save it in var
    if (NOofpeople > 0) {
      let newpeople = NOofpeople - 1;
      let newObj = { "people": newpeople };

      //lodaing
      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      await loading.present();

      //write update code to updet event table with new number of people
      this.afData.list('event').update(this.eventkey, newObj).then(() => {

        this.authService.getDataFromStorage().then((userdata) => {
          //alert(JSON.stringify(userdata))
          this.afData.list("event/" + this.eventkey + "/peopleregistered").push(userdata).then(() => {
            loading.dismiss();
            this.alert.presentAlert("you have successfully registered for the event");

          }).catch(() => {
            loading.dismiss();
            this.alert.presentAlert("Error while registering for the event");
          });

        }).catch((storageerror) => {
          loading.dismiss();
          this.alert.presentAlert("Unable to get data from storage");
        })


      }).catch((error) => {
        loading.dismiss();
        this.alert.presentAlert(error.message);
      });
    }
    else {
      this.alert.presentAlert("No slots left for this event");
    }
  }
}