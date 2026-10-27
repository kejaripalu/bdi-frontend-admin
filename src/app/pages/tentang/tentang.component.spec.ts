import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentangComponent } from './tentang.component';

describe('TentangComponent', () => {
  let fixture: ComponentFixture<TentangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TentangComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TentangComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the page title as the main heading', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(heading?.textContent).toContain('Tentang');
  });
});
