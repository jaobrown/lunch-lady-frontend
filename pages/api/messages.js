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
    range: "Lunch Lady Ledger!A:G",
  });

  const messages = data.values
    .map((message, messageIdx) => {
      let balance = "";
      let textMessage = "";
      const family = message[0];
      const phone = message[5];
      const dateLastTextSent = message[6];
      const row = messageIdx + 1;
      let needsTexted;

      // format balance value
      if (message[1].includes("(")) {
        balance = `-${message[1]
          .replace("(", "")
          .replace(")", "")
          .replace(/\s/g, "")}`;
      } else {
        balance = message[1].replace(/\s/g, "");
      }

      // set intitial text message
      if (message[1].includes("(")) {
        textMessage = `Hi, ${family} family! You have a balance of ${balance}. Please remember to settle up with me soon!`;
      } else {
        textMessage = `Hi, ${family} family! You have a balance of ${balance}. You should be ok for now :)`;
      }

      // set whether or not UI allows texting
      if (phone && balance) {
        if (!dateLastTextSent) {
          needsTexted = true;
        }
        let lastTexted = new Date(dateLastTextSent).getDate();
        let fiveDaysAgo = new Date().getDate() - 5;
        if (lastTexted < fiveDaysAgo) {
          needsTexted = true;
        }
      }

      return {
        row,
        family: family || "",
        phone: phone || "",
        balance: balance || "",
        dateLastTextSent: dateLastTextSent || "",
        textMessage: textMessage || "",
        needsTexted: needsTexted || false,
      };
    })
    .filter((message) => !message.balance.includes("$-"))
    .filter((message) => message.family !== "Name" && message.family !== "");

  res.status(200).json({ messages });
}
