import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
    private orderArray: any[] = [];
    private orderskey: string = "";
    private tempArray: any[] = [];
    private vieworderdArray: any[] = [];
  constructor(
    public alertController: AlertController,
    private afData: AngularFireDatabase,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    private alert: AlertserviceService) { 
        this.route.queryParams.subscribe((data) => {
            //alert(JSON.stringify(data));
            this.orderskey = data.orderskey;
        });
        this.tempArray = this.vieworderdArray;
    }

  ngOnInit() {
    this.retrieveDataFromFirebase();
}
async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
        message: 'Please wait...',
    });
    await loading.present();
    this.afData.list('orders/' + this.orderskey + '/order').valueChanges().subscribe((ordArray) => {
        this.vieworderdArray = ordArray;
        loading.dismiss();
        alert(JSON.stringify(this.vieworderdArray));
    }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
    })

}

}
