import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MhDesign } from './mh-design';

describe('MhDesign', () => {
  let component: MhDesign;
  let fixture: ComponentFixture<MhDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MhDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(MhDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
