const twilio = require("twilio");
const { google } = require("googleapis");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();
  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
  const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
  const twilioClient = new twilio(accountSid, authToken);

  const message = req.body;

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  if (message.inputs.message && message.phone && message.googleSheetsRow) {
    try {
      await twilioClient.messages
        .create({
          body: message.inputs.message,
          to: message.phone, // Text this number
          from: "5024431964", // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
      await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Lunch Lady Ledger!G${message.googleSheetsRow}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[today]],
        },
      });
      res.status(200).json({ message: "Successfully sent!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(500).json({ error: "Phone number and message are required!" });
  }
}
