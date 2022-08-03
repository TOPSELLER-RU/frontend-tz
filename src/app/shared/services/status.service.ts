import {Injectable} from "@angular/core";
import {Department, Organization, Status} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: number) {
    return `${environment.apiUrl}statuses${id ? '/'+id : ''}`;
  }

  getList(type?: string): Observable<Status[]> {
    let url = this.getUri();
    if (type) {
      url += '?filter[type]='+type;
    }
    return this.http.get<Status[]>(url).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Status> {
    if (id === 'new') {
      return  of({
        type: '',
        name: ''
      });
    }
    return this.http.get<Status>(this.getUri(parseInt(id))).pipe(
      // catchError()
    );
  }

  create(status: Status): Observable<Status> {
    return this.http.post<Status>(this.getUri(), status).pipe(
    );
  }

  update(status: Status): Observable<Status> {
    return this.http.patch<Status>(this.getUri(), status).pipe(
      // catchError()
    );
  }

  delete(status: Status): Observable<void> {
    return this.http.delete<void>(this.getUri(status.id)).pipe(
      // catchError()
    );
  }
}
