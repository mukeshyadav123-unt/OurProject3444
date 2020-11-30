import { Component, Input, OnInit } from "@angular/core";
import { NgForm, FormsModule } from "@angular/forms";
import { TableData } from "src/app/interfaces/table-data";
import { CategoryService } from "src/app/services/category.service";
import { ProductsService } from "src/app/services/products.service";

@Component({
  selector: "app-manage-product",
  templateUrl: "./manage-product.component.html",
  styleUrls: ["./manage-product.component.scss"],
})
export class ManageProductComponent implements OnInit {
  categories: TableData;
  category = "";
  product = {
    name: "",
    description: "",
    category_id: "",
    cost: "",
    image: "",
    quantity: "",
  };
  products: TableData;
  constructor(
    private _ProductsService: ProductsService,
    private _CategoryService: CategoryService
  ) {
    this.getCategories();
    this.getProducts();
  }
  getProducts(page: number = null) {
    this.products = null;
    this._ProductsService.getProducts(page).subscribe((products) => {
      this.products = {
        headerRow: ["Name", "Cost", "Quantity"],
        keys: ["name", "cost", "in_stock"],
        dataRows: products.data,
        title: "Products",
        buttonName: ["Delete"],
        searchField: "name",
      };
    });
  }

  getCategories(page: number = null) {
    this.categories = null;
    this._CategoryService.getCategories(page).subscribe((categories) => {
      this.categories = {
        headerRow: ["Name"],
        keys: ["name"],
        dataRows: categories,
        title: "Categories",
        buttonName: ["Delete"],
        searchField: "name",
      };
    });
  }
  deleteClickedCategory(i) {
    if (
      confirm(
        `Are you sure you want to delete ${this.categories.dataRows["data"][i].name}?`
      )
    ) {
      this._CategoryService
        .deleteCategory(this.categories.dataRows["data"][i].id)
        .subscribe((res) => {
          this.getCategories();
          alert(res.message);
        });
    }
  }
  deleteClickedProduct(i) {
    if (
      confirm(
        `Are you sure you want to delete ${this.products.dataRows["data"][i].name}?`
      )
    ) {
      this._ProductsService
        .deleteProduct(this.products.dataRows["data"][i].id)
        .subscribe((res) => {
          this.getProducts();
          console.log(res);
          alert(res.message);
        });
    }
  }
  pageChanged(p) {
    this.getProducts(p);
  }
  addProduct(form: NgForm) {
    this._ProductsService.addProduct(this.product).subscribe(
      (res) => {
        alert("Product added");
        form.reset();
        this.getProducts();
      },
      (err) => {
        alert("Couldn't add product.");
      }
    );
  }
  addCategory(form: NgForm) {
    this._CategoryService.addCategory(this.category).subscribe(
      (res) => {
        alert("Category added");
        form.reset();
        this.getCategories();
      },
      (err) => {
        alert("Couldn't add category.");
      }
    );
  }
  imageInputChange(image) {
    let selectedImage = image.target.files[0];
    if (selectedImage) {
      this._ProductsService.uploadImage(selectedImage, "").then((res) => {
        this.product.image = res;
        alert("Image uploaded");
      });
    }
  }
  ngOnInit(): void {}
}
