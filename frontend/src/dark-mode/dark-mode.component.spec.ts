import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarkModeComponent } from './dark-mode.component';
import { DOCUMENT } from '@angular/common';

describe('DarkModeComponent', () => {
  let fixture: ComponentFixture<DarkModeComponent>;
  let darkModeComponent: DarkModeComponent;
  let document: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DarkModeComponent);
    darkModeComponent = fixture.componentInstance;
    document = TestBed.inject(DOCUMENT);
  });

  it('should create dark-mode.component', () => {
    fixture.detectChanges();

    expect(darkModeComponent).toBeTruthy();
  });

  it('should toggle background color class', () => {
    fixture.detectChanges();

    darkModeComponent['darkMode'] = true;
    darkModeComponent['updateDarkMode'].apply(darkModeComponent, [false]);

    expect(
      document.documentElement.classList.contains('my-app-light')
    ).toBeTrue();
    expect(
      document.documentElement.classList.contains('my-app-dark')
    ).toBeFalse();

    darkModeComponent['updateDarkMode'].apply(darkModeComponent, [true]);

    expect(
      document.documentElement.classList.contains('my-app-light')
    ).toBeFalse();
    expect(
      document.documentElement.classList.contains('my-app-dark')
    ).toBeTrue();
  });
});
