import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPetaListComponent } from './data-peta-list.component';

describe('DataPetaListComponent', () => {
  let component: DataPetaListComponent;
  let fixture: ComponentFixture<DataPetaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPetaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPetaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
