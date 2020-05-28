import {NgModule} from '@angular/core';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {DialogModule, PanelModule, ToolbarModule} from "primeng";

const primeng = [TableModule,ButtonModule,MessagesModule, MessageModule,DialogModule,ToolbarModule, PanelModule];

@NgModule({
  imports: [primeng],
  exports: [primeng]
})
export class PrimengModule { }
