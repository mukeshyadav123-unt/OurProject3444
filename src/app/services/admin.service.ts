import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private _HttpClient: HttpClient) {}
  getUsers(page: number = null): Observable<any> {
    let pageParameter: string = "";
    if (page) {
      pageParameter += "?page=" + page;
    }
    return this._HttpClient.get(`${environment.api}/api/user${pageParameter}`, {
      responseType: "json",
    });
  }
  getAdmins(): Observable<any> {
    return this._HttpClient.get(`${environment.api}/api/user/admins`, {
      responseType: "json",
    });
  }
  deleteUser(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.api}/api/user/${id}`, {
      responseType: "json",
    });
  }
  makeUserAdmin(id: string, adminPass: string): Observable<any> {
    return this._HttpClient.put(
      `${environment.api}/api/user/${id}/make-admin`,
      {
        admin_password: adminPass,
      },
      {
        responseType: "json",
      }
    );
  }
}
