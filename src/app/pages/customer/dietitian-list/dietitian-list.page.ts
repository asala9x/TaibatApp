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
@Component({
  selector: 'app-dietitian-list',
  templateUrl: './dietitian-list.page.html',
  styleUrls: ['./dietitian-list.page.scss'],
})
export class DietitianListPage implements OnInit {

  //  private dietitian=[
  //   {
  //     "image":"../../../../assets/icon/Dietitian4.jpg",
  //     "Name":"dietitian Name"
  //   },
  //   {
  //     "image":"../../../../assets/icon/Dietitian3.jpg",
  //     "Name":"dietitian Name"
  //   },
  //   {
  //     "image":"../../../../assets/icon/Dietitian3.jpg",
  //     "Name":"dietitian Name"
  //   },
  //   {
  //     "image":"../../../../assets/icon/Dietitian4.jpg",
  //     "Name":"dietitian Name"
  //   },
  //   {
  //     "image":"../../../../assets/icon/Dietitian3.jpg",
  //     "Name":"dietitian Name"
  //   },
  //   {
  //     "image":"../../../../assets/icon/Dietitian4.jpg",
  //     "Name":"dietitian Name"
  //   },
  // ];

  private dietitianArray: any[] = [];
  private matches: string[] = [];
  private tempArray: any[] = [];
  constructor(public alertController: AlertController,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase,
    public navCtr: NavController,
    public loadingController: LoadingController) { }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }
  // Method for retrieve data from firebase

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.afData.list('dietitian').valueChanges().subscribe((dieArray,) => {
      loading.dismiss();
      // console.log(JSON.stringify(dieArray));
      this.dietitianArray = dieArray;
      this.tempArray = dieArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
      //this.presentAlert(databaseError.message);
    })

  }
  customerdietitiandetails(dietitiankey) {

    //alert(JSON.stringify(dietitiankey)); 
    let NavExtras: NavigationExtras = {
        queryParams: dietitiankey
      }
    this.navCtr.navigateForward('dietitian-details', NavExtras);
  }

}
