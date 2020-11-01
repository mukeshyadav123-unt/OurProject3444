import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/interfaces/table-data";
import { AdminService } from "src/app/services/admin.service";
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  public users: TableData;

  constructor(private _AdminService: AdminService) {
    this.getUsers();
  }

  ngOnInit(): void {}
  deleteClickedUser(index) {
    console.log(index);
  }
  deleteClickedAdmin(index) {
    console.log(index);
  }
  makeAdminClicked(index) {
    console.log(index);
  }
  removeAdminClicked(index) {
    console.log(index);
  }

  getUsers() {
    this._AdminService.getUsers().subscribe((users) => {
      this.users = {
        headerRow: ["Name", "Email"],
        keys: ["name", "email"],
        dataRows: users.data,
        title: "Users",
        buttonName: ["Make Admin", "Delete"],
        searchField: "email",
      };
    });
  }
  getAdmins() {
    this._AdminService.getAdmins().subscribe((users) => {
      this.users = {
        headerRow: ["Name", "Email"],
        keys: ["name", "email"],
        dataRows: users.data,
        title: "Users",
        buttonName: ["Remove Admin", "Delete"],
        searchField: "email",
      };
    });
  }
}
