import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private _HttpClient: HttpClient) {}
  getUsers(): Observable<any> {
    return this._HttpClient.get(`${environment.api}/api/user`, {
      responseType: "json",
    });
  }
  getAdmins(): Observable<any> {
    return this._HttpClient.get(`${environment.api}/api/user/admins`, {
      responseType: "json",
    });
  }
}
