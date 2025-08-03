import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuidv4 } from 'uuid';
import { runInInjectionContext, Injector } from '@angular/core';
import { VoiceInputService } from 'src/app/services/voice-input.service';

@Component({
  selector: 'app-self-prep-test',
  templateUrl: './self-prep-test.page.html',
  styleUrls: ['./self-prep-test.page.scss'],
  standalone: false
})
export class SelfPrepTestPage implements OnInit {
  questions: any[] = [];
  answers: string[] = [];
  currentIndex: number = 0;
  isAnswered: boolean = false;

  currentMode: 'text' | 'voice' | null = null;

  recognition: any;

  userID = '';
  testID = '';
  isRecording = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private ngZone: NgZone,
    private injector: Injector,
    private voiceService: VoiceInputService
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const q = nav?.extras.state?.['questions'] || [];
    this.questions = q;
    this.testID = nav?.extras.state?.['testID'] || '';
    this.userID = nav?.extras.state?.['userId'] || '';
    this.answers = new Array(this.questions.length).fill('');
  }

  async toggleRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      await this.voiceService.startRecording();
      this.currentMode = 'voice';
    } else {
      const audioBlob = await this.voiceService.stopRecording();
      this.isRecording = false;

      // ✅ Upload to Firestorage
      const downloadURL = await this.voiceService.uploadAudio(this.userID, audioBlob);

      // ✅ Save URL to Firestore (existing document)
      await this.saveAnswer(this.currentIndex, '', downloadURL);

      // Mark as answered
      this.answers[this.currentIndex] = 'Voice answer recorded';
      this.isAnswered = true;
    }
  }

  onInputChange(mode: 'text' | 'voice') {
    if (this.currentMode && this.currentMode !== mode && this.answers[this.currentIndex]) {
      if (!confirm('Switching input will discard previous answer. Continue?')) {
        return;
      }
      this.answers[this.currentIndex] = '';
    }
    this.currentMode = mode;
    this.isAnswered = this.answers[this.currentIndex]?.trim().length > 0;
  }

  async nextQuestion() {
    const mode = this.currentMode;
    if (!mode) return;

    if (mode === 'text') {
      await this.saveAnswer(this.currentIndex, this.answers[this.currentIndex], '');
    }

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.isAnswered = this.answers[this.currentIndex]?.trim().length > 0;
      this.currentMode = null;
    } else {
      await this.generateAIFeedback();
      this.router.navigate(['/thank-you']);
    }
  }

  async saveAnswer(index: number, text: string, url: string) {
    if (!this.userID || !this.testID) {
      console.error("Missing userID or testID. Cannot update answer.");
      return;
    }

    console.log("Saving answer for test:", this.testID);
    const path = `users/${this.userID}/selfPrepTests/${this.testID}`;

    return await runInInjectionContext(this.injector, async () => {
      const docRef = this.firestore.doc(path);
      const snapshot = await docRef.get().toPromise();
      const data = snapshot?.data() as { questions?: any[] };

      if (!data?.questions || !data.questions[index]) {
        console.error("Question index not found.");
        return;
      }

      // Preserve existing data
      const updatedQuestions = [...data.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        answerText: text,
        answerURL: url
      };

      // ✅ Merge updated questions back
      await docRef.set({ questions: updatedQuestions }, { merge: true });
      console.log(`✅ Answer for Q${index} saved successfully`);
    });
  }

  async generateAIFeedback() {
    const docRef = this.firestore.doc(`users/${this.userID}/selfPrepTests/${this.testID}`);
    const doc = await docRef.get().toPromise();
    const data = doc?.data() as { questions?: any[] };

    if (data?.questions) {
      const updatedQuestions = await Promise.all(
        data.questions.map(async (q: any) => {
          const answer = q.answerText || `Voice answer saved at: ${q.answerURL}`;
          const feedback = await this.getAIImprovementFeedback(answer);
          return { ...q, aiFeedback: feedback };
        })
      );

      await docRef.update({ questions: updatedQuestions });
    }
  }

  async getAIImprovementFeedback(answer: string): Promise<string> {
    // TODO: Replace with Cloud Function call to OpenAI
    return `Suggested improvement for: "${answer}"`;
  }

}