import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface GenerateQuestionsResponse {
  questions: string[];
}

@Component({
  selector: 'app-self-prep',
  templateUrl: './self-prep.page.html',
  styleUrls: ['./self-prep.page.scss'],
  standalone: false
})
export class SelfPrepPage implements OnInit {
  jobTitle = '';
  location = '';
  jobDescription = '';
  profileRequirement = '';
  questionsReady = false;
  isLoading = false;
  generatedQuestions: string[] = [];
  userId = '';
  generatedTestID: any = '';

  private authSubscription: Subscription | undefined;
  private apiUrl = 'https://generateinterviewquestions-818625014920.europe-west3.run.app';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.jobTitle = '';
    this.location = '';
    this.jobDescription = '';
    this.profileRequirement = '';
    this.questionsReady = false;
    this.authSubscription = this.authService.getUser().subscribe(user => {
      this.userId = user?.uid ?? '';
    });
  }

  generateQuestions() {
    if (!this.userId) {
      alert('User not logged in yet.');
      return;
    }

    if (!this.jobTitle && !this.jobDescription) {
      alert('Please enter at least a Job Title or Job Description.');
      return;
    }

    this.isLoading = true;
    const prompt = `Job Title: ${this.jobTitle}\nLocation: ${this.location}\nJob Description: ${this.jobDescription}\nProfile Requirement: ${this.profileRequirement}\n\nGenerate 5 interview questions for this job.`;

    this.http.post<GenerateQuestionsResponse>(this.apiUrl, { prompt }).subscribe({
      next: async (data) => {
        if (data?.questions) {
          const formattedQuestions = data.questions.map(q => ({ text: q, feedback: '' }));

          try {
            const id = await this.firebaseService.saveSelfPrepTest(this.userId, {
              jobTitle: this.jobTitle,
              location: this.location,
              jobDescription: this.jobDescription,
              profileRequirement: this.profileRequirement,
              questions: formattedQuestions
            });
            this.generatedTestID = id;
            this.generatedQuestions = data.questions;
            this.questionsReady = true;
          } catch (error) {
            alert('Could not save data to Firestore.');
            console.error(error);
          } finally {
            this.isLoading = false;
          }
        } else {
          alert('No questions returned from the server');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
        alert('Failed to generate questions.');
        this.isLoading = false;
      }
    });
  }

  startTest() {
    if (!this.generatedTestID) {
      alert('No test found to start.');
      return;
    }
    this.router.navigate(['/self-prep-test'], {
      state: {
        questions: this.generatedQuestions.map(q => ({
          text: q,
          feedback: '',
          answerText: '',
          answerURL: '',
          aiFeedback: ''
        })),
        testID: this.generatedTestID,
        userId: this.userId
      }
    });
  }

  async confirmReset() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Reset',
      message: 'Are you sure you want to reset? It will remove your current test.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => this.resetForm()
        }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  resetForm() {
    this.jobTitle = '';
    this.location = '';
    this.jobDescription = '';
    this.profileRequirement = '';
    this.questionsReady = false;
    this.generatedQuestions = [];
    this.generatedTestID = '';
    this.isLoading = false;
  }

  logout() {
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

  navigateHome() {
    this.router.navigate(['/home']);
  }
}

