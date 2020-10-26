import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
//import fire DB
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//ActivatedRoute
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
  private tempArray: any[] = [];
  private productskey: string = "";
  constructor(private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((data) => {
      // alert(JSON.stringify(data));
      this.productskey = data.productskey;
    });
  }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    // this.afData.list('products').valueChanges().subscribe((proArray) => {
    this.afData.list('products', ref => ref.orderByChild("productskey").equalTo(this.productskey)).valueChanges().subscribe((proArray) => {
      loading.dismiss();
      this.tempArray = proArray;
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }
}
