import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabasePrepPage } from './database-prep.page';

describe('DatabasePrepPage', () => {
  let component: DatabasePrepPage;
  let fixture: ComponentFixture<DatabasePrepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabasePrepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
