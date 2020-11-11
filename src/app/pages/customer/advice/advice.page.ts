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
  selector: 'app-advice',
  templateUrl: './advice.page.html',
  styleUrls: ['./advice.page.scss'],
})
export class AdvicePage implements OnInit {


  private adviceArray: any[] = [];
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

  // Method for retrieve data from firebase
  async retrieveDataFromFirebase() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.afData.list('advice').valueChanges().subscribe((adviceArray,) => {

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
  
}
