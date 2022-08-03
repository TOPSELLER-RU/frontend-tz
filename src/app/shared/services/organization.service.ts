import {Injectable} from "@angular/core";
import {Organization} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}organizations${id ? '/'+id : ''}`;
  }

  getList(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Organization> {
    if (id === 'new') {
      return  of({
        name: '',
        phone: '',
        email: '',
        fullName: '',
        legalAddress: '',
        inn: '',
        kpp: '',
        ogrn: '',
        okpo: '',
        isDefault: false
      });
    }
    return this.http.get<Organization>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(organization: Organization): Observable<void> {
    return this.http.post<void>(this.getUri(), organization).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(organization: Organization): Observable<void> {
    return this.http.patch<void>(this.getUri(), organization).pipe(
      // catchError()
    );
  }

  delete(organization: Organization): Observable<void> {
    return this.http.delete<void>(this.getUri(organization.id)).pipe(
      // catchError()
    );
  }
}
