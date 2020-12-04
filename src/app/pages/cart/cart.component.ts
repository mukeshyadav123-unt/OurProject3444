import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { TableData } from "src/app/interfaces/table-data";
import { CartService } from "src/app/services/cart.service";
import { OrdersService } from "src/app/services/orders.service";
import { loadStripe } from "@stripe/stripe-js";
declare let Stripe: any;
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cart: TableData;
  searchResult: TableData;
  address: string = "";
  stripe: any;
  card: any;
  clientSecret: any;
  @ViewChild("addressModalClose") closeModalBtn: ElementRef;

  constructor(
    private _CartService: CartService,
    private _OrdersService: OrdersService,
    protected router: Router
  ) {}
  ngAfterViewInit() {
    this.stripe = Stripe(
      "pk_test_51HgvmgFAfdf2YRBxWEgZ0HKGbT5Olc7uYMzVO0180G3pTwgEP94LXYL2j0j1uGpBODyo2PE9gdtFBtemkpchcP9o00VvztUkmp"
    );
    var elements = this.stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };
    this.card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    this.card.mount("#card-element");
    this.showCart();
  }
  pay() {
    this.payWithCard(this.stripe, this.card, this.clientSecret);
  }
  payWithCard(stripe, card, clientSecret) {
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        },
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer
        } else {
          // The payment succeeded!
          this._CartService.clearCart().subscribe(
            (res) => {
              alert("Order has been place");
              this.showCart();
              this.closeModalBtn.nativeElement.click();
            },
            (err) => {
              alert("Error, try again later");
            }
          );
        }
      });
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
  saveAddress() {
    this._OrdersService.checkout(this.address).subscribe(
      (res) => {
        this.clientSecret = res.client_secret;
        alert("Address Saved");
      },
      (err) => {
        alert("Error occured, try again later");
      }
    );
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
