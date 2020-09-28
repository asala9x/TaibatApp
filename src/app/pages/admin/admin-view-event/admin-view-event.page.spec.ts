import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminViewEventPage } from './admin-view-event.page';

describe('AdminViewEventPage', () => {
  let component: AdminViewEventPage;
  let fixture: ComponentFixture<AdminViewEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminViewEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
