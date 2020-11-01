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
  private productsArray: any[] = [];
  private tempArray: any[] = [];
  private productskey: string = "";
  private basketArray: any[] = [];

  constructor(private afData: AngularFireDatabase,
    public loadingController: LoadingController,
    private alert: AlertserviceService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe((data) => {
      //  alert(JSON.stringify(data));
      this.productskey = data.productskey;
    });
   this.tempArray = this.basketArray;
  }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }

  // async retrieveDataFromFirebase() {
  //   const loading = await this.loadingController.create({
  //     message: 'Please wait...',
  //   });
  //   await loading.present();

  //   // this.afData.list('products').valueChanges().subscribe((proArray) => {
  //   this.afData.list('products/' + this.productskey + '/orders').valueChanges().subscribe((proArray) => {
  //     this.basketArray = proArray;
  //     this.tempArray = this.basketArray;
  //     loading.dismiss();
  //   }, (databaseError) => {
  //     loading.dismiss();
  //     this.alert.presentAlert(databaseError.message);
  //   })

  // }
  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
      this.afData.list('products/'+this.productskey+'/orders').valueChanges().subscribe((orderArray)=>{
        this.basketArray=orderArray;  
        // alert(JSON.stringify(orderArray));
        
    loading.dismiss();
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }
}

