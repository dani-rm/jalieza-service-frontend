import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearComunicadoPage } from './crear-comunicado.page';

describe('CrearComunicadoPage', () => {
  let component: CrearComunicadoPage;
  let fixture: ComponentFixture<CrearComunicadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearComunicadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
