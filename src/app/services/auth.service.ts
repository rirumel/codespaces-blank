import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Email/Password signup
  async register(email: string, password: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await userCredential.user?.sendEmailVerification();
    return userCredential;
  }

  // Email/Password login
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Google sign-in
  // async googleSignIn() {
  //   try{
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     provider.setCustomParameters({ prompt: 'select_account' });

  //     const result = await this.afAuth.signInWithPopup(provider);

  //     if (result.user && !result.user.emailVerified) {
  //       await result.user.sendEmailVerification();
  //     }

  //     return result;
  //   }
  //   catch(error){
  //     console.error('Google Sign-in Error', error);
  //     throw error;
  //   }
  // }
  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });

    return this.afAuth.signInWithRedirect(provider);
  }


  logout() {
    return this.afAuth.signOut();
  }

  getUser() {
    return this.afAuth.authState;
  }
}
