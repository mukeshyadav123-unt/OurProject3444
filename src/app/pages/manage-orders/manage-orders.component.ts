import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { AdminService } from "src/app/services/admin.service";

@Component({
  selector: "app-manage-orders",
  templateUrl: "./manage-orders.component.html",
  styleUrls: ["./manage-orders.component.scss"],
})
export class ManageOrdersComponent implements OnInit {
  orders: TableData;
  searchResult: TableData;
  constructor(private _AdminService: AdminService) {
    this.getOrders();
  }
  getOrders(page: number = null) {
    this.orders = null;

    this._AdminService.getOrders(page).subscribe((orders) => {
      console.log(orders);
      this.orders = {
        headerRow: ["Username", "Address", "Date", "Value"],
        keys: ["user", "delivery_address", "created_at", "value"],
        dataRows: orders.data,
        title: "Orders",
        buttonName: ["Status"],
        searchField: "user",
      };
      this.searchResult = Object.assign({}, this.orders);
      this.searchResult.dataRows = this.orders.dataRows["data"];
    });
  }
  pageChanged(page) {
    this.getOrders(page);
  }
  changeOrderState(event, index: number) {
    this._AdminService
      .updateOrder(this.orders.dataRows["data"][index].id, event.target.value)
      .subscribe(
        (res) => {},
        (err) => {
          alert("Couldn't update status");
          this.getOrders();
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
