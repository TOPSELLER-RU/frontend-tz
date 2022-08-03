import {Injectable} from "@angular/core";
import {Project} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}projects${id ? '/'+id : ''}`;
  }

  getList(): Observable<Project[]> {
    return this.http.get<Project[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Project> {
    if (id === 'new') {
      return  of({
        name: '',
        description: '',
        isDefault: false,
      });
    }
    return this.http.get<Project>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(project: Project): Observable<void> {
    return this.http.post<void>(this.getUri(), project).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(project: Project): Observable<void> {
    return this.http.patch<void>(this.getUri(), project).pipe(
      // catchError()
    );
  }

  delete(project: Project): Observable<void> {
    return this.http.delete<void>(this.getUri(project.id)).pipe(
      // catchError()
    );
  }
}
