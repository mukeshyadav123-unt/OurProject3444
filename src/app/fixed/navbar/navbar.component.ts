import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  activeUser: any = null;
  constructor(private _UserService: UserService) {
    this._UserService.currentUser.subscribe((user) => {
      this.activeUser = user;
    });
  }
  logout() {
    this._UserService.logout();
  }
  ngOnInit(): void {}
}
