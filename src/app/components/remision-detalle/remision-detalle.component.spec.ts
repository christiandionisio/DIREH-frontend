import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionDetalleComponent } from './remision-detalle.component';

describe('RemisionDetalleComponent', () => {
  let component: RemisionDetalleComponent;
  let fixture: ComponentFixture<RemisionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemisionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
