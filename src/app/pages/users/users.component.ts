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
  public admins: TableData;

  constructor(private _AdminService: AdminService) {
    this.getUsers();
    this.getAdmins();
  }

  ngOnInit(): void {}
  deleteClickedUser(index) {
    if (
      confirm(
        `Are you sure you want to delete ${this.users.dataRows[index].name}?`
      )
    ) {
      this._AdminService
        .deleteUser(this.users.dataRows[index].id)
        .subscribe((res) => {
          this.getUsers();
          alert(res);
        });
    }
  }

  makeAdminClicked(index) {
    let adminPass = prompt("Enter your password:");
    this._AdminService
      .makeUserAdmin(this.users.dataRows[index].id, adminPass)
      .subscribe(
        (res) => {
          this.getUsers();
          this.getAdmins();
          alert(res.message);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getUsers() {
    this.users = null;
    this._AdminService.getUsers().subscribe((users) => {
      this.users = {
        headerRow: ["Name", "Email"],
        keys: ["name", "email"],
        dataRows: users,
        title: "Users",
        buttonName: ["Make Admin", "Delete"],
        searchField: "email",
      };
    });
  }
  getAdmins() {
    this.admins = null;

    this._AdminService.getAdmins().subscribe((admins) => {
      this.admins = {
        headerRow: ["Name", "Email"],
        keys: ["name", "email"],
        dataRows: admins,
        title: "Admins",
        buttonName: null,
        searchField: "email",
      };
    });
  }
}
