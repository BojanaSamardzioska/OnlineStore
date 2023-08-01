import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { RegisterUser } from '../models/registerUser';
import { LoginUser } from '../models/loginUser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDto } from '../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface tokenData { roles: string[], isExpired: boolean };

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser$ = new BehaviorSubject<UserDto | null>(null);
  tokenData: tokenData = { roles: [], isExpired: true }; // ova mozes da go proveruvas za da vidis dali e istekol tokenot

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    const user = JSON.parse(localStorage.getItem('user')!); // we take the user from local storage and check if he is expired or not
    if (user?.token)
      this.setCurrentUser(user);
  }

  onLogin(userLogin: LoginUser): Observable<void> {
    return this.http.post<UserDto>(this.baseUrl + 'userapi/login', userLogin).pipe(
      map((response) => {
        if (response)
          this.setCurrentUser(response);
      })
    );
  }

  logOut(): void {
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    this.toastr.info('Logout successful');
    this.router.navigateByUrl('/');
  }

  onRegister(object: any): Observable<any> {
    return this.http.post<RegisterUser>(this.baseUrl + 'userapi/register', object);
  }

  private setCurrentUser(userDto: UserDto) {
    this.decodeJwtToken(userDto.token);
    localStorage.setItem('user', JSON.stringify(userDto)); // test this
    this.currentUser$.next(userDto);
    this.toastr.success('Login successful');
  }

  private decodeJwtToken(token: string): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const isExpired = helper.isTokenExpired(token);
    const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    this.tokenData.isExpired = isExpired;
    this.tokenData.roles = roles;
    if (isExpired) {
      this.logOut();
    }
  }

}