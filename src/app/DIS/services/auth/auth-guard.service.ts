import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this._router.navigate(['login']);
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return this._authService.isLoggedIn();
  }
}
