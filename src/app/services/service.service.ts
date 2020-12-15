import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    authenticationState = new BehaviorSubject(false);

    constructor(private storage: Storage, private plt: Platform) {
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }
    checkToken() {
        this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        })
    }

    setDatatoStorage(userobj) {
        return this.storage.set(TOKEN_KEY, userobj).then(() => {
             this.authenticationState.next(true);
         });
        // return this.storage.set('data',userobj);
    }

    getDataFromStorage() {
        return this.storage.get(TOKEN_KEY);
    }
    clear() {
        //  return this.storage.clear();
        return this.storage.clear().then(()=>{
            this.authenticationState.next(false);
        });
    }
    isAuthenticated() {
        return this.authenticationState.value;
    }
}


