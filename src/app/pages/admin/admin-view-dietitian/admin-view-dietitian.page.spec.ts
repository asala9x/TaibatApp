import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminViewDietitianPage } from './admin-view-dietitian.page';

describe('AdminViewDietitianPage', () => {
  let component: AdminViewDietitianPage;
  let fixture: ComponentFixture<AdminViewDietitianPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewDietitianPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminViewDietitianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
