import { Component, OnInit } from '@angular/core';
//cantroal
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.page.html',
  styleUrls: ['./admin-tab.page.scss'],
})
export class AdminTabPage implements OnInit {

  private tabs:any={
  "dietitian":"",
  "events":"",
  "advice":"",
  "product":""}
  constructor(public navCtrl:NavController) { }

  ngOnInit() {
  }
  addingdata(){
    if(this.tabs.dietitian=='admin-tab/admin-view-dietitian'){
      this.navCtrl.navigateForward('admin-add-dietitian');
    }
    else if (this.tabs.events=='admin-tab/admin-view-event'){
      this.navCtrl.navigateForward('admin-add-event');
    }
    else if (this.tabs.advice=='admin-tab/admin-view-advice'){
      this.navCtrl.navigateForward('admin-add-advice');
    }
    else {
      this.navCtrl.navigateForward('admin-add-product');
    }
  }
}
