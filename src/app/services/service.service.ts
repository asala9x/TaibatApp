import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    constructor(private nativeStorage: NativeStorage) { }

    setDatatoStorage(userobj) {
        return this.nativeStorage.setItem('data',userobj);
    }

    getDataFromStorage() {
        return this.nativeStorage.getItem('data');
    }
    clear() {
        return this.nativeStorage.clear();
    }
}
