import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})

export class UserLoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder,
    private router: Router, private addCart: CartService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(18)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.accountService.onLogin(this.loginForm.value).subscribe(() => {
        this.accountService.currentUser$.subscribe(user => {
          if (user?.id) {
            this.router.navigateByUrl('/');
          }
        });
      })
    }
  }
}
