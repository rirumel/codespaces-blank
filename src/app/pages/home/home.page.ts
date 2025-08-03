import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout()
    .then(() => {
      this.snackBar.open('Logged out successfully', 'Close', {
        duration: 3000, // duration in ms
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.router.navigate(['/login']);
    })
    .catch(error => {
      this.snackBar.open('Logout failed. Please try again.', 'Close', {
        duration: 3000
      });
    });
  }

  navigateToSelfPrep(){
    this.router.navigate(['/self-prep']);
  }

  navigateToDatabasePrep(){
    this.router.navigate(['/database-prep']);
  }

}
