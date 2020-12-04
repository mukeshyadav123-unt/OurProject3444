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
  showFavourites() {
    this._ProductsService.getFavourites().subscribe((res) => {
      console.log(res);
      this.favourites = {
        headerRow: ["Name", "In Stock", "Cost"],
        keys: ["name", "in_stock", "cost"],
        dataRows: res.user_with_products.favorite_products,
        title: "Favourites",
        buttonName: ["Delete"],
        searchField: "name",
      };
      this.searchResult = Object.assign({}, this.favourites);
      this.searchResult.dataRows = this.favourites.dataRows;
    });
  }
  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.favourites.dataRows.filter((data) =>
        data[this.favourites.searchField].toString().includes(text.toString())
      );
    } else {
      this.searchResult.dataRows = this.favourites.dataRows;
    }
  }
  removeItem(i) {
    if (
      confirm(
        `Are you sure you want to delete ${this.favourites.dataRows[i].name}?`
      )
    ) {
      this._ProductsService
        .deleteFromFavourites(this.favourites.dataRows[i].id)
        .subscribe((res) => {
          this.showFavourites();
          alert(res.message);
        });
    }
  }
  encodeId(id) {
    return "/products/" + btoa(id);
  }
  pageChanged(p) {}
  ngOnInit(): void {}
}
