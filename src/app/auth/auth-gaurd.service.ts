import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate  {

  constructor(public authenticationService: AuthServiceService) {

   }

   canActivate(): boolean {
    return this.authenticationService.isAuthenticated();
  }

}
