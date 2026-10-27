import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error';

function httpError(status: number, message?: string): HttpErrorResponse {
  const body = message === undefined ? null : { status, message, timestamp: 1790000000 };
  return new HttpErrorResponse({ status, error: body });
}

const validationMessage =
  "Validation failed for argument [0] in public ResponseEntity create(SuratMasukDTO): " +
  "[Field error in object 'suratMasukDTO' on field 'asal': rejected value [null]; default message [must not be blank]] " +
  "[Field error in object 'suratMasukDTO' on field 'nomorSurat': rejected value []; default message [must not be blank]]";

describe('ApiError', () => {
  it('extracts every field name from a bean validation message', () => {
    expect(ApiError.invalidFields(httpError(400, validationMessage))).toEqual(['asal', 'nomorSurat']);
  });

  it('maps bean validation to a readable message with field labels', () => {
    expect(ApiError.messageFor(httpError(400, validationMessage))).toBe('Isian tidak valid: Asal, Nomor Surat.');
  });

  it('humanizes camelCase field names', () => {
    expect(ApiError.humanizeField('tanggalPenerimaanSurat')).toBe('Tanggal Penerimaan Surat');
  });

  it('maps INVALID_DATE_FORMAT, INVALID_BIDANG_DIREKTORAT and JSON parse errors', () => {
    expect(ApiError.messageFor(httpError(400, 'INVALID_DATE_FORMAT'))).toContain('yyyy-MM-dd');
    expect(ApiError.messageFor(httpError(400, 'INVALID_BIDANG_DIREKTORAT'))).toContain('Bidang');
    expect(ApiError.messageFor(httpError(400, 'JSON parse error: Cannot deserialize'))).toContain('HH:mm');
  });

  it('maps 403 (empty body) and 401 without needing a body', () => {
    expect(ApiError.messageFor(new HttpErrorResponse({ status: 403, error: null }))).toBe(ApiError.forbidden);
    expect(ApiError.messageFor(new HttpErrorResponse({ status: 401, error: { result: 'AUTHENTICATION_FAILED' } })))
      .toBe(ApiError.unauthorized);
  });

  it('leaves ID_NOT_FOUND, INVALID_DATA_INTEGRITY and connection errors to the caller', () => {
    expect(ApiError.messageFor(httpError(404, 'ID_NOT_FOUND'))).toBeNull();
    expect(ApiError.messageFor(httpError(400, 'INVALID_DATA_INTEGRITY'))).toBeNull();
    expect(ApiError.messageFor(new HttpErrorResponse({ status: 0 }))).toBeNull();
  });
});
