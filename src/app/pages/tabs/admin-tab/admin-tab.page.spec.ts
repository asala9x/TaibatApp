import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminTabPage } from './admin-tab.page';

describe('AdminTabPage', () => {
  let component: AdminTabPage;
  let fixture: ComponentFixture<AdminTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
