import {Injectable} from "@angular/core";
import {Department, Organization} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}departments${id ? '/'+id : ''}`;
  }

  getList(): Observable<Department[]> {
    return this.http.get<Department[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Department> {
    if (id === 'new') {
      return  of({
        name: '',
        description: '',
        roles: [],
        isDefault: false
      });
    }
    return this.http.get<Department>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(department: Department): Observable<void> {
    return this.http.post<void>(this.getUri(), department).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(department: Department): Observable<void> {
    return this.http.patch<void>(this.getUri(), department).pipe(
      // catchError()
    );
  }

  delete(department: Department): Observable<void> {
    return this.http.delete<void>(this.getUri(department.id)).pipe(
      // catchError()
    );
  }

  updateRoles(department: Department, roles: string[]): Observable<void> {
    return this.http.post<void>(this.getUri(department.id)+'/roles', roles).pipe(
      // catchError()
    );
  }
}
