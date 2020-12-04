import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private _HttpClient: HttpClient) {}
  public getOrders(page: number = null): Observable<any> {
    let pageParameter: string = "";
    if (page) {
      pageParameter += "?page=" + page;
    }
    return this._HttpClient.get(
      `${environment.api}/api/order${pageParameter}`,
      {
        responseType: "json",
      }
    );
  }
  cancelOrder(id: number) {
    return this._HttpClient.delete(`${environment.api}/api/order/${id}`, {
      responseType: "json",
    });
  }
  checkout(address: string): Observable<any> {
    return this._HttpClient.post(
      `${environment.api}/api/order`,
      {
        delivery_address: address,
      },
      { responseType: "json" }
    );
  }
}
