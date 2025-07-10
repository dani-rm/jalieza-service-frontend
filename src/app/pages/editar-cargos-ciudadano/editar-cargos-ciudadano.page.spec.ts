import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCargosCiudadanoPage } from './editar-cargos-ciudadano.page';

describe('EditarCargosCiudadanoPage', () => {
  let component: EditarCargosCiudadanoPage;
  let fixture: ComponentFixture<EditarCargosCiudadanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCargosCiudadanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
