import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const html = document.documentElement;

  beforeEach(() => {
    localStorage.removeItem('bdi-theme');
    html.removeAttribute('data-bs-theme');
  });

  afterEach(() => {
    localStorage.removeItem('bdi-theme');
    html.removeAttribute('data-bs-theme');
  });

  function create(): ThemeService {
    TestBed.configureTestingModule({});
    return TestBed.inject(ThemeService);
  }

  it('applies a saved theme on creation', () => {
    localStorage.setItem('bdi-theme', 'dark');
    const service = create();
    expect(service.current).toBe('dark');
    expect(html.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('ignores an invalid saved value and still resolves to a valid theme', () => {
    localStorage.setItem('bdi-theme', 'purple');
    const service = create();
    expect(['light', 'dark']).toContain(service.current);
    expect(html.getAttribute('data-bs-theme')).toBe(service.current);
  });

  it('toggle switches the theme, updates <html> and persists the choice', () => {
    localStorage.setItem('bdi-theme', 'light');
    const service = create();

    service.toggle();
    expect(service.current).toBe('dark');
    expect(html.getAttribute('data-bs-theme')).toBe('dark');
    expect(localStorage.getItem('bdi-theme')).toBe('dark');

    service.toggle();
    expect(service.current).toBe('light');
    expect(localStorage.getItem('bdi-theme')).toBe('light');
  });

  it('does not touch authentication storage', () => {
    localStorage.setItem('userData', 'keep');
    const service = create();
    service.toggle();
    expect(localStorage.getItem('userData')).toBe('keep');
    localStorage.removeItem('userData');
  });
});
