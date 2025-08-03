import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class VoiceInputService {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: BlobPart[] = [];
  private isRecording = false;

  constructor(private storage: AngularFireStorage) { }

  /** Start recording audio */
  async startRecording(): Promise<void> {
    if (this.isRecording) return;
    this.isRecording = true;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  /** Stop recording and return the audio Blob */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.isRecording) resolve(new Blob());

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /** Upload audio blob to Firebase Storage and return the file URL */
  async uploadAudio(userID: string, blob: Blob): Promise<string> {
    if (!userID) throw new Error('User ID is missing.');

    const filePath = `answers/${userID}/${uuidv4()}.webm`;
    const fileRef = this.storage.ref(filePath);
    await fileRef.put(blob);
    return await fileRef.getDownloadURL().toPromise();
  }
}
