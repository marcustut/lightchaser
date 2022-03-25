import { GoogleSpreadsheetRow } from 'google-spreadsheet';

const sheetHeaders = [
  'Timestamp',
  'Full Name (As per IC) 英文全名(依照身份证)',
  'Identity Card (IC) No.  身份证号码',
  'Age 年龄',
  'Gender 性别',
  'Contact Number 联络号码',
  'Satellite 分堂',
  'CG Name 小组名称',
  'Status 身份',
  'T-Shirt Size',
] as const;

export type Registration = {
  created_at: string;
  name: string;
  ic: string;
  age: string;
  gender: string;
  phone_number: string;
  satellite: string;
  cg: string;
  status: string;
  shirt_size: string;
};

export const MapToRegistration = (row: GoogleSpreadsheetRow): Registration => ({
  created_at: row[sheetHeaders[0]],
  name: row[sheetHeaders[1]],
  ic: row[sheetHeaders[2]],
  age: row[sheetHeaders[3]],
  gender: row[sheetHeaders[4]],
  phone_number: row[sheetHeaders[5]],
  satellite: row[sheetHeaders[6]],
  cg: row[sheetHeaders[7]],
  status: row[sheetHeaders[8]],
  shirt_size: row[sheetHeaders[9]],
});
