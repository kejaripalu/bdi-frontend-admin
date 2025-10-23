import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPetaHelpComponent } from './data-peta-help.component';

describe('DataPetaHelpComponent', () => {
  let component: DataPetaHelpComponent;
  let fixture: ComponentFixture<DataPetaHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPetaHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPetaHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
