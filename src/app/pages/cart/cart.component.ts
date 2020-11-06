import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cart: TableData;
  searchResult: TableData;

  constructor(private _CartService: CartService) {
    this.showCart();
  }
  showCart(page: number = null) {
    this._CartService.showCart(page).subscribe((res) => {
      this.cart = {
        headerRow: ["Name", "Quantity", "Cost", "Total Cost"],
        keys: ["name", "amount", "cost", "totalCost"],
        dataRows: res.user_with_products,
        title: "Cart",
        buttonName: ["Delete"],
        searchField: "name",
      };
      this.searchResult = Object.assign({}, this.cart);
      this.searchResult.dataRows = this.cart.dataRows["products"];
    });
  }
  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.cart.dataRows[
        "products"
      ].filter((data) =>
        data[this.cart.searchField].toString().includes(text.toString())
      );
    } else {
      this.searchResult.dataRows = this.cart.dataRows["products"];
    }
  }
  removeItem(i) {
    if (
      confirm(
        `Are you sure you want to delete ${this.cart.dataRows["products"][i].name}?`
      )
    ) {
      this._CartService
        .deleteFromCart(this.cart.dataRows["products"][i].id)
        .subscribe((res) => {
          this.showCart();
          alert(res.message);
        });
    }
  }
  pageChanged(p) {}
  ngOnInit(): void {}
}
