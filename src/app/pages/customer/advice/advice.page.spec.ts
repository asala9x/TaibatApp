import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvicePage } from './advice.page';

describe('AdvicePage', () => {
  let component: AdvicePage;
  let fixture: ComponentFixture<AdvicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
