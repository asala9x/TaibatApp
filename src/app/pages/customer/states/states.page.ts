import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-states',
  templateUrl: './states.page.html',
  styleUrls: ['./states.page.scss'],
})
export class StatesPage implements OnInit {

  private tempArray: any[] = [];
  private orderkey: string = "";
  private basketArray: any[]=[]

  constructor(public loadingController: LoadingController,
    private afData: AngularFireDatabase,
    private alert: AlertserviceService,
    private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    // this.retrieveDataFromFirebase();
  }


 

}