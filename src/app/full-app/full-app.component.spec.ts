import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAppComponent } from './full-app.component';

describe('FullAppComponent', () => {
  let component: FullAppComponent;
  let fixture: ComponentFixture<FullAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
