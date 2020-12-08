import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';

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

    constructor(
        private fbauth: AngularFireAuth,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private alert: AlertserviceService,
        public navCtrl: NavController,
        public authService: ServiceService,
        public afDatabase: AngularFireDatabase) { }



    ngOnInit() { }

    //login
    async loginWithFBdetails() {

        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();


        if (this.data.email == "") {
            loading.dismiss();
            this.alert.presentAlert("plaes enter your Email");
        }
        else if (this.data.password == "") {
            loading.dismiss();
            this.alert.presentAlert("plaes enter your Password");
        }
        else {
            this.fbauth.signInWithEmailAndPassword(this.data.email, this.data.password)
                .then((authData) => {
                    if (authData.user.emailVerified) {
                        let userNode = this.afDatabase.object("user/" + authData.user.uid).valueChanges()
                            .subscribe((userDatafromDB: any) => {
                                loading.dismiss();
                                userDatafromDB.uid = authData.user.uid;
                                this.authService.setDatatoStorage(userDatafromDB).then(() => {
                                    if (userDatafromDB.userType == 'Admin') {
                                        this.navCtrl.navigateForward('/admin-tab/admin-view-dietitian');
                                    } else if (userDatafromDB.userType == 'customer') {
                                        userNode.unsubscribe()
                                        this.navCtrl.navigateForward('/customer-tab/advice');
                                    }
                                }).catch((error) => {
                                    this.alert.presentAlert("Unable to storage data to storage");

                                })
                            }, (userdberror) => {
                                loading.dismiss();
                                this.alert.presentAlert(userdberror.message);

                            });
                    } else {
                        loading.dismiss();
                        this.alert.presentAlert("Please verify your email")
                    }
                }).catch((authError) => {
                    loading.dismiss();
                    this.alert.presentAlert(authError.message);
                })
        }
    }



    //Forget Password
    async ForgetPassword() {
        this.ForgetPasswordAlert();
    }

    //Alert for Forget Password
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

