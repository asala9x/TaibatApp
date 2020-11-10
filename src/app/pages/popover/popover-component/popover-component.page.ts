import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import{ServiceService} from '../../../services/service.service';
@Component({
  selector: 'app-popover-component',
  templateUrl: './popover-component.page.html',
  styleUrls: ['./popover-component.page.scss'],
})
export class PopoverComponentPage implements OnInit {

  constructor(public popoverController: PopoverController,
    public navCtrl: NavController,
    private storage:ServiceService) { }

  ngOnInit() {
  }
  Logout(){
    this.storage.clear();
    this.navCtrl.navigateRoot('/login');
      this.popoverController.dismiss();
  }

}
