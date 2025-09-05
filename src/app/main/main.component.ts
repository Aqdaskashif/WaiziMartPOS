import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../assets/auth.service';
@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent  implements OnInit, OnDestroy {
  constructor(private router: Router, private authService: AuthService) { }
  currentDate: Date = new Date();
  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000); // updates every second
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // cleanup to prevent memory leak
    }
  }
  route(path:any){
    this.router.navigate([`/main/${path}`])
  }
}
