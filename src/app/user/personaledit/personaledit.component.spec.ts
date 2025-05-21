import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaleditComponent } from './personaledit.component';

describe('PersonaleditComponent', () => {
  let component: PersonaleditComponent;
  let fixture: ComponentFixture<PersonaleditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaleditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaleditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
