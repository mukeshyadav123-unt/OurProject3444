import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { OrdersService } from "src/app/services/orders.service";

declare let Stripe: any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  orders: TableData;
  searchResult: TableData;
  constructor(private _OrdersService: OrdersService) {
    this.getOrders();
  }
  getOrders(page: number = null) {
    this.orders = null;
    this._OrdersService.getOrders(page).subscribe((orders) => {
      console.log(orders);
      this.orders = {
        headerRow: ["Address", "Date", "Value", "status"],
        keys: ["delivery_address", "created_at", "value", "order_state"],
        dataRows: orders.data,
        title: "Orders",
        buttonName: ["Cancel Order"],
        searchField: "user",
      };
      this.searchResult = Object.assign({}, this.orders);
      this.searchResult.dataRows = this.orders.dataRows["data"];
    });
  }
  pageChanged(page) {
    this.getOrders(page);
  }
  cancelOrder(index) {
    this._OrdersService
      .cancelOrder(this.orders.dataRows["data"][index].id)
      .subscribe(
        (res) => {
          alert("order Cancelled");
          this.getOrders();
        },
        (err) => {
          alert("Couldn't cancel order");
        }
      );
  }

  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.orders.dataRows["data"].filter((data) =>
        data[this.orders.searchField]["name"]
          .toString()
          .includes(text.toString())
      );
    } else {
      this.searchResult.dataRows = this.orders.dataRows["data"];
    }
  }

  ngOnInit(): void {}
}
