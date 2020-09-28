import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminViewProductPage } from './admin-view-product.page';

describe('AdminViewProductPage', () => {
  let component: AdminViewProductPage;
  let fixture: ComponentFixture<AdminViewProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminViewProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
