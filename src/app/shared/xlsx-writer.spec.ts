import { buildXlsx, columnLetter, crc32, sheetNameOf, xmlEscape, zipStore } from './xlsx-writer';

const decoder = new TextDecoder();

/** Reads the entries of a "stored" zip written by zipStore. */
function readZip(zip: Uint8Array): Record<string, string> {
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const files: Record<string, string> = {};
  let offset = 0;
  while (view.getUint32(offset, true) === 0x04034B50) {
    const crc = view.getUint32(offset + 14, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const name = decoder.decode(zip.subarray(offset + 30, offset + 30 + nameLength));
    const data = zip.subarray(offset + 30 + nameLength, offset + 30 + nameLength + size);
    expect(crc32(data)).toBe(crc);
    files[name] = decoder.decode(data);
    offset += 30 + nameLength + size;
  }
  return files;
}

describe('xlsx-writer', () => {
  it('crc32 matches the standard check value', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xCBF43926);
  });

  it('zipStore writes readable entries with a valid end-of-central-directory record', () => {
    const zip = zipStore([
      { name: 'a.txt', data: new TextEncoder().encode('halo') },
      { name: 'dir/b.txt', data: new TextEncoder().encode('dunia ✓') }
    ]);
    expect(readZip(zip)).toEqual({ 'a.txt': 'halo', 'dir/b.txt': 'dunia ✓' });
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054B50);
    expect(view.getUint16(zip.length - 22 + 10, true)).toBe(2);
  });

  it('escapes XML and removes characters XML cannot hold', () => {
    expect(xmlEscape('<a href="x">&</a>\u0001\u0008')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });

  it('converts column indexes to letters', () => {
    expect([0, 1, 25, 26, 27, 701, 702].map(columnLetter)).toEqual(['A', 'B', 'Z', 'AA', 'AB', 'ZZ', 'AAA']);
  });

  it('cleans sheet names to Excel limits', () => {
    expect(sheetNameOf('Register: Surat/Masuk [Biasa]')).toBe('Register Surat Masuk Biasa');
    expect(sheetNameOf('x'.repeat(50)).length).toBe(31);
    expect(sheetNameOf('///')).toBe('Data');
  });

  it('buildXlsx produces the workbook parts and writes cells as inline text (never formulas)', () => {
    const files = readZip(buildXlsx({
      name: 'Register Surat Masuk',
      titleRows: ['Register Surat Masuk', 'Oktober 2026'],
      header: ['No', 'Asal'],
      rows: [[1, '=HYPERLINK("http://x")'], [2, 'baris 1\nbaris 2 & <b>']],
      footer: 'Total: 2 data'
    }));
    expect(Object.keys(files).sort()).toEqual([
      '[Content_Types].xml', '_rels/.rels', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml',
      'xl/workbook.xml', 'xl/worksheets/sheet1.xml']);
    const sheet = files['xl/worksheets/sheet1.xml'];
    expect(sheet).toContain('<c r="A1" s="1" t="inlineStr"><is><t xml:space="preserve">Register Surat Masuk</t>');
    expect(sheet).toContain('<c r="A5" s="3"><v>1</v></c>');
    expect(sheet).toContain('&lt;b&gt;');
    expect(sheet).not.toContain('<f>');
    expect(sheet).toContain('t="inlineStr"><is><t xml:space="preserve">=HYPERLINK(&quot;http://x&quot;)</t>');
    expect(sheet).toContain('ySplit="4"');
    expect(files['xl/workbook.xml']).toContain('<sheet name="Register Surat Masuk"');
  });
});
