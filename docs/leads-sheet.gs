/**
 * Branding Catalyst: website leads → Google Sheet.
 *
 * Setup (5 minutes, see docs/SETUP.md "Leads Google Sheet"):
 *  1. Create a new Google Sheet named "Website Leads".
 *  2. Extensions → Apps Script. Delete what is there and paste this whole file.
 *  3. Change SECRET below to a long random phrase (letters and numbers only).
 *  4. Deploy → New deployment → type "Web app"
 *       Execute as: Me      Who has access: Anyone
 *     Click Deploy, allow access, and copy the Web app URL.
 *  5. In Vercel → Settings → Environment Variables add
 *       LEADS_SHEET_URL    = the Web app URL
 *       LEADS_SHEET_SECRET = the same SECRET as below
 *     and redeploy.
 *
 * Each lead becomes one row. Use the "Status" column to track follow-up:
 * New → Contacted → Call booked → Quote sent → Won / Lost.
 */
const SECRET = 'CHANGE-ME-to-a-long-random-phrase';

const COLUMNS = [
  ['at', 'Received (UTC)'], ['status', 'Status'], ['type', 'From'], ['quality', 'Quality'],
  ['name', 'Name'], ['phone', 'WhatsApp / phone'], ['email', 'Email'], ['service', 'Service'],
  ['project', 'Project (AI)'], ['summary', 'Summary (AI)'], ['needs', 'Needs (AI)'], ['timeline', 'Timeline'],
  ['budget', 'Budget'], ['message', 'Message'], ['next_step', 'Suggested next step'],
  ['source', 'Form / button'], ['page', 'Page'],
  ['utm_source', 'Ad source'], ['utm_medium', 'Medium'], ['utm_campaign', 'Campaign'], ['utm_term', 'Keyword'],
  ['utm_content', 'Ad'], ['gclid', 'Google click ID'], ['fbclid', 'Meta click ID'],
  ['landing', 'First landing page'], ['referrer', 'Referrer'], ['first_visit', 'First visit'], ['chat', 'ARC chat']
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) return json({ ok: false, error: 'bad secret' });
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map(c => c[1]));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    }
    const lead = Object.assign({}, body.lead, { status: 'New' });
    // a leading "=" "+" "-" or "@" would make Sheets treat text as a formula
    const safe = v => { const s = v == null ? '' : String(v); return /^[=+\-@]/.test(s) ? "'" + s : s; };
    sheet.appendRow(COLUMNS.map(c => safe(lead[c[0]])));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
