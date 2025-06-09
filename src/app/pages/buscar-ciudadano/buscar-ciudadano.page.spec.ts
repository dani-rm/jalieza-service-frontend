import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarCiudadanoPage } from './buscar-ciudadano.page';

describe('BuscarCiudadanoPage', () => {
  let component: BuscarCiudadanoPage;
  let fixture: ComponentFixture<BuscarCiudadanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCiudadanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
