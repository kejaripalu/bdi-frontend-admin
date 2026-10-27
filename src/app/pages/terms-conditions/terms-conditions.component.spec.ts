import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsComponent } from './terms-conditions.component';

describe('TermsConditionsComponent', () => {
  let fixture: ComponentFixture<TermsConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsConditionsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsConditionsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the page title as the main heading', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(heading?.textContent).toContain('Terms & Conditions');
  });
});
