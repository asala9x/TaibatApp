import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  private total: string = "";
  private uid: string = "";
  private basketArray: any[] = [];
  private totalArray: any[] = [];
  private orderArr: any[] = [];
  private cartArray: any[] = [];
  constructor(private route: ActivatedRoute, public loadingController: LoadingController,
    private authService: ServiceService,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService) {


  }
  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

  async retrieveDataFromFirebase() {
    let OrderArrayTemp: any[] = [];
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.authService.getDataFromStorage().then((userdata) => {
      this.uid = userdata.uid;
      let userCartPath = "user/" + this.uid + "/cart"
      let userCartPath1 = "user/" + this.uid + "/total"
      loading.dismiss;


      const userCartlist = this.afData.list(userCartPath).valueChanges().subscribe((orderArray) => {
        loading.dismiss;
        console.log(orderArray);
        userCartlist.unsubscribe();
        this.basketArray = orderArray;
        for (let i = 0; i < this.basketArray.length; i++) {
          this.cartArray.push(this.basketArray[i]);
        }

        loading.dismiss();


      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })

      const userCartlist1 = this.afData.list(userCartPath1).valueChanges().subscribe((totArray) => {
        loading.dismiss;
        this.totalArray = totArray;
       // alert(JSON.stringify(this.totalArray))
      }, (databaseError) => {
        loading.dismiss();
        this.alert.presentAlert(databaseError.message);
      })
    }).catch((storageerror) => {
      loading.dismiss();
      this.alert.presentAlert("Unable to get data from storage");
    })


  }
  

}
