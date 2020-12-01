import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AlertserviceService } from '../../../services/alertservice.service';
import { AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private useroldArray: any[] = [];
  private userArray: any[] = [];
  private userlastArray: any[]=[];
  private uid: string = "";
  constructor(public loadingController: LoadingController,
    private authService: ServiceService,
    private alert: AlertserviceService,
    private afData: AngularFireDatabase) {
     
     }

  ngOnInit() {
    this.retrieveDataFromFirebase();
  }


  async retrieveDataFromFirebase() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();


    this.authService.getDataFromStorage().then((userdata) => {
     
      this.userlastArray=userdata;
      
       loading.dismiss();
//       this.afData.list('user', ref => ref.orderByChild('Name')).valueChanges().subscribe((userArray) => {
//         this.useroldArray = userArray;
//         for (let i = 0; i < this.useroldArray.length; i++) {
//           if(this.uid == this.useroldArray[i].Email){
           
//            this.userlastArray=this.useroldArray[i];
// //             let j = 0;
// //             this.userArray[j] = this.useroldArray[i];
// //             this.userlastArray.push(this.userArray[j])
// // j++;
//           }
//         }
        alert(JSON.stringify(this.userlastArray))
      // }, (databaseError) => {
      //   loading.dismiss();
      //   this.alert.presentAlert(databaseError.message);
      // })
      
    }, (databaseError) => {
      loading.dismiss();
      this.alert.presentAlert(databaseError.message);

    })

  }
}
