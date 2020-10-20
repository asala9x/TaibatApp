import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeopleRegisterPage } from './people-register.page';

describe('PeopleRegisterPage', () => {
  let component: PeopleRegisterPage;
  let fixture: ComponentFixture<PeopleRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleRegisterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
