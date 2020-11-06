import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { TableData } from "../../interfaces/table-data";

@Component({
  selector: "table-cmp",
  templateUrl: "table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
  searchResult: TableData;
  @Input() data: TableData;
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() actionClicked = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();

  constructor(private _AdminService: AdminService) {}
  deleteClick(index: number) {
    this.deleteClicked.emit(index);
  }
  actionClick(index: number) {
    this.actionClicked.emit(index);
  }
  //return data[this.data.searchField].toString().includes(text.toString());
  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.data.dataRows["data"].filter((data) =>
        data[this.data.searchField].toString().includes(text.toString())
      );
    } else {
      this.searchResult.dataRows = this.data.dataRows["data"];
    }
  }
  handlePageChange(page) {
    this.pageChanged.emit(page);
  }

  ngOnInit() {
    console.log(this.data);
    this.searchResult = Object.assign({}, this.data);
    this.searchResult.dataRows = this.searchResult.dataRows["data"];
  }
}
