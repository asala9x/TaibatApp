import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    constructor(private storage: Storage
        ) { }

    setDatatoStorage(userobj) {
        return this.storage.set('data',userobj);
    }

    getDataFromStorage() {
        return this.storage.get('data');
    }
    clear() {
         return this.storage.clear();
    }
}
