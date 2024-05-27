import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
} from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  currentForm: string = 'login';
  isLoading: boolean = false;
  errorMessage: string = '';
  hidePassword = true;
  hideConfirmPassword = true;
  isPasswordMatch: boolean = false;

  @ViewChild('signupForm', { static: false }) signupForm: NgForm;
  @ViewChild('confirmPassword', {static: false}) confirmPassword: NgModel;
  @ViewChild("password", {static: false}) password: NgModel;
  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  toggleForm(formType: string) {
    this.currentForm = formType;
  }

  onSignup(form: NgForm) {
    const isPasswordMatch = this.confirmPassword.value === this.password.value;
    if (!isPasswordMatch) {
      this.errorMessage = 'Password do not match';
      this.showErrorSnackbar(this.errorMessage, 'ERROR');
      return;
    }

    if (form.valid) {
      const { email, password } = form.value;
      this.isLoading = true;
      this.authService.signup(email, password).subscribe(
        (response) => {
          this.isLoading = false;
          this.currentForm = 'login';
          this.showErrorSnackbar('Signup success. Please Login !', 'SUCCESS');
        },
        (error) => {
          this.errorMessage = error;
          this.showErrorSnackbar(this.errorMessage, 'ERROR');
          this.isLoading = false;
          this.currentForm = 'signup';
        }
    );
      form.reset();
    }
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;
      this.isLoading = true;
      this.authService.login(email, password).subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate(['']);
        },
        (error) => {
          this.errorMessage = error;
          this.showErrorSnackbar(this.errorMessage, 'ERROR');
          this.isLoading = false;
        }
      );
    }
  }

  onForgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  onClickSignUp() {
    this.currentForm = 'signup';
  }

  showErrorSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['snack-bar-warning'] 
    });

  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }
}
