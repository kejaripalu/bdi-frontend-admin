import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { SuratMasukService } from './surat-masuk.service';

describe('SuratMasukService (API contract)', () => {
  let service: SuratMasukService;
  let controller: HttpTestingController;
  const base = environment.baseUrl + '/surat-masuk';

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SuratMasukService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('lists with 0-based pages, sizes, jenisSurat and a yyyy-MM-dd range, and keeps the Page fields', () => {
    let result: any;
    service.getSuratMasuk(0, 20, 'BIASA', 2, '2026').subscribe(r => (result = r));
    const req = controller.expectOne(r => r.url.startsWith(base + '?'));
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toContain('pages=0&sizes=20&jenisSurat=BIASA&startDate=2026-02-01&endDate=2026-02-28');
    req.flush({ content: [{ ids: 'u-1' }], totalElements: 41, totalPages: 3, number: 1, size: 20 });
    expect(result.content[0].ids).toBe('u-1');
    expect(result.totalElements).toBe(41);
    expect(result.totalPages).toBe(3);
    expect(result.number).toBe(1);
  });

  it('url-encodes the search value', () => {
    service.getSearchSuratMasuk('a&b c', 0, 20, 'RAHASIA', '2026').subscribe();
    const req = controller.expectOne(r => r.url.startsWith(base + '/search'));
    expect(req.request.url).toContain('value=a%26b%20c');
    expect(req.request.url).toContain('jenisSurat=RAHASIA');
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 });
  });

  it('reads detail from /{ids}/detail', () => {
    service.getOneSuratMasuk('abc').subscribe();
    controller.expectOne(base + '/abc/detail').flush({ ids: 'abc' });
  });

  it('maps 403 on create to the permission message', () => {
    let message = '';
    service.createSuratMasuk({} as any).subscribe({ error: m => (message = m) });
    controller.expectOne(base).flush(null, { status: 403, statusText: 'Forbidden' });
    expect(message).toContain('tidak memiliki izin');
  });

  it('maps validation errors on create to the invalid field names', () => {
    let message = '';
    service.createSuratMasuk({} as any).subscribe({ error: m => (message = m) });
    controller.expectOne(base).flush(
      { status: 400, message: "Validation failed ... on field 'perihal': rejected", timestamp: 1 },
      { status: 400, statusText: 'Bad Request' });
    expect(message).toBe('Isian tidak valid: Perihal.');
  });

  it('maps INVALID_DATA_INTEGRITY on update to the duplicate-number message', () => {
    let message = '';
    service.updateSuratMasuk({} as any, 'abc').subscribe({ error: m => (message = m) });
    controller.expectOne(base + '/abc').flush(
      { status: 400, message: 'INVALID_DATA_INTEGRITY', timestamp: 1 },
      { status: 400, statusText: 'Bad Request' });
    expect(message).toContain('Nomor sudah dipakai');
  });
});
