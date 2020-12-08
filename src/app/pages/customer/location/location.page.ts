import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { AlertserviceService } from '../../../services/alertservice.service';
import { NavigationExtras } from '@angular/router';
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
  
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    constructor(private geolocation: Geolocation,
        private route: ActivatedRoute,
        private alert: AlertserviceService, public navCtrl: NavController,
        public loadingController: LoadingController,
        private authService: ServiceService,
        private afData: AngularFireDatabase,) {

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
            alert('Error getting location - ' + JSON.stringify(error))
        })



    }

    async displayDirectionsinMap() {
       

                    let NavExtras: NavigationExtras = {
                        queryParams: this.locationdata
                    }
                    this.navCtrl.navigateForward('address', NavExtras);

    }
}


