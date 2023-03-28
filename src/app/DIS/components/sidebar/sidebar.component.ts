import { Component, HostListener } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { config } from '@dis/settings/sidebar.config';
import { Router } from '@angular/router';

// TODO: Roles
import { RoleGuardService } from '@dis/services/auth/role-guard.service';
import { RoleTypes } from '@dis/services/auth/roles.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('toggleSidebar', [
      state('collapsed, void', style({ transform: 'translateX(-100%)' })),
      state('expanded', style({ transform: 'translateX(0)' })),
      transition('collapsed <=> expanded', [animate(200), animate(200)])
    ])
  ],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuGroups = config; // Change this to populate menu items
  sidebarState: string;
  private _isWindowSmallState: boolean;
  private _SIDEBAR_TOGGLE_BREAKPOINT = 992;

  // TODO:
  // constructor(private _roleGuardService: RoleGuardService) {
  constructor(
    private _router: Router,
    private _roleGuardService: RoleGuardService
  ) {
    if (window.innerWidth < this._SIDEBAR_TOGGLE_BREAKPOINT) {
      this.sidebarState = 'collapsed';
      this._isWindowSmallState = true;
    } else {
      this.sidebarState = 'expanded';
      this._isWindowSmallState = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < this._SIDEBAR_TOGGLE_BREAKPOINT) {
      this.sidebarState = 'collapsed';
      this._isWindowSmallState = true;
    } else {
      this.sidebarState = 'expanded';
      this._isWindowSmallState = false;
    }
  }

  toggleSidebar(): void {
    if (this.sidebarState === 'expanded' && this._isWindowSmallState) {
      this.sidebarState = 'collapsed';
    } else {
      this.sidebarState = 'expanded';
    }
  }

  isLoginView(): boolean {
    return this._router.url === '/login';
  }

  isLinkActivated(elevation: Array<RoleTypes>): boolean {
    return this._roleGuardService.isAuthorized(elevation);
  }

  isLoggedIn(): boolean {
    return this._roleGuardService.isAuthenticated();
  }

  // isLinkActivated(): boolean {
  //   return true;
  // }

  // isLoggedIn(): boolean {
  //   return true;
  // }
}
