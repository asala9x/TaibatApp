import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dietitian-list',
  templateUrl: './dietitian-list.page.html',
  styleUrls: ['./dietitian-list.page.scss'],
})
export class DietitianListPage implements OnInit {

   private dietitian=[
    {
      "image":"../../../../assets/icon/Dietitian4.jpg",
      "Name":"dietitian Name"
    },
    {
      "image":"../../../../assets/icon/Dietitian3.jpg",
      "Name":"dietitian Name"
    },
    {
      "image":"../../../../assets/icon/Dietitian3.jpg",
      "Name":"dietitian Name"
    },
    {
      "image":"../../../../assets/icon/Dietitian4.jpg",
      "Name":"dietitian Name"
    },
    {
      "image":"../../../../assets/icon/Dietitian3.jpg",
      "Name":"dietitian Name"
    },
    {
      "image":"../../../../assets/icon/Dietitian4.jpg",
      "Name":"dietitian Name"
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
