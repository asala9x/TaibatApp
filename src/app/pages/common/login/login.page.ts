import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

    private data: any = {
        "email": "",
        "password": ""
    }
    subscribe: any;
    constructor(public Platform: Platform,
        private fbauth: AngularFireAuth,
        private LoaderService: LoadingserviceServiceService,
        private alertController: AlertController,
        private alert: AlertserviceService,
        public navCtrl: NavController,
        public authService: ServiceService,
        public afDatabase: AngularFireDatabase) { 
            this.subscribe = this.Platform.backButton.subscribeWithPriority(666666, () => {
                if (this.constructor.name == "LoginPage") {
                        navigator["app"].exitApp();
                }
            })
        }



    ngOnInit() {
        this.data.email == "";
        this.data.password == ""
    }


    async loginWithFBdetails() {

       
        if (this.data.email == "") {
            this.alert.presentAlert("Please  Enter your Email");
        }
        else if (this.data.password == "") {
        
            this.alert.presentAlert("Please  Enter your Password");
        }
        else { 
            this.LoaderService.showLoader();
            this.fbauth.signInWithEmailAndPassword(this.data.email, this.data.password)
                .then((authData) => {
                    if (authData.user.emailVerified) {
                        let userNode = this.afDatabase.object("user/" + authData.user.uid).valueChanges()
                            .subscribe((userDatafromDB: any) => {
                                this.LoaderService.hideLoader();
                                userDatafromDB.uid = authData.user.uid;
                                this.authService.setDatatoStorage(userDatafromDB).then(() => {
                                    if (userDatafromDB.userType == 'Admin') {
                                        this.navCtrl.navigateForward('/admin-tab/admin-view-advice');
                                    } else if (userDatafromDB.userType == 'customer') {
                                        userNode.unsubscribe()
                                        this.navCtrl.navigateForward('/customer-tab/advice');
                                    }
                                }).catch((error) => {
                                    this.LoaderService.hideLoader();
                                    this.alert.presentAlert("Unable to storage data to storage");

                                })
                            }, (userdberror) => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert(userdberror.message);
                                
                            });
                    } else {
                        this.LoaderService.hideLoader();
                        this.alert.presentAlert("Please verify your mail by clicking the link which was shared by Taibat Team")
                    }
                }).catch((authError) => {
                    this.LoaderService.hideLoader();
                
                    this.alert.presentAlert("wrong Email or Password, Please Try again!! ");

                   
                })
        }
    }




    async ForgetPassword() {
        this.ForgetPasswordAlert();
    }


    async ForgetPasswordAlert() {
        const alerttest = await this.alertController.create({
            header: 'Forgot Password',
            cssClass: 'forgetpasswordalertstyle',
            subHeader: 'You will receive a link in your email to reset your password',
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    placeholder: 'Enter email'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'forgetpasswordalertstyle',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    cssClass: 'forgetpasswordalertstyle',
                    handler: (LoginDetails) => {
                        console.log(LoginDetails.email);
                        this.fbauth.sendPasswordResetEmail(LoginDetails.email).then((secc) => {
                            this.alert.presentAlert("please check your email for Rest your password");

                        }
                        ).catch((error) => {
                            this.alert.presentAlert(error.message);

                        })
                    }
                }
            ]
        });

        await alerttest.present();
    }
}

