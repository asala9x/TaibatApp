import { Component, OnInit } from '@angular/core';
//Atho
import { AngularFireAuth } from '@angular/fire/auth';
//loding
import { LoadingController } from '@ionic/angular';
//alert
import { AlertController } from '@ionic/angular';
//DB
import{AngularFireDatabase}from'@angular/fire/database';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private customerDetails: any = {
    "Name": "",
    "Email": "",
    "password": "",
    "userType":"customer"
  }
  private Confirmpassword="";
  

  constructor(private atho: AngularFireAuth, private loadingController: LoadingController,
    private alertController: AlertController,private DB:AngularFireDatabase,private alert: AlertserviceService) { }

  ngOnInit() {
  }

  //method to regster user in Atho
  async  registerUserInFB(){
    //shoe lodaing
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present(); 
//validation 
// "Email":"",
//     "Password":"",
if(this.customerDetails.Name=="")
{
  loading.dismiss();
this.alert.presentAlert("plaes enter your name");
}
else if(this.customerDetails.Email=="") {
  loading.dismiss();
  this.alert.presentAlert("plaes enter your Email");
} 
else if(this.customerDetails.password=="") {
  loading.dismiss();
  this.alert.presentAlert("plaes enter your Password");
} 
else if(this.Confirmpassword=="") {
  loading.dismiss();
  this.alert.presentAlert("plaes enter Confirm password");
} 
else if(this.Confirmpassword!=this.customerDetails.password) {
  loading.dismiss();
  this.alert.presentAlert("Password and Confirmpassword is not match");
} 
else
{
 this.atho.createUserWithEmailAndPassword(this.customerDetails.Email,this.customerDetails.password)
 .then((authdata) => {
  //success 
  loading.dismiss();

  //EmailVerification
  this.atho.currentUser.then((currentUserData)=>{
    currentUserData.sendEmailVerification().then((verificationData)=>{
    //to insert data to DB
    delete this.customerDetails.password; //to delete password so it will not added in DB
    this.DB.list('user').update(authdata.user.uid, this.customerDetails).then((ifSeccess) => {
      loading.dismiss();
      this.alert.presentAlert("user registered successfuly , see your Email to verfiy");
      //this.presentAlert("user registered successfuly , see your Email to verfiy");
    }).catch((Error) => {
      loading.dismiss();
      this.alert.presentAlert(Error.message);
      //this.alert.presentAlert(Error.message); //to get error from auth
    });

    }).catch((error)=>{
     loading.dismiss();
     this.alert.presentAlert("Enable to get current user");
    // this.presentAlert("Enable to get current user");
    })
  })

}).catch((autherror) => {
  //field 
  loading.dismiss();
  this.alert.presentAlert(autherror.message);
  //this.presentAlert(autherror.message); //to get error from auth
});
}
  }

  //Massage Alert
  async presentAlert(msg) {
        const alert = await this.alertController.create({
          header: 'Talabat App',
          message: msg,
          buttons: ['OK']
        });
    
        await alert.present();
      }

}
