import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  user = {
    email: "",
    password: "",
  };
  constructor(private _UserService: UserService, protected router: Router) {
    this._UserService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigate(["/"]);
      }
    });
  }

  ngOnInit(): void {}
  login(form: NgForm) {
    this._UserService.login(form.value.email, form.value.password).subscribe(
      (res) => {},
      (err) => {
        alert("User is not found");
      }
    );
  }
}
