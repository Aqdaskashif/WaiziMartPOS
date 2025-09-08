import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../../assets/product.service';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { Router } from '@angular/router';

export interface UserData {
  barcode: string;
  name: string;
  price: string;
  actions: any
}


@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(private productService: ProductService, private router: Router) { }
  private codeReader = new BrowserMultiFormatReader();
  private controls: IScannerControls | null = null;

  scanResult: string | null = null;
  displayedColumns: string[] = ['barcode', 'name', 'price', 'actions'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);

  product = { barcode: '', name: '', price: '', category: '' };

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  currentDate: Date = new Date();
  private timer: any;

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
      clearInterval(this.timer);
    }
  }

  async saveProduct() {
    const val = await this.productService.addProduct(this.product);
    if (val) {
      this.getDB()
      if (this.controls && this.scanResult) {
        this.controls.stop();
        this.controls = null;
      }
      const modalElement = document.getElementById('close') as HTMLButtonElement;
      if (modalElement) {
        modalElement.click();
        this.product = { barcode: '', name: '', price: '', category: '' };
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource['paginator'] = this.paginator;
    this.dataSource['sort'] = this.sort;
  }
  searchText: any
  applyFilter(event: Event) {
    const filterValue: any = event;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  async openScanner() {
    const callbackUrl = encodeURIComponent(window.location.origin + this.router.url + '?code={CODE}');
    const intentUrl = `intent://scan/?ret=${callbackUrl}#Intent;scheme=zxing;package=com.google.zxing.client.android;end`;
    window.location.href = intentUrl
    console.log(callbackUrl);
    console.log(intentUrl);
    
    
  }

  stopScan() {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }

  }
  editRow(row: any) {
    row.isEditing = true;
  }
  cancelRow(row: any) {
    row.isEditing = false;
  }

  async saveRow(row: any) {
    row.isEditing = false;
    await this.productService.updateProduct(row);
    alert("Row updated!");
  }

  async deleteRow(row: any) {
    if (confirm("Are you sure you want to delete this product?")) {
      await this.productService.deleteProduct(row.barcode);
      this.dataSource.data = this.dataSource.data.filter((p: any) => p.barcode !== row.barcode);
      alert("Product deleted!");
    }
  }
}

