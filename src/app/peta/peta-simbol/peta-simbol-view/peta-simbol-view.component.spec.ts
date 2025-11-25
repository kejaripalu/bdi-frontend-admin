import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetaSimbolViewComponent } from './peta-simbol-view.component';

describe('PetaSimbolViewComponent', () => {
  let component: PetaSimbolViewComponent;
  let fixture: ComponentFixture<PetaSimbolViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetaSimbolViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetaSimbolViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
