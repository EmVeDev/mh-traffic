import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MhI18n } from './mh-i18n';

describe('MhI18n', () => {
  let component: MhI18n;
  let fixture: ComponentFixture<MhI18n>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MhI18n],
    }).compileComponents();

    fixture = TestBed.createComponent(MhI18n);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
