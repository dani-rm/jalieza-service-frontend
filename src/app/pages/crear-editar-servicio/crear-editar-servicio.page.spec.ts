import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearEditarServicioPage } from './crear-editar-servicio.page';

describe('CrearEditarServicioPage', () => {
  let component: CrearEditarServicioPage;
  let fixture: ComponentFixture<CrearEditarServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEditarServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
