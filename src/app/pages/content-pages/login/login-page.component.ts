import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../shared/services/auth.service";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  formSubmitted = false;
  isLoginFailed = false;

  loginForm =  new UntypedFormGroup({
    username: new UntypedFormControl(null, [Validators.required]),
    password: new UntypedFormControl(null, [Validators.required]),
    temporaryAuth: new UntypedFormControl(false)
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
  ) {
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true});

    let username = this.username?.value;
    if (username.length == 10) {
      username = '7' + username;
    }
    const params = {
      username: username,
      password: this.password?.value,
      temporaryAuth: this.loginForm.get('temporaryAuth')?.value,
    }

    this.authService.login(params).subscribe({
      next: () => {
        this.loginForm?.reset();
        this.spinner.hide().finally();
        console.log('NAVIGATE');
        this.router.navigate(['/page']).finally()
      },
      error: (error) => {
        this.isLoginFailed = true;
        this.password?.setValue('');
        this.formSubmitted = false;
        this.spinner.hide().finally();
      }
    });

  }

}
