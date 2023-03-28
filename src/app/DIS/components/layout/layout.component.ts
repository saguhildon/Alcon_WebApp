import { Component, OnInit } from '@angular/core';
import { User } from '@dis/components/profile-menu/profile-menu.props';
import { Notification } from '@dis/components/notifications-menu/notifications-menu.props';
import {
  handleNotificationsClick,
  getNotifications,
  YOUR_APP_NAME
} from '@dis/settings/behavior.config';
import { Router } from '@angular/router';
import { AuthService } from '@dis/services/auth/auth.service';
import { StorageService } from '@dis/services/storage/storage.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _storage: StorageService
  ) {}
  ngOnInit() {
    this.user = this._auth.getUserDetails();
    if (this.user && this.user.id) this.getData();
    this._storage.watch().subscribe(data => {
      this.user = this._auth.getUserDetails();
      this.getData();
    });
  }

  user: User;
  notifications: Array<Notification>;
  appName = YOUR_APP_NAME;
  currentFocusedMenu = 'none';

  getData = async () => {
    this.notifications = await getNotifications();
  };

  onNotificationClick = notificationId => {
    handleNotificationsClick(notificationId);
  };

  logout() {
    this._auth.logout();
  }

  isLoginView() {
    return this._router.url === '/login';
  }

  isLoggedIn() {
    return this._auth.isLoggedIn();
  }
}
