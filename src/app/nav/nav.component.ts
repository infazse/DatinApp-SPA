import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }
  ngOnInit() {
  }

login() {
    console.log(this.model);
    this.authService.login(this.model).subscribe(data => {
        this.alertify.success('logged in sucessfully');
    }, error => {
        this.alertify.error('Unable to login');
    }, () => {
        this.router.navigate(['/members']);

    });
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

}
