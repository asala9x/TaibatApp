import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  private total: string = "";
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((data) => {
    this.total= (JSON.stringify(data));
       //this.total = data.total;
     });
   }

  ngOnInit() {
  }

}
