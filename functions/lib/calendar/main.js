"use strict";
//https://developers.google.com/calendar/api/v3/reference/events/insert#node.js
//https://developers.google.com/calendar/api/v3/reference/events
const fs = require("fs").promises;
const path = require("path");
// const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "./token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "./OAuthClient.json");
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    }
    catch (err) {
        return null;
    }
}
/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}
/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}
exports.eventTemplate = {
    summary: "",
    location: "",
    description: "",
    start: {
        dateTime: "2024-07-28T09:00:00", //formatted according to RFC3339 (yyyy-mm-ddThh:mm:ss)
        // timeZone: "America/New_York", //IANA Time Zone Database name
    },
    end: {
        dateTime: "2024-07-28T17:00:00",
        // timeZone: "America/New_York",
    },
    // recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
    attendees: [
    /*{ email: "bailey.tuckman@westtown.edu" }*/
    ],
    guestsCanInviteOthers: false,
    reminders: {
        useDefault: false,
        overrides: [
            // { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
        ],
    },
};
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log("No upcoming events found.");
        return;
    }
    console.log("Upcoming 10 events:");
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });
}
exports.createEventFromJSON = async (eventDetails) => {
    let auth = await authorize();
    const calendar = google.calendar({ version: "v3", auth });
    let result = await calendar.events.insert({
        auth: auth,
        calendarId: "primary",
        resource: eventDetails,
        sendUpdates: "all",
    });
    return result;
};
exports.manageAttendees = async (event, calendarID = "primary") => {
    if (!event.calID)
        return;
    let auth = await authorize();
    const calendar = google.calendar({ version: "v3", auth });
    try {
        let getRes = await calendar.events.get({
            calendarId: calendarID,
            eventId: event.calID,
        });
        getRes.data.attendees = [];
        for (let attendee of event.signups) {
            if (attendee.status === "approved" || attendee.status === "checkedIn") {
                getRes.data.attendees.push({ email: attendee.email });
            }
        }
        let setRes = await calendar.events.update({
            calendarId: calendarID,
            eventId: getRes.data.id,
            requestBody: getRes.data,
        });
        return { status: "success", data: setRes };
    }
    catch (error) {
        return { status: "error", data: error };
    }
};
exports.deleteCalendarEvent = async (eventID, calendarID = "primary") => {
    let auth = await authorize();
    const calendar = google.calendar({ version: "v3", auth });
    await calendar.events
        .delete({
        calendarId: calendarID,
        eventId: eventID,
    })
        .then((res) => {
        return res;
    }).catch((error) => {
        return error.message;
    });
};
//# sourceMappingURL=main.js.map