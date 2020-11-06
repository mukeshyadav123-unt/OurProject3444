import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private _HttpClient: HttpClient) {}
  addToCart(product_id: any, amount: number): Observable<any> {
    return this._HttpClient.post(
      `${environment.api}/api/cart`,
      {
        product_id,
        amount,
      },
      { responseType: "json" }
    );
  }
  showCart(page: number = null): Observable<any> {
    let pageParameter: string = "";
    if (page) {
      pageParameter += "?page=" + page;
    }
    return this._HttpClient.get(`${environment.api}/api/cart${pageParameter}`, {
      responseType: "json",
    });
  }
  deleteFromCart(product_id: any): Observable<any> {
    return this._HttpClient.delete(
      `${environment.api}/api/cart/${product_id}`,

      { responseType: "json" }
    );
  }
}
