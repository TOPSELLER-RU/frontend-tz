import {Injectable} from "@angular/core";
import {Marketplace} from "../interfaces";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  getUri(id?: number) {
    return `${environment.apiUrl}marketplaces${id ? '/'+id : ''}`;
  }

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getList(): Observable<Marketplace[]> {
    return this.http.get<Marketplace[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  create(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.post<Marketplace>(this.getUri(), marketplace).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.patch<Marketplace>(this.getUri(), marketplace).pipe(
      // catchError()
    );
  }
}
