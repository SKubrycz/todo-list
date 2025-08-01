import { TestBed } from '@angular/core/testing';
import { DarkModeComponent } from './dark-mode.component';

describe('DarkModeComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DarkModeComponent],
        }).compileComponents();
    })

    it('should create dark-mode.component', () => {
        const fixture = TestBed.createComponent(DarkModeComponent);
        const darkModeComponent = fixture.componentInstance;
        fixture.detectChanges();

        expect(darkModeComponent).toBeTruthy();
    })

    it('test', () => {
        expect(true).toBeTrue();
    })
});