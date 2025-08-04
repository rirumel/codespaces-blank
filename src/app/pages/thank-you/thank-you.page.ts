import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { runInInjectionContext, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
  standalone: false
})
export class ThankYouPage implements OnInit {
  userID: string = '';
  testID: string = '';
  feedbackSubmitted = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private injector: Injector,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.userID = nav?.extras?.state?.['userId'] || '';
    this.testID = nav?.extras?.state?.['testID'] || '';
  }

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

  goHome() {
    this.router.navigate(['/home']);
  }

  async submitFeedback(emoji: string) {
    if (!this.userID || !this.testID) return;

    await runInInjectionContext(this.injector, async () => {
      const docRef = this.firestore.doc(`users/${this.userID}/selfPrepTests/${this.testID}`);
      await docRef.set({ userFeedback: emoji }, { merge: true });
    });

    this.feedbackSubmitted = true;
  }

}
