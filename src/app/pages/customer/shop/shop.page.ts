import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  private catogryArray:any[]=[
    {
      "name":"Food",
      // "value":"freedelivery",
      "img":"../../../../assets/icon/food.png"
    }
  ,
  {
    "name":"Machines",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/mac.png"
  }
  ,
  {
    "name":"Book",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/book.png"
  }
  ,
  {
    "name":"onther",
    // "value":"freedelivery",
    "img":"../../../../assets/icon/onther.png"
  }
  
  ];
  constructor() { }

  ngOnInit() {
  }

}
