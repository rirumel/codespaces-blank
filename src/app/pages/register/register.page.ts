import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  email= "";
  password= "";

  constructor(
    private authSerive: AuthService, 
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  onRegister(){
    this.authSerive.register(this.email, this.password)
    .then(async ()=>{
      const alert = await this.alertCtrl.create({
        header: 'Verify your email',
        message: 'A verification link has been sent to your email. Please verify your account before logging in.',
        buttons: [
          {
            text: 'Go to Login',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alert.present();
    })
    .catch(err => this.showError(err.message));
  }

  async showError(message: string){
    const alert = await this.alertCtrl.create({
      header: 'Registration Failed',
      message,
      buttons: ['OK'],
      backdropDismiss: false
    });
    await alert.present();
  }

}
