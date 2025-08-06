import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { DarkModeComponent } from '../dark-mode/dark-mode.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render router-outlet and app-dark-mode', () => {
    const routerOutletElement = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutletElement).toBeDefined();
    expect(routerOutletElement).toBeTruthy();

    const appDarkModeElement = fixture.debugElement.query(
      By.directive(DarkModeComponent)
    );
    expect(appDarkModeElement).toBeDefined();
    expect(appDarkModeElement).toBeTruthy();
  });
});
