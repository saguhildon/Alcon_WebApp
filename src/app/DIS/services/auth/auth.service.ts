import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { RoleTypes } from './roles.enum';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { User } from '@dis/components/profile-menu/profile-menu.props';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _jwt: JwtHelperService,
    private _router: Router,
    private _storage: StorageService
  ) {}

  login(email, password) {
    return this._http
      .post<{ token: string }>(environment.SSO_ENDPOINT, {
        email: email,
        password: password
      })
      .pipe(
        map(result => {
          // Use storage service instead for broadcast
          this._storage.setItem('access_token', result.token);
          // localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout(): boolean {
    localStorage.removeItem('access_token');
    window.location.reload();
    return true;
  }

  isLoggedIn() {
    // TODO: Auth flow in progress
    if (!environment.TEST_AUTH_FLOW_COMPLETE) return true;
    else {
      const token = localStorage.getItem('access_token');
      if (token && !this._jwt.isTokenExpired(token)) {
        return true;
      } else return false;
    }
  }

  getUserDetails(): User {
    if (this.isLoggedIn()) {
      // TODO: Auth flow in progress
      if (!environment.TEST_AUTH_FLOW_COMPLETE) {
        return {
          id: '1',
          role: RoleTypes['ROLE_USER'], // ROLE_USER/MANAGER
          email: 'man@ger.com',
          contact: '+1800-MANAGE-YOU'
        };
      } else {
        const token = localStorage.getItem('access_token');
        const {
          user_id,
          user_role,
          user_email,
          user_contact
        } = this._jwt.decodeToken(token);
        return {
          id: user_id,
          role: user_role,
          email: user_email,
          contact: user_contact
        };
      }
    } else return {} as User;
  }
}
