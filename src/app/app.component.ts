import { Component } from '@angular/core';
import { Platform,NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from '../../node_modules/rxjs/';
import { ServiceService } from '../app/services/service.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    showSplash = true;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authService: ServiceService,
        private navCtrl:NavController
    ) {
        this.initializeApp();
    }

    initializeApp() {

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.authService.authenticationState.subscribe(state => {
                if (state) {
                    this.authService.getDataFromStorage().then(data=>{
                        if(data.userType=='Admin'){
                            this.navCtrl.navigateForward('admin-tab/admin-view-advice');
                            this.splashScreen.hide();
                        }else{
                            this.navCtrl.navigateForward('customer-tab/advice');
                            this.splashScreen.hide();
                        }
                    }).catch((error)=>{
                        this.navCtrl.navigateForward('welcome');
                        this.splashScreen.hide();
                    })
                }else{
                    this.navCtrl.navigateForward('welcome');
                    this.splashScreen.hide();
                }
                   
            });

           
            timer(3000).subscribe(() =>
                this.showSplash = true)
        });
    }
}
