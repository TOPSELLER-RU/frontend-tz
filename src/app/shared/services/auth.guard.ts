import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // if (!this.authService.isAuthenticated()) {
    //   return false;
    // }

    // if (!this.userService.canAccess(state.url)) {
    //   this.toastr.error('Доступ запрещён');
    //   return false;
    // }

    return true;
  }
}
