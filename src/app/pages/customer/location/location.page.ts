import { Component, OnInit } from '@angular/core';
//
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { AlertserviceService } from '../../../services/alertservice.service';
//NavigationExtras
import { NavigationExtras } from '@angular/router';
//NavController
import { NavController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { ServiceService } from '../../../services/service.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
declare var google;

@Component({
    selector: 'app-location',
    templateUrl: './location.page.html',
    styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

    @ViewChild('map', { static: false }) mapElement: ElementRef;
    map: any;
    private locationdata = {
        "longitude": 0,
        "latitude": 0
    }
    // "source": "",
    // "destination": ""


    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    // private userdata:any={};


    constructor(private geolocation: Geolocation,
        private route: ActivatedRoute,
        private alert: AlertserviceService, public navCtrl: NavController,
        public loadingController: LoadingController,
        private authService: ServiceService,
        private afData: AngularFireDatabase,) {
        // this.route.queryParams.subscribe(receiveddata=>{
        //     this.userdata=receiveddata;
        // });

    }

    ngOnInit() {


        this.geolocation.getCurrentPosition(
            {
                maximumAge: 1000,
                timeout: 5000,
                enableHighAccuracy: true
            }
        ).then((resp) => {

            this.locationdata.latitude = resp.coords.latitude;
            this.locationdata.longitude = resp.coords.longitude;

           
                let latlng = { lat: resp.coords.latitude, lng:resp.coords.longitude };
                let mapOptions = {
                    center: latlng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                this.directionsDisplay.setMap(this.map);
           



        }).catch((error) => {
            //alert('Error getting location'+JSON.stringify(error));
            alert('Error getting location - ' + JSON.stringify(error))
        })



    }

    async displayDirectionsinMap() {
        //   this.directionsService.route({
        //     origin: this.data.source,
        //     destination: this.data.destination,
        //     travelMode: 'DRIVING'
        //   }, (response, status) => {
        //     if (status === 'OK') {
        //       this.directionsDisplay.setDirections(response);
        //     } else {
        //       window.alert('Directions request failed due to ' + status);
        //     }
        //   });


        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        // });
        // await loading.present();



        // //get curent user data 
        // this.authService.getDataFromStorage().then((userdata) => {


        //         let AddressObj = {
        //             "userId": userdata.uid,
        //             "latitude": this.locationdata.latitude,
        //             "longitude": this.locationdata.longitude

        //         };


        //         this.afData.list('Address').push(AddressObj).then((ifSeccess) => {
        //             loading.dismiss();

        //             this.alert.presentAlert("your location has been added");

                    let NavExtras: NavigationExtras = {
                        queryParams: this.locationdata
                    }
                    this.navCtrl.navigateForward('address', NavExtras);


        //         }).catch((Error) => {
        //             loading.dismiss();
        //             this.alert.presentAlert(Error.message);
        //         });



        // }).catch((storageerror) => {
        //     loading.dismiss();
        //     this.alert.presentAlert("Unable to get data from storage");
        // })

        


        //send loc to address page

       

    }
}


