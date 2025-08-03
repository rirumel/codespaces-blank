import { TestBed } from '@angular/core/testing';

import { VoiceInputService } from './voice-input.service';

describe('VoiceInputService', () => {
  let service: VoiceInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
