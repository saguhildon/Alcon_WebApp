import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { RoleTypes } from './roles.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const { elevation } = route.data; // Array of acceptable elevations

    if (!this.isAuthenticated() || !this.isAuthorized(elevation)) {
      this._router.navigate(['login']);
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return this._authService.isLoggedIn();
  }

  isAuthorized(elevation: Array<RoleTypes>): boolean {
    const { role } = this._authService.getUserDetails() || {};

    return (
      (role as RoleTypes) === RoleTypes.ROLE_ADMIN ||
      elevation.includes(role as RoleTypes)
    );
  }
}
