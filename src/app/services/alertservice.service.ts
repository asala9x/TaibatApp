import { Injectable } from '@angular/core';
import {AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlertserviceService {
  constructor(public alertController: AlertController) { }
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Taibat App',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
