import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateEventPage } from './update-event.page';

describe('UpdateEventPage', () => {
  let component: UpdateEventPage;
  let fixture: ComponentFixture<UpdateEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
