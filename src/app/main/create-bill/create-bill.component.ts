import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../assets/product.service';
export interface UserData {
  barcode: string;
  name: string;
  price: string;
  actions: any
}
@Component({
  selector: 'app-create-bill',
  standalone:false,
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.css'
})
export class CreateBillComponent  implements OnInit, OnDestroy {
  constructor(private router: Router, private productService: ProductService) { }
  currentDate: Date = new Date();
  private timer: any;
  displayedColumns: string[] = ['barcode', 'name', 'price', 'actions'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);

  product = { barcode: '', name: '', price: '', category: '' };
  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000); 
    this.getDB()
  }
  category: any[] = []
  async getDB() {
    const data = await this.productService.getAllProducts('products')
    this.dataSource = new MatTableDataSource(data);
    const dataCategory = await this.productService.getAllProducts('category')
    this.category = dataCategory
  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // cleanup to prevent memory leak
    }
  }
  searchText: any
  applyFilter(event: Event) {
    const filterValue: any = event;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}