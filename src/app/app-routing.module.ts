import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StudentComponent} from './student/student.component'
import {InventoryManagementComponent} from "./inventory-management/inventory-management.component";


const routes: Routes = [
  { path: 'student', component: StudentComponent },
  { path: 'inventory-management', component: InventoryManagementComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
