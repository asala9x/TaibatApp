import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AlertserviceService } from '../../../services/alertservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private userArray: any[] = [];

  constructor(public loadingController: LoadingController,
    private authService: ServiceService,
    private alert: AlertserviceService) {
      this.retrieveDataFromFirebase();
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
      loading.dismiss();
      this.userArray = userdata;
alert(JSON.stringify(this.userArray))
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);

    })

  }
}
