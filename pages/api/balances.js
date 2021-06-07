const { google } = require("googleapis");

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const { data } = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Lunch Lady Ledger!A:F",
  });

  const balances = data.values.map((family) => {
    let balance = "";

    if (family[1].includes("(")) {
      balance = `-${family[1]
        .replace("(", "")
        .replace(")", "")
        .replace("$", "")
        .replace("-", "")
        .replace(".", "")
        .replace(/\s/g, "")}`;
    } else {
      balance = family[1].replace(/\s/g, "").replace("$", "").replace("-", "").replace(".", "");
    }

    return {
      family: family[0],
      balance: balance,
      phone: family[5]
    };
  });

  res.status(200).json({ balances });
}
