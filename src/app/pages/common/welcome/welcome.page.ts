import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  private slideArray:any[]=[
    {
      "name":"Advices",
      "desc":"Dear interested in your health, you must follow the health advice of the Taibat  application"
    },
    {
      "name":"events",
      "desc":"If you want to evaluate any health event, you can send a request to  Taibat  team to help you"
    },
    {
      "name":"Shop",
      "desc":"The easiest way to order  health Products, Toys, machines, or other things."
    },
    {
      "name":"Dietitian",
      "desc":"If you are searching for a dietitian who follows your diet, you will find a list of dietitians"
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
