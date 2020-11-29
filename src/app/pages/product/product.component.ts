import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "src/app/services/products.service";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  product: any = null;
  constructor(
    private route: ActivatedRoute,
    private _ProductsService: ProductsService,
    private _CartService: CartService
  ) {
    this.getProduct();
  }

  getProduct() {
    this.product = null;
    this.route.params.subscribe((params) => {
      let productId: string = atob(params["id"]);
      this._ProductsService.getProduct(productId).subscribe((product) => {
        this.product = product.data.product[0];
        console.log(product.data.product);
      });
    });
  }
  addToCart(product) {
    this._CartService.addToCart(product.id, 1).subscribe((res) => {
      alert(product.name + " added.");
    });
  }
  ngOnInit(): void {}
}
