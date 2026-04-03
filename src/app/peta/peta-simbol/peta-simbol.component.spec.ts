import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetaSimbolComponent } from './peta-simbol.component';

describe('PetaSimbolComponent', () => {
  let component: PetaSimbolComponent;
  let fixture: ComponentFixture<PetaSimbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetaSimbolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetaSimbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
