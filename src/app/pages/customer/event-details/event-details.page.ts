import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
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
    private alertservice: AlertserviceService,
    public navCtrl: NavController,
    private authService: ServiceService,
    private route: ActivatedRoute
  ) {
    //retrieve Data with email coustomer
    this.route.queryParams.subscribe((data) => {
      //alert(data.key);
      this.eventkey = data.eventkey;
      this.retrieveDataFromFirebase(this.eventkey);
    });
  }

  ngOnInit() {
<<<<<<< HEAD
    this.retrieveDataFromFirebase();
=======
    // this.retrieveDataFromFirebase();
>>>>>>> 94b066977ad678bdc5097f7e0db2a4f59b418c0e
  }
  // Method for retrieve data from firebase
  async retrieveDataFromFirebase(eventkey) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.afData.list('event', ref => ref.orderByChild('eventkey').equalTo(eventkey)).valueChanges().subscribe((eveArray) => {
      loading.dismiss();
      //alert(JSON.stringify(eveArray));
      this.eventArray = eveArray;
      this.tempArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alertservice.presentAlert(databaseError.message);

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
            this.alertservice.presentAlert("you have successfully registered for the event");

          }).catch(() => {
            loading.dismiss();
            this.alertservice.presentAlert("Error while registering for the event");
          });

        }).catch((storageerror) => {
          loading.dismiss();
          this.alertservice.presentAlert("Unable to get data from storage");
        })


      }).catch((error) => {
        loading.dismiss();
        this.alertservice.presentAlert(error.message);
      });
    }
    else {
      this.alertservice.presentAlert("No slots left for this event");
    }
  }
}