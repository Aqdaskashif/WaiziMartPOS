import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../../assets/auth.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) { }
  emailFormControl: any = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl: any = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  getValues() {
    console.log(this.emailFormControl.value);
    this.authService.login(this.emailFormControl.value, this.passwordFormControl.value)
      .then(() => this.router.navigate(['/main']))
      .catch(err => alert(err.message));
  }
}
