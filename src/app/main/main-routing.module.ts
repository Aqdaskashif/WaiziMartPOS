import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AddItemComponent } from './add-item/add-item.component';
const routes: Routes = [{ path: '', component: MainComponent },
  {path:'add-item' ,component:AddItemComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
