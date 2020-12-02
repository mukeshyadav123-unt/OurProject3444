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
  selectedCategory: string;
  constructor(
    private _ProductsService: ProductsService,
    private _CartService: CartService,
    private _CategoryService: CategoryService
  ) {
    this.getProducts();
    this.getCategories();
  }
  categoryChanged(e) {
    if (e.value) {
      this.selectedCategory = e.value;
      this.getProducts(null, this.selectedCategory);
    }
  }
  getProducts(page: number = null, category: string = null) {
    this.productsList = null;
    this._ProductsService.getProducts(page, category).subscribe((products) => {
      console.log(products);

      this.productsList = products.data;
      this.getFavourites();
    });
  }
  getFavourites() {
    this._ProductsService.getFavourites().subscribe((res) => {
      this.favourites = res.user_with_products.favorite_products;
      this.favourites.forEach((fav) => {
        this.productsList.data.forEach((prod) => {
          if (fav.id == prod.id) {
            prod.isFavourite = true;
          }
        });
      });
    });
  }
  getCategories(page: number = null) {
    this._CategoryService.getCategories(page).subscribe((categories) => {
      this.categories = categories.data;
    });
  }

  addToFavourites(product) {
    this._ProductsService.addToFavourites(product.id).subscribe((res) => {
      product.isFavourite = true;
      alert(product.name + " added to favourites.");
    });
  }
  encodeId(id) {
    return "/products/" + btoa(id);
  }
  deleteFromFavourites(product) {
    this._ProductsService.deleteFromFavourites(product.id).subscribe((res) => {
      product.isFavourite = false;
      alert(product.name + " deleted from favourites.");
    });
  }
  addToCart(product) {
    this._CartService.addToCart(product.id, 1).subscribe((res) => {
      alert(product.name + " added.");
    });
  }
  handlePageChange(p) {
    this.getProducts(p, this.selectedCategory);
  }
  ngOnInit(): void {}
}
