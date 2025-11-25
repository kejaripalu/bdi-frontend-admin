import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetaSimbolHelpComponent } from './peta-simbol-help.component';

describe('PetaSimbolHelpComponent', () => {
  let component: PetaSimbolHelpComponent;
  let fixture: ComponentFixture<PetaSimbolHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetaSimbolHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetaSimbolHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
