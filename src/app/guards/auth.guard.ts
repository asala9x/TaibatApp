import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ServiceService } from '../services/service.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(public auth: ServiceService) { }

    canActivate(): boolean {
        return this.auth.isAuthenticated();
    }

}
