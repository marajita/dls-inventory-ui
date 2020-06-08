import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudentComponent} from './student/student.component'
import {InventoryManagementComponent} from "./inventory-management/inventory-management.component";
import {FileUploadComponent} from "./file-upload/file-upload.component";


const routes: Routes = [
  { path: 'student', component: StudentComponent },
  { path: 'inventory-management', component: InventoryManagementComponent },
  { path: 'file-upload', component: FileUploadComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
