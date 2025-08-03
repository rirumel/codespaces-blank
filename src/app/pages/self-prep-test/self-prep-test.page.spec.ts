import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfPrepTestPage } from './self-prep-test.page';

describe('SelfPrepTestPage', () => {
  let component: SelfPrepTestPage;
  let fixture: ComponentFixture<SelfPrepTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfPrepTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
