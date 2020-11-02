import { Component, OnInit } from '@angular/core';
//
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  private data: any = {
    // "source": "",
    // "destination": ""
    "longitude":"",
    "latitude":""
  };
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  // private userdata:any={};


  constructor(private geolocation: Geolocation, private route: ActivatedRoute) {
    // this.route.queryParams.subscribe(receiveddata=>{
    //     this.userdata=receiveddata;
    // });
  }

  ngOnInit() {

    setTimeout(() => {
      let latlng = { lat: 23.614328, lng: 58.545284 };
      let mapOptions = {
        center: latlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.directionsDisplay.setMap(this.map);
    }, 1000);

  }

  displayDirectionsinMap() {
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

  this.geolocation.getCurrentPosition(
    {maximumAge: 1000, timeout: 5000,
     enableHighAccuracy: true }
    ).then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          //alert("r succ"+resp.coords.latitude)
          alert(JSON.stringify( resp.coords));
    
          this.data.latitude=resp.coords.latitude
          this.data.longitude=resp.coords.longitude
          },er=>{
            //alert("error getting location")
            alert('Can not retrieve Location')
          }).catch((error) => {
          //alert('Error getting location'+JSON.stringify(error));
          alert('Error getting location - '+JSON.stringify(error))
          })
  }


}

