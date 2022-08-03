import {Injectable} from "@angular/core";
import {Language} from "../interfaces";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languages?: Language[];

  constructor(private http: HttpClient) {
  }

  getAll(): Language[] {
    if (!this.languages) {
      this.loadLanguages();
    }
    if (!this.languages) {
      this.languages = [];
    }
    return this.languages;
    // return this.http.get(`${environment.apiUrl}/languages.json`)
    //   @ts-ignore
    //   .pipe((response: Observable<any>) => {
      //   console.log(response)
      // })
      // .pipe(map((response: {[key: string]: any}) => {
      //   return Object
      //     .keys(response)
      //     .map(key => ({
      //       ...response[key],
      //       id: key,
      //       date: new Date(response[key].date)
      //     }))
      // }))
  }

  private loadLanguages() {
    this.http.get(`${environment.apiUrl}language/`)
      .subscribe(r => {  console.log(r); } )
  }

}
