import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarCiudadanoPage } from './registrar-ciudadano.page';

describe('RegistrarCiudadanoPage', () => {
  let component: RegistrarCiudadanoPage;
  let fixture: ComponentFixture<RegistrarCiudadanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCiudadanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
