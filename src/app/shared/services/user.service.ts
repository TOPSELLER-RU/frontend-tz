import { Injectable } from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {

  private ownerSections = [
    'page',
    'dashboard',
    'counterparty',
    'department',
    'employee',
    'expense',
    'order',
    'organization',
    'product',
    'product-group',
    'project',
    'purchase',
    'warehouse',
    'product-stock',
    'transaction'
  ];

  private currentUser!: User;
  // authSub?: Subscription;

  constructor(
    private http: HttpClient,
    // private authService: AuthService
  ){
    // this.authSub = this.authService.user$.subscribe(user => {
    //   this.setUser(user);
    // })
  }

  getUser(): User {
    // console.log('GET USER')
    if (!this.currentUser) {
      this.initUser();
    }
    return this.currentUser;
  }

  setUser(user: User | null) {
    // console.log('SET USER')
    if (user) {
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      // this.initUser()
    } else {
      localStorage.removeItem('user');
    }
  }

  initUser(): void {
    console.log('INIT USER')
    let user = localStorage.getItem('user');
    if (!user) {
      // this.authService.logout();
      return;
    }
    this.currentUser = JSON.parse(user);
  }

  signup(user: User): any {
    return this.http.post(`${environment.apiUrl}security/signup`, user);
  }

  updateProfile(user: User): any {
    return this.http.patch<User>(`${environment.apiUrl}security/profile`, user).pipe(
      tap(this.setUser.bind(this))
    );
  }

  canAccess(url: string) {
    let section = '';
    url = url.substring(url.lastIndexOf('/') + 1);

    switch (url) {
      case 'page':
      case 'dashboard':
        section = url;
        break;
      case 'counterparties':
        section = 'counterparty';
        break;
      case 'purchase-statuses':
        section = 'purchase-status';
        break;
      default:
        section = url.substring(url.lastIndexOf('/') + 1, url.length - 1);
    }

    const role = 'ROLE_'+section.toUpperCase()+'_VIEW';

    return this.isGranted(role);
  }

  isGranted(role: string): boolean {
    const user = this.getUser();

    if (!user || !user.roles) {
      return false;
    }

    let granted = user.roles.includes('ROLE_ADMIN');

    if (!granted && user.roles.includes('ROLE_OWNER')) {
      const section = role.substring(0, role.indexOf('_', 5)).replace('ROLE_', '').toLowerCase();
      if (section) {
        granted = this.ownerSections.includes(section);
      }
    }

    if (!granted) {
      granted = user.roles.includes(role);
    }

    return granted;
  }
}
