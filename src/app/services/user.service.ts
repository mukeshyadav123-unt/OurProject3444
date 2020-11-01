import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {
  redirectUrl = "/";
  private userSource: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public get currentUserObject(): any {
    return this.userSource.value;
  }
  constructor(
    private _HttpClient: HttpClient,
    private _CookieService: CookieService,
    private router: Router
  ) {
    this.userSource = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.userSource.asObservable();
  }
  public login(email: string, password: string): Observable<any> {
    return this._HttpClient
      .post(
        `${environment.api}/api/login`,
        {
          email,
          password,
        },
        { responseType: "json" }
      )
      .pipe(
        map((response) => {
          if (response) {
            this._CookieService.set("Token", response["token"]);
            localStorage.setItem(
              "currentUser",
              JSON.stringify(response["user"])
            );
            this.redirectUrl = "/profile";
            this.userSource.next(response["user"]);
            this.router.navigate([this.redirectUrl]);
          }
        })
      );
  }
  public register(
    name: string,
    email: string,
    password: string,
    rePassword: string
  ): Observable<any> {
    return this._HttpClient
      .post(
        `${environment.api}/api/signup`,
        {
          name: name,
          email: email,
          password: password,
          password_confirm: rePassword,
        },
        { responseType: "text" }
      )
      .pipe(
        map((response) => {
          if (response) {
            this.router.navigate(["/login"]);
          }
        })
      );
  }
  public deleteUser(user: any) {
    return this._HttpClient.delete(`${environment.api}/api/me`);
  }
  public getMe() {
    return this._HttpClient.get(`${environment.api}/api/me`);
  }
  public updateUser(user: any) {
    return this._HttpClient.put(`${environment.api}/api/me`, {
      name: user.name,
      email: user.email,
      current_password: user.password,
    });
  }
  public logout() {
    localStorage.removeItem("currentUser");
    this.userSource.next(null);
    this._CookieService.delete("Token");
  }
}
