import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingserviceServiceService } from '../../../services/loadingservice-service.service';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    private customerDetails: any = {
        "name": "",
        "email": "",
        "password": "",
        "userType": "customer"
    }
    private Confirmpassword = "";
    constructor(private atho: AngularFireAuth,
        private LoaderService: LoadingserviceServiceService,
        private DB: AngularFireDatabase,
        private alert: AlertserviceService,
        public navCtrl: NavController) { }
    ngOnInit() {
    }
    isEmailValid(search: string) {

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = re.test(search);

        if (!result) {
            return {
                'email:validation:fail': true
            }
            return null;
        }
    }
    async registerUserInFB() {

        if (this.customerDetails.name == "") {
            this.alert.presentAlert("Please enter your name");
        } else if (this.customerDetails.email == "") {
            this.alert.presentAlert("Please enter your Email");
        } else if (this.isEmailValid(this.customerDetails.email)) {
            this.alert.presentAlert("Format Your Email ");
        } else if (this.customerDetails.password == "") {
            this.alert.presentAlert("Please enter your Password");
        } else if (this.Confirmpassword == "") {
            this.alert.presentAlert("Please enter Confirm password");
        } else if (this.Confirmpassword != this.customerDetails.password) {
            this.alert.presentAlert("Password and Confirmpassword is not match");
        } else {

            this.atho.createUserWithEmailAndPassword(this.customerDetails.email, this.customerDetails.password)
                .then((authdata) => {

                    this.LoaderService.hideLoader();

                    this.atho.currentUser.then((currentUserData) => {
                        currentUserData.sendEmailVerification().then((verificationData) => {

                            delete this.customerDetails.password;
                            this.DB.list('user').update(authdata.user.uid, this.customerDetails).then((ifSeccess) => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert("User registered successfully, see your email to verify to login");
                                this.navCtrl.navigateForward('/login');
                            }).catch((Error) => {
                                this.LoaderService.hideLoader();
                                this.alert.presentAlert(Error.message);
                            });

                        }).catch((error) => {
                            this.LoaderService.hideLoader();
                            this.alert.presentAlert("Enable to get current user");
                        })
                    })
                }).catch((autherror) => {
                    this.LoaderService.hideLoader();
                    this.alert.presentAlert(autherror.message);
                });
        }
    }
}