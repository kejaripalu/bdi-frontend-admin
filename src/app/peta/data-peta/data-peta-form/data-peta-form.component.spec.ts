import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPetaFormComponent } from './data-peta-form.component';

describe('DataPetaFormComponent', () => {
  let component: DataPetaFormComponent;
  let fixture: ComponentFixture<DataPetaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPetaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPetaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
