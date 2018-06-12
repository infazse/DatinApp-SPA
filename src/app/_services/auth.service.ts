import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import {throwError, Observable } from 'rxjs';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();

constructor(private http: Http) {}

login(model: any) {
  return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).pipe(map((response: Response) => {
      const user = response.json();
      if (user) {
        localStorage.setItem('token', user.tokenString);
        this.userToken = user.tokenString;
        this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
        console.log(this.decodedToken);
      }
  }), catchError(this.HandleError));
}

loggedIn() {
  return tokenNotExpired('token');
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).pipe(catchError(this.HandleError));
}

private requestOptions() {
  const headers = new Headers({'content-type' : 'application/json'});
  return new RequestOptions({headers: headers});
}

private HandleError(error: any) {

  const applicationError = error.headers.get('Application-Error');
  if (applicationError) {
    return throwError(applicationError);
  }
  const serverError = error.json();
  let modelStateErrors = '';
  if (serverError) {
    for (const key in serverError) {
      if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
      }
    }
  }
  return throwError(
    modelStateErrors || 'Server error'
  );
}
}
