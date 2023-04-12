import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayItemsComponent } from './display-items/display-items.component';

const routes: Routes = [
  { path: '', component: DisplayItemsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
