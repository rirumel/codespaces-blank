import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private injector: Injector) {
    console.log('✅ FirebaseService initialized:', 
      this.firestore ? 'Firestore available' : 'Firestore NOT available');
  }

  /**
   * Test Firestore connection
   */
  testFirestoreConnection(): boolean {
    console.log('🔍 Firestore instance:', this.firestore);
    return !!this.firestore;
  }

  /**
   * Save a self-prep test document for a user
   * @param userID - Authenticated user's UID
   * @param data - Object containing job info and questions array
   */
  async saveSelfPrepTest(userID: string, data: any) {
    console.log('📌 Attempting to save data for userID:', userID);

    if (!userID) {
      console.error('❌ No userID provided, cannot save document.');
      throw new Error('User ID is missing.');
    }

    if (!this.firestore) {
      console.error('❌ Firestore instance not available.');
      throw new Error('Firestore not initialized.');
    }

    try {
      return await runInInjectionContext(this.injector, async () => {
        const docRef = await this.firestore
          .collection(`users/${userID}/selfPrepTests`)
          .add({
            ...data,
            createdAt: new Date()
          });

        console.log('✅ Document successfully written with ID:', docRef.id);
        return docRef.id;
      });
    } catch (error) {
      console.error('❌ Error writing document to Firestore:', error);
      throw error;
    }
  }

  /**
   * Get all self-prep tests for a user
   * @param userID - Authenticated user's UID
   */
  getSelfPrepTests(userID: string) {
    console.log('📥 Fetching self-prep tests for user:', userID);

    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(`users/${userID}/selfPrepTests`, ref =>
          ref.orderBy('createdAt', 'desc')
        )
        .valueChanges({ idField: 'id' });
    });
  }

  /**
   * Update feedback for a specific question in a self-prep test
   * @param userID - Authenticated user's UID
   * @param testID - Document ID of the self-prep test
   * @param questionIndex - Index of the question to update
   * @param feedback - Feedback text
   */
  async updateQuestionFeedback(userID: string, testID: string, questionIndex: number, feedback: string) {
    console.log(`✏️ Updating feedback for user ${userID}, test ${testID}, question index ${questionIndex}`);

    try {
      await runInInjectionContext(this.injector, async () => {
        await this.firestore
          .doc(`users/${userID}/selfPrepTests/${testID}`)
          .update({
            [`questions.${questionIndex}.feedback`]: feedback
          });
      });

      console.log('✅ Feedback updated successfully.');
    } catch (error) {
      console.error('❌ Error updating feedback:', error);
      throw error;
    }
  }
}