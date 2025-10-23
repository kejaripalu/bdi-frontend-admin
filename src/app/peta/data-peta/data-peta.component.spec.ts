import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPetaComponent } from './data-peta.component';

describe('DataPetaComponent', () => {
  let component: DataPetaComponent;
  let fixture: ComponentFixture<DataPetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
