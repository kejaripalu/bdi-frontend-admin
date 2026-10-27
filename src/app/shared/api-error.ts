import { HttpErrorResponse } from '@angular/common/http';

/**
 * Maps backend error responses (see API contract) to user-facing Indonesian messages.
 * Error body: { status, message, timestamp(epoch seconds) }; 401 body: { result }; 403 body is empty.
 */
export class ApiError {

  static readonly unauthorized = 'Sesi berakhir atau tidak valid. Silakan login kembali.';
  static readonly forbidden = 'Anda tidak memiliki izin untuk melakukan aksi ini.';

  /** Field names reported by bean validation ("... on field 'namaField' ..."). */
  static invalidFields(error: HttpErrorResponse): string[] {
    const message = ApiError.messageText(error);
    return Array.from(message.matchAll(/on field '(\w+)'/g), match => match[1]);
  }

  /** "tanggalSurat" -> "Tanggal Surat" */
  static humanizeField(field: string): string {
    const spaced = field.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  /**
   * Message for errors that are the same in every register, or null when the caller's own
   * mapping (ID_NOT_FOUND, INVALID_DATA_INTEGRITY, connection errors) should apply.
   */
  static messageFor(error: HttpErrorResponse): string | null {
    if (error.status === 401) {
      return ApiError.unauthorized;
    }
    if (error.status === 403) {
      return ApiError.forbidden;
    }
    if (error.status !== 400) {
      return null;
    }
    const message = ApiError.messageText(error);
    if (message.startsWith('INVALID_DATE_FORMAT')) {
      return 'Format tanggal tidak valid. Gunakan format yyyy-MM-dd.';
    }
    if (message.startsWith('INVALID_BIDANG_DIREKTORAT')) {
      return 'Bidang direktorat tidak valid.';
    }
    if (message.startsWith('Validation failed')) {
      const fields = ApiError.invalidFields(error).map(ApiError.humanizeField);
      return fields.length > 0
        ? 'Isian tidak valid: ' + fields.join(', ') + '.'
        : 'Isian tidak valid. Periksa kembali data.';
    }
    if (message.startsWith('JSON parse error')) {
      return 'Format isian tidak valid. Periksa pilihan dan format jam (HH:mm).';
    }
    return null;
  }

  private static messageText(error: HttpErrorResponse): string {
    const message = error.error?.message;
    return typeof message === 'string' ? message : '';
  }
}
