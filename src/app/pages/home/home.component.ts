import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { CartService } from "src/app/services/cart.service";
import { CategoryService } from "src/app/services/category.service";
import { ProductsService } from "src/app/services/products.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  productsList: any = null;
  categories: any = null;
  favourites: any = null;
  categorisedProducts: any;
  constructor(
    private _ProductsService: ProductsService,
    private _CartService: CartService,
    private _CategoryService: CategoryService
  ) {
    this.getProducts();
    this.getCategories();
    this.getFavourites();
  }
  categoryChanged(e) {
    if (e.value) {
      this.categorisedProducts = this.productsList.data.filter(
        (product) => product["category_id"] == e.value
      );
    } else {
      this.categorisedProducts = this.productsList.data;
    }
  }
  getProducts(page: number = null) {
    this.productsList = null;
    this._ProductsService.getProducts(page).subscribe((products) => {
      this.productsList = products.data;
      this.categorisedProducts = products.data.data;
    });
  }
  getFavourites() {
    this._ProductsService.getFavourites().subscribe((res) => {
      this.favourites = res.user_with_products.favorite_products;
    });
  }
  getCategories(page: number = null) {
    this._CategoryService.getCategories(page).subscribe((categories) => {
      this.categories = categories.data;
    });
  }

  addToFavourites(product) {
    this._ProductsService.addToFavourites(product.id).subscribe((res) => {
      alert(product.name + " added to favourites.");
    });
  }
  deleteFromFavourites(product) {
    this._ProductsService.deleteProduct(product.id).subscribe((res) => {
      alert(product.name + " deleted from favourites.");
    });
  }
  isFavourite(product) {
    this.favourites.forEach((fav) => {
      if (fav.id == product.id) {
        return true;
      }
    });
    return false;
  }
  addToCart(product) {
    this._CartService.addToCart(product.id, 1).subscribe((res) => {
      alert(product.name + " added.");
    });
  }
  handlePageChange(p) {
    console.log(this.productsList);
    this.getProducts(p);
  }
  ngOnInit(): void {}
}
