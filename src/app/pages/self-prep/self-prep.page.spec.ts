import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfPrepPage } from './self-prep.page';

describe('SelfPrepPage', () => {
  let component: SelfPrepPage;
  let fixture: ComponentFixture<SelfPrepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfPrepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
