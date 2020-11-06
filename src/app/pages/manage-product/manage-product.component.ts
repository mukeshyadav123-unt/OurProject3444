import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-manage-product",
  templateUrl: "./manage-product.component.html",
  styleUrls: ["./manage-product.component.scss"],
})
export class ManageProductComponent implements OnInit {
  product = {
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
    quantity: "",
  };
  constructor() {}
  addProduct(form: NgForm) {}
  csvInputChange(image) {}
  ngOnInit(): void {}
}
