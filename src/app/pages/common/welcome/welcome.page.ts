import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
    private slideArray: any[] = [
        {
            "name": "Advices",
            "desc": "Dear interested in your health, you must follow the health advice of the Taibat  application"
        },
        {
            "name": "Events",
            "desc": "If you want to evaluate any health event, you can send a request to  Taibat  team to help you"
        },
        {
            "name": "Shop",
            "desc": "The easiest way to order  health Products, Toys, machines, or other things."
        },
        {
            "name": "Dietitian",
            "desc": "If you are searching for a dietitian who follows your diet, you will find a list of dietitians"
        },
    ];

    subscribe: any;
    constructor(public Platform: Platform) { 
        this.subscribe = this.Platform.backButton.subscribeWithPriority(666666, () => {
            if (this.constructor.name == "WelcomePage") {
                if (window.confirm("Do you want to exit app ")) {
                    navigator["app"].exitApp();
                }
            }
        })
    }

    ngOnInit() {
    }

}
