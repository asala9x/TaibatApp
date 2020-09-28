import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminViewAdvicePage } from './admin-view-advice.page';

describe('AdminViewAdvicePage', () => {
  let component: AdminViewAdvicePage;
  let fixture: ComponentFixture<AdminViewAdvicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewAdvicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminViewAdvicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
