import xlsx from 'xlsx';

/**
 * @param {Buffer} buffer - Excel file buffer
 * @returns Parsed sheet JSON
 */

export const parseExcelFile = (buffer) => {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
};