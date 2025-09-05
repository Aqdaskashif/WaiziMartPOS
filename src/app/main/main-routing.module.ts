import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AddItemComponent } from './add-item/add-item.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
const routes: Routes = [{ path: '', component: MainComponent },
  {path:'add-item' ,component:AddItemComponent},
  {path:'create-bill' ,component:CreateBillComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
