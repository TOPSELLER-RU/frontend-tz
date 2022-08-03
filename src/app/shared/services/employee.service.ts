import {Injectable} from "@angular/core";
import {Employee, EmployeeRoles} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}employees${id ? '/'+id : ''}`;
  }

  getList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Employee> {
    if (id === 'new') {
      return  of({
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        image: '',
        password: '',
        departments: [],
        roles: [],
        allRoles: [],
      });
    }
    return this.http.get<Employee>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(employee: Employee): Observable<void> {
    return this.http.post<void>(this.getUri(), employee).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(employee: Employee): Observable<void> {
    return this.http.patch<void>(this.getUri(), employee).pipe(
      // catchError()
    );
  }

  delete(employee: Employee): Observable<void> {
    return this.http.delete<void>(this.getUri(employee.id)).pipe(
      // catchError()
    );
  }

  getRoles(employee: Employee): Observable<EmployeeRoles> {
    return this.http.get<EmployeeRoles>(this.getUri(employee.id)+'/roles').pipe(
      // catchError()
    );
  }

  updateRoles(employee: Employee, roles: string[]): Observable<EmployeeRoles> {
    return this.http.post<EmployeeRoles>(this.getUri(employee.id)+'/roles', roles).pipe(
      // catchError()
    );
  }
}
