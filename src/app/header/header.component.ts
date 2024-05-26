import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { User } from '../login/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe((isUserAuthenticated: User | null) => {
        this.isAuth = !!isUserAuthenticated;
    })
  }

  onLogout() {
    this.authService.logout();
  }

}
