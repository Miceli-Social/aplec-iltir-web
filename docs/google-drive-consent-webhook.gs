const SHARED_SECRET = "CANVIA_AQUEST_SECRET";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  if (SHARED_SECRET && payload.secret !== SHARED_SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Consentiments")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Consentiments");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "acceptedAt",
      "circleName",
      "circleSlug",
      "name",
      "dni",
      "consentVersion",
      "consentEntity",
      "userAgent",
      "ipAddress",
      "acceptLanguage",
      "id",
    ]);
  }

  sheet.appendRow([
    payload.acceptedAt || "",
    payload.circleName || "",
    payload.circleSlug || "",
    payload.name || "",
    payload.dni || "",
    payload.consentVersion || "",
    payload.consentEntity || "",
    payload.userAgent || "",
    payload.ipAddress || "",
    payload.acceptLanguage || "",
    payload.id || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
