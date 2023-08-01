import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../models/registerUser';
import { AccountService } from '../services/account.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService, 
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(18)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null
        : { notMatching: true }
    }
  }

  onRegister() {
    const values = this.registerForm.value;
    if (values) {
      this.accountService.onRegister(values).subscribe({
        next: res => {
          console.log(res);
          this.toastr.success("Registration successful");
          this.router.navigateByUrl('/login');
        },
        error: error => {
          this.validationErrors = error
          this.toastr.error(error.error);
        }
      });
    }
  }
}
