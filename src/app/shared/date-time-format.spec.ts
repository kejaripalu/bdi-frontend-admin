import { CurrentDateTimeService } from './curent-date-time.service';
import { MonthConverterService } from './month-converter.service';

describe('date and time formatting', () => {
  const months = new MonthConverterService();
  const clock = new CurrentDateTimeService();

  it('builds month ranges as plain yyyy-MM-dd strings (no Date, so no timezone shift)', () => {
    expect(months.getStartDate(1, '2026')).toBe('2026-01-01');
    expect(months.getEndDate(1, '2026')).toBe('2026-01-31');
    expect(months.getEndDate(2, '2024')).toBe('2024-02-29');
    expect(months.getEndDate(2, '2026')).toBe('2026-02-28');
    expect(months.getEndDate(2, '2100')).toBe('2100-02-28');
    expect(months.getEndDate(2, '2000')).toBe('2000-02-29');
    expect(months.getStartDate(12, '2026')).toBe('2026-12-01');
    expect(months.getEndDate(12, '2026')).toBe('2026-12-31');
  });

  it('pads date-picker values to yyyy-MM-dd without converting through Date', () => {
    expect(clock.getConvertCurrentDate(2026, 3, 7)).toBe('2026-03-07');
    expect(clock.getConvertCurrentDate(2026, 12, 31)).toBe('2026-12-31');
  });

  it('formats dates and times in the shapes the API accepts', () => {
    expect(clock.getCurrentDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(clock.getCurrentTime()).toMatch(/^\d{2}:\d{2}$/);
  });
});
