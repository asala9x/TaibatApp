import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {

   private event=[
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"event Name"
    },
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"even Name"
    },
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"event Name"
    },
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"event Name"
    },
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"event Name"
    },
    {
      "image":"../../../../assets/icon/event1.jpg",
      "Name":"event Name"
    },
   ];

  constructor() { }

  ngOnInit() {
  }

}
