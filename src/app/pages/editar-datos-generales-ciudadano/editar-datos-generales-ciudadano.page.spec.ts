import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarDatosGeneralesCiudadanoPage } from './editar-datos-generales-ciudadano.page';

describe('EditarDatosGeneralesCiudadanoPage', () => {
  let component: EditarDatosGeneralesCiudadanoPage;
  let fixture: ComponentFixture<EditarDatosGeneralesCiudadanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDatosGeneralesCiudadanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
