import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { ProductsService } from "src/app/services/products.service";

@Component({
  selector: "app-favourites",
  templateUrl: "./favourites.component.html",
  styleUrls: ["./favourites.component.scss"],
})
export class FavouritesComponent implements OnInit {
  favourites: TableData;
  searchResult: TableData;

  constructor(private _ProductsService: ProductsService) {
    this.showFavourites();
  }
  showFavourites(page: number = null) {
    this._ProductsService.getFavourites().subscribe((res) => {
      this.favourites = {
        headerRow: ["Name", "Quantity", "Cost", "Total Cost"],
        keys: ["name", "amount", "cost", "totalCost"],
        dataRows: res.user_with_products,
        title: "Favourites",
        buttonName: ["Delete"],
        searchField: "name",
      };
      this.searchResult = Object.assign({}, this.favourites);
      this.searchResult.dataRows = this.favourites.dataRows["products"];
    });
  }
  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.favourites.dataRows[
        "products"
      ].filter((data) =>
        data[this.favourites.searchField].toString().includes(text.toString())
      );
    } else {
      this.searchResult.dataRows = this.favourites.dataRows["products"];
    }
  }
  removeItem(i) {
    if (
      confirm(
        `Are you sure you want to delete ${this.favourites.dataRows["products"][i].name}?`
      )
    ) {
      this._ProductsService
        .deleteFromFavourites(this.favourites.dataRows["products"][i].id)
        .subscribe((res) => {
          this.showFavourites();
          alert(res.message);
        });
    }
  }
  pageChanged(p) {}
  ngOnInit(): void {}
}
