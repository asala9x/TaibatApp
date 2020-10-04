import { Component, OnInit, ViewChild } from '@angular/core';
//cantroal
import { NavController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.page.html',
  styleUrls: ['./admin-tab.page.scss'],
})
export class AdminTabPage implements OnInit {
//CurrentTab static statm
  @ViewChild('tabs', { static: false }) tabstoDisplay: IonTabs;
  //declear CurrentTab
  private selectedTab: any;

  // private tabs: any = {
  //   "dietitian": "",
  //   "events": "",
  //   "advice": "",
  //   "product": ""
  // }


  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }



  setCurrentTab() {
    this.selectedTab = this.tabstoDisplay.getSelected();
  }

  addingdata() {
    if (this.selectedTab == 'admin-view-dietitian') {
      this.navCtrl.navigateForward('admin-add-dietitian');
    }
    else if (this.selectedTab == 'admin-view-event') {
      this.navCtrl.navigateForward('admin-add-event');
    }
    else if (this.selectedTab == 'admin-view-advice') {
      this.navCtrl.navigateForward('admin-add-advice');
    }
    else {
      this.navCtrl.navigateForward('admin-add-product');
    }
  }
}
