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
    is_admin: 0,
    newPassword: "",
    renewPassword: "",
  };
  username: "";
  constructor(private _UserService: UserService) {
    this.getUser();
  }
  getUser() {
    this._UserService.getMe().subscribe((user) => {
      this.user.name = user["name"];
      this.user.email = user["email"];
      this.user.is_admin = user["is_admin"];
      this.username = user["name"];
    });
  }
  update(form: NgForm) {
    let userInfo = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      new_password: form.value.newPassword,
      new_password_confirmation: form.value.renewPassword,
    };

    this._UserService.updateUser(userInfo).subscribe((res) => {
      this.getUser();
      alert(res["message"]);
    });
  }
  deleteMe() {
    if (confirm(`Are you sure you want to delete your account?`)) {
      this._UserService.deleteUser().subscribe((res) => {
        alert(res);
        this._UserService.logout();
      });
    }
  }
  ngOnInit(): void {}
}
