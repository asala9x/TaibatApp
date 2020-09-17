import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-view-dietitian',
  templateUrl: './admin-view-dietitian.page.html',
  styleUrls: ['./admin-view-dietitian.page.scss'],
})
export class AdminViewDietitianPage implements OnInit {

  //defult arry ditiain data
  private dietitian=[
    {
      "image":"../../../../assets/icon/Profile.png",
      "name":"Image",
      "Dec":"This Image Describe Dietitian about ....",
      "phone":"99882230",
      "email":"abc@gmail.com"
    }
    
  ];
  constructor() { }

  ngOnInit() {
  }



}
