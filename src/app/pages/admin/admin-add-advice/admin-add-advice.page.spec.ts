import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminAddAdvicePage } from './admin-add-advice.page';

describe('AdminAddAdvicePage', () => {
  let component: AdminAddAdvicePage;
  let fixture: ComponentFixture<AdminAddAdvicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddAdvicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddAdvicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
