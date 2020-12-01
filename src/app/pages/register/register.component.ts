import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
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
  constructor(private _UserService: UserService, protected router: Router) {
    this._UserService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigate(["/"]);
      }
    });
  }

  ngOnInit(): void {}
  register(form: NgForm) {
    this._UserService
      .register(
        form.value.name,
        form.value.email,
        form.value.password,
        form.value.rePassword
      )
      .subscribe(
        (res) => {},
        (err) => {
          alert(JSON.parse(err.error).message);
        }
      );
  }
}
