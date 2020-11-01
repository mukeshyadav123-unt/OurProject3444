import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
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
  constructor(private _UserService: UserService) {}

  ngOnInit(): void {}
  login(form: NgForm) {
    this._UserService
      .login(form.value.email, form.value.password)
      .subscribe((res) => {});
  }
}
