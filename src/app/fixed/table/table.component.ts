import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
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
  deleteClick(index: number) {
    this.deleteClicked.emit(index);
  }
  actionClick(index: number) {
    this.actionClicked.emit(index);
  }
  //return data[this.data.searchField].toString().includes(text.toString());
  onSearchChange(text) {
    if (text != "") {
      this.searchResult.dataRows = this.data.dataRows.filter((data) =>
        data[this.data.searchField].toString().includes(text.toString())
      );
    } else {
      this.searchResult = Object.assign({}, this.data);
    }
  }
  ngOnInit() {
    this.searchResult = Object.assign({}, this.data);
  }
}
