import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private _HttpClient: HttpClient) {}
  getCategories(page: number = null): Observable<any> {
    let pageParameter: string = "";
    if (page) {
      pageParameter += "?page=" + page;
    }
    return this._HttpClient.get(
      `${environment.api}/api/category${pageParameter}`,
      {
        responseType: "json",
      }
    );
  }
}
