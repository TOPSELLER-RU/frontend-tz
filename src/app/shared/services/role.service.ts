import {Injectable} from "@angular/core";
import {Role, RoleGroup} from "../interfaces";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}roles${id ? '/'+id : ''}`;
  }

  getList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}roles`).pipe(
    );
  }

  getRole(id: string) : Observable<Role> {
    return this.http.get<Role>(`${environment.apiUrl}roles/${id}`).pipe();
  }

  create(role: Role): Observable<Role> {
    return this.http.post<Role>(`${environment.apiUrl}roles`, role).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    // const {message} = error.error.error
    //
    //
    // switch (message) {
    //   case 'INVALID_EMAIL':
    //     this.error$.next('неверный email')
    //     break
    //   case 'INVALID_PASSWORD':
    //     this.error$.next('неверный пароль')
    //     break
    //   case 'EMAIL_NOT_FOUND':
    //     this.error$.next('email не найден')
    //     break
    // }

    console.log(error)

    return throwError(() => new Error('test'))
  }

  update(roleId: string, role: Role): Observable<Role> {
    return this.http.patch<Role>(`${environment.apiUrl}roles`, role).pipe(
      // catchError()
    );
  }

  delete(roleId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}roles/${roleId}`).pipe(
      // catchError()
    );
  }

  getAllRoles() : Observable<RoleGroup[]> {
    return this.http.get<RoleGroup[]>(`${environment.apiUrl}roles/all`).pipe();
  }

  listGroups() : Observable<RoleGroup[]> {
    return this.http.get<RoleGroup[]>(`${environment.apiUrl}roles/groups`).pipe();
  }

  createGroup(roleGroup: RoleGroup): Observable<RoleGroup> {
    return this.http.post<RoleGroup>(`${environment.apiUrl}roles/groups`, roleGroup).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  updateGroup(roleGroup: RoleGroup): Observable<RoleGroup> {
    return this.http.patch<RoleGroup>(`${environment.apiUrl}roles/groups`, roleGroup).pipe();
  }

  deleteGroup(roleGroupId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}roles/groups/${roleGroupId}`).pipe(
      // catchError()
    );
  }

}
