import {NgModule} from '@angular/core';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {
  DialogModule,
  DropdownModule,
  FileUploadModule,
  PanelModule,
  TabViewModule,
  ToastModule,
  ToolbarModule
} from "primeng";

const primeng = [TableModule, ButtonModule, MessagesModule, MessageModule, DialogModule, ToolbarModule, PanelModule, DropdownModule,  TabViewModule,  FileUploadModule, ToastModule];

@NgModule({
  imports: [primeng],
  exports: [primeng]
})
export class PrimengModule {
}
