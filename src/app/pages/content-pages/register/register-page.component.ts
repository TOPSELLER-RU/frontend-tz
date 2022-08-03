import {Component, OnInit} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { User } from "../../../shared/interfaces";
import { UserService } from "../../../shared/services/user.service";


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent implements OnInit {

  formSubmitted = false;
  isLoginFailed = false;
  registrationsSuccess = false;

  registerForm =  new UntypedFormGroup({
    firstname: new UntypedFormControl(null, [Validators.required]),
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    phone: new UntypedFormControl(null, [Validators.required]),
  });

  constructor(
    private router: Router,
    // private authService: AuthService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {

  }

  get firstname() {
    return this.registerForm.get('firstname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }


  ngOnInit(): void {

  }

  submit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true});

    let phone = this.phone?.value;
    if (phone) {
      phone = '7' + phone;
    }

    const user: User = {
      firstName: this.firstname?.value,
      phone: phone,
      email: this.email?.value,
    }

    this.userService.signup(user).subscribe(() => {
      this.registerForm?.reset();
      this.registrationsSuccess = true;
      this.spinner.hide();
      setTimeout(() => {
        this.router.navigate(['/login'])
      }, 3000);
    });

  }

}
