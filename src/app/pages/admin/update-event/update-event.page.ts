import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
})
export class UpdateEventPage implements OnInit {
  private eventArray: any[] = [];
  private eventkey: string = "";
  constructor(private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((data) => {
      // alert(JSON.stringify(data));
      this.eventkey = data.eventkey;
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
    this.afData.list('event', ref => ref.orderByChild("eventkey").equalTo(this.eventkey)).valueChanges().subscribe((eveArray) => {
      loading.dismiss();
      // console.log(JSON.stringify(advArray));
      this.eventArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      // this.presentAlert(databaseError.message);
    })

  }
  //update 
 async updateEvent(eventArray) {
     
        //eventObj.evetkey - key to update the item inside the table
        // data=>{"name":"","des":""}
        eventArray.test="Event";

        const loading = await this.loadingController.create({
          message: 'Please wait...',
        });
        await loading.present();

        this.afData.list('event').update(eventArray.eventkey,eventArray).then(()=>{
          loading.dismiss();
          this.alert.presentAlert("Event data updated successfully");
          //this.presentAlert("Event data updated successfully");
        }).catch((error)=>{
          loading.dismiss();
          this.alert.presentAlert(error.message);
          //this.presentAlert(error.message);
        });
  
}
    }
