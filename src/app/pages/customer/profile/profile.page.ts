import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private useroldArray: any[] = [];
  private userArray: any[] = [];
  private userlastArray: any[]=[];
  private uid: string = "";
  private tempArray2: any[] = [];
  private viewAddressArray: any[] = [];
    private AddrArray: any[] = [];
  constructor(public loadingController: LoadingController,
    private authService: ServiceService,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase) {
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


    this.authService.getDataFromStorage().then((userdata) => {
     
      this.userlastArray=userdata;
      
       loading.dismiss();
       this.afData.list('Address').valueChanges().subscribe((AddressArray) => {
        loading.dismiss();
        this.viewAddressArray = AddressArray;
        this.AddrArray = this.viewAddressArray;

    }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
    })
     
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);

    })

  }
}
