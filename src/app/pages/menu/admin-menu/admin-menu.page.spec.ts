import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminMenuPage } from './admin-menu.page';

describe('AdminMenuPage', () => {
  let component: AdminMenuPage;
  let fixture: ComponentFixture<AdminMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
