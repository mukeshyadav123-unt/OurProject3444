import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"],
})
export class UserDetailsComponent implements OnInit {
  user = {
    name: "",
    email: "",
    password: "",
  };
  constructor(private _UserService: UserService) {
    this.getUser();
  }
  getUser() {
    this._UserService.getMe().subscribe((user) => {
      this.user.name = user["name"];
      this.user.email = user["email"];
      console.log(user);
    });
  }
  update(form: NgForm) {
    let userInfo = {
      name: form.value.name,
      email: form.value.email,
      current_password: form.value.password,
    };
    this._UserService.updateUser(userInfo).subscribe((res) => {
      alert(res["message"]);
    });
  }

  ngOnInit(): void {}
}
