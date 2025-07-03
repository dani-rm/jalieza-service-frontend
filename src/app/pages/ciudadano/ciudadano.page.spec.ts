import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CiudadanoPage } from './ciudadano.page';

describe('CiudadanoPage', () => {
  let component: CiudadanoPage;
  let fixture: ComponentFixture<CiudadanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
