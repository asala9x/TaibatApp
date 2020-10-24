import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-people-register',
  templateUrl: './people-register.page.html',
  styleUrls: ['./people-register.page.scss'],
})
export class PeopleRegisterPage implements OnInit {

  private eventArray: any[] = [];
  private eventkey: string = "";
 private matches: string[] = []; 
  private tempArray: any[] = [];
  private peopleRegisterdArray:any[]=[];
  constructor(
    public alertController: AlertController,
    private afData: AngularFireDatabase,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    private alert: AlertserviceService) {
      this.route.queryParams.subscribe((data) => {
        //alert(JSON.stringify(data));
        this.eventkey = data.eventkey;
      });
      this.tempArray = this. peopleRegisterdArray;
    }  
  ngOnInit() {
   
    this.retrieveDataFromFirebase();
  }
  async retrieveDataFromFirebase() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
      this.afData.list('event/'+this.eventkey+'/peopleregistered').valueChanges().subscribe((peopleregArray)=>{
        this.peopleRegisterdArray=peopleregArray;  
    loading.dismiss();
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);
    })

  }
}
