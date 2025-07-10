import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarCargoPage } from './agregar-cargo.page';

describe('AgregarCargoPage', () => {
  let component: AgregarCargoPage;
  let fixture: ComponentFixture<AgregarCargoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCargoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
