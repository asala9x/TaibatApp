import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerTabPage } from './customer-tab.page';

describe('CustomerTabPage', () => {
  let component: CustomerTabPage;
  let fixture: ComponentFixture<CustomerTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
