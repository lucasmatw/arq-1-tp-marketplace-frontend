import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBatchComponent } from './productsbatch.component';

describe('ProductsBatchComponent', () => {
  let component: ProductsBatchComponent;
  let fixture: ComponentFixture<ProductsBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsBatchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
