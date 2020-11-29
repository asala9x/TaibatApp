import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import{ServiceService} from '../../../services/service.service';
@Component({
  selector: 'app-customer-popover',
  templateUrl: './customer-popover.page.html',
  styleUrls: ['./customer-popover.page.scss'],
})
export class CustomerPopoverPage implements OnInit {

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
  Profile(){
    this.navCtrl.navigateRoot('/profile');
      this.popoverController.dismiss();
  }
}