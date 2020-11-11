import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//NavigationExtras
import { NavigationExtras } from '@angular/router';
//NavController
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { CustomerPopoverPage } from '../../popover/customer-popover/customer-popover.page';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {
  private eventArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];

  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

  // Method for retrieve event data from DB
  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('event', ref => ref.orderByChild('time')).valueChanges().subscribe((eveArray) => {
      loading.dismiss();
     // this.eventArray = eveArray;
      this.tempArray = eveArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })
  }

  //to move to details
  customereventdetails(eventkey) {

    //alert(JSON.stringify(dietitiankey)); 
    let NavExtras: NavigationExtras = {
        queryParams: eventkey
      }
    this.navCtr.navigateForward('event-details', NavExtras);
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
  
}
