import {NgModule} from '@angular/core';
import {TableModule} from "primeng/table";

const primeng = [TableModule];

@NgModule({
  imports: [primeng],
  exports: [primeng]
})
export class PrimengModule { }
