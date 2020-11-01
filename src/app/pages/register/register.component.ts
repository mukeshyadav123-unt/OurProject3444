import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  user = {
    email: "",
    password: "",
    rePassword: "",
    name: "",
  };
  constructor(private _UserService: UserService) {}

  ngOnInit(): void {}
  register(form: NgForm) {
    this._UserService
      .register(
        form.value.email,
        form.value.email,
        form.value.password,
        form.value.rePassword
      )
      .subscribe((res) => {});
  }
}
