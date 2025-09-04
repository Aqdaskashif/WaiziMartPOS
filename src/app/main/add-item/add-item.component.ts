import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../../assets/product.service';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

export interface UserData {
  barcode: string;
  name: string;
  price: string;
  category: string;
}


@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(private productService: ProductService) { }
  private codeReader = new BrowserMultiFormatReader();
  private controls: IScannerControls | null = null;

  scanResult: string | null = null;
  isScanning: boolean = false;
  displayedColumns: string[] = ['barcode', 'name', 'price', 'category'];
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
  category:any[]=[]
  async getDB() {
    const data=await this.productService.getAllProducts('product')
    this.dataSource = new MatTableDataSource(data);
    const dataCategory=await this.productService.getAllProducts('category')
    this.category=dataCategory
  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  async saveProduct() {
    const val=await this.productService.addProduct(this.product);
    if(val){
      this.getDB()

    }
  }

  ngAfterViewInit() {
    this.dataSource['paginator'] = this.paginator;
    this.dataSource['sort'] = this.sort;
  }
  searchText: any
  applyFilter(event: Event) {
    const filterValue:any =event;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  async openScanner() {
    try {
      // ✅ call static method here
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      if (devices.length === 0) {
        this.scanResult = 'No camera found';
        return;
      }

      const backCamera = devices.find(d => /back|rear|environment/i.test(d.label));
      const selectedDeviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;

      this.controls = await this.codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        'video',
        (result, error) => {
          if (result) {
            this.scanResult = result.getText();

            if (this.controls &&  this.scanResult) {
              this.product.barcode=this.scanResult
              this.controls.stop();
              this.controls = null;
            }
            this.isScanning = false;
          }
        }
      );

      this.isScanning = true;
    } catch (err) {
      this.scanResult = 'Camera error: ' + (err as any).message;
    }
  }

  stopScan() {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }
    this.isScanning = false;
  }

}

