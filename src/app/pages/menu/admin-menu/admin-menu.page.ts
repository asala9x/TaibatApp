import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import{ServiceService} from '../../../services/service.service';
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.page.html',
  styleUrls: ['./admin-menu.page.scss'],
})
export class AdminMenuPage implements OnInit {

  constructor(public navCtrl: NavController,
    private storage:ServiceService,
    private alert: AlertserviceService) { }

  ngOnInit() {
  }
  Logout(){
    this.storage.clear();
this.navCtrl.navigateRoot('/login');
  }
}
