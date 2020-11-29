import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonTabs } from '@ionic/angular';

@Component({
    selector: 'app-admin-tab',
    templateUrl: './admin-tab.page.html',
    styleUrls: ['./admin-tab.page.scss'],
})
export class AdminTabPage implements OnInit {
    @ViewChild('tabs', { static: false }) tabstoDisplay: IonTabs;
    private selectedTab: any;


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
