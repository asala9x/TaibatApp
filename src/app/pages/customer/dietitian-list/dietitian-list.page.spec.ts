import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DietitianListPage } from './dietitian-list.page';

describe('DietitianListPage', () => {
  let component: DietitianListPage;
  let fixture: ComponentFixture<DietitianListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietitianListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DietitianListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
