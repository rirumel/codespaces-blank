import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email= '';
  password= '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth.getRedirectResult()
    .then(result => {
      if (result.user) {
        console.log('Redirect login success:', result.user.email);
        // Navigate to home or wherever you want
      }
    })
    .catch(error => {
      console.error('Error completing redirect login:', error);
    });
  }

  async onLogin(){
    this.authService.login(this.email, this.password)
    .then(async (res)=> {
      if(res.user?.emailVerified){
        this.router.navigate(['/home']);
      } else{
        const alert = await this.alertCtrl.create({
          header: 'Email Not Verified',
          message: 'Please verify your email address before loggin in.',
          buttons: [
            {
              text: 'Send Email Verification',
              handler: async () => {
                //send verification email
                const user= await this.authService.getUser().pipe(take(1)).toPromise();
                if(user){
                  await user.sendEmailVerification();
                }
                await this.authService.logout();
                this.router.navigate(['/login']);
              }
            },
            {
              text: 'Dismiss',
              role: 'cancel',
              handler: async () => {
                await this.authService.logout();
                this.router.navigate(['/login']);
              }
            }
          ]
        }); 
        await alert.present();
      }
    })
    .catch(err => alert(err.message));
  }

  onGoogleLogin(){
    this.authService.googleSignIn()
    .then(()=> this.router.navigate(['/home']))
    .catch(err => alert(err.message));
  }

}
