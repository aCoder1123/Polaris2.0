"use strict";
//https://developers.google.com/calendar/api/v3/reference/events/insert#node.js
//https://developers.google.com/calendar/api/v3/reference/events
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require("fs").promises;
const path = require("path");
// const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
// const { google } = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    });
}
/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: "authorized_user",
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        yield fs.writeFile(TOKEN_PATH, payload);
    });
}
/**
 * Load or request or authorization to call APIs.
 */
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        let client = yield loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = yield authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            yield saveCredentials(client);
        }
        return client;
    });
}
exports.eventTemplate = {
    summary: "",
    location: "",
    description: "",
    start: {
        dateTime: "2024-07-28T09:00:00", //formatted according to RFC3339 (yyyy-mm-ddThh:mm:ss)
        timeZone: "America/New_York", //IANA Time Zone Database name
    },
    end: {
        dateTime: "2024-07-28T17:00:00",
        timeZone: "America/New_York",
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
function listEvents(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        const calendar = google.calendar({ version: "v3", auth });
        const res = yield calendar.events.list({
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
    });
}
//authorize().then(listEvents).catch(console.error);
exports.createEventFromJSON = (eventDetails) => __awaiter(void 0, void 0, void 0, function* () {
    let eventData;
    let eventError;
    let auth = yield authorize();
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.insert({
        auth: auth,
        calendarId: "primary",
        resource: eventDetails,
        sendUpdates: "all",
    }, function (err, event) {
        if (err) {
            eventError = err;
            return;
        }
        eventData = event.data;
        // console.log("Event created: %s", event.data.id);
    });
    if (eventData) {
        return { status: "success", data: eventData };
    }
    else {
        return { status: "error", data: eventError };
    }
});
exports.addAttendees = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let eventData;
    let eventError;
    let auth = yield authorize();
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events
        .get({
        calendarId: data.calID,
        eventId: data.eID,
    })
        .then((res) => {
        // console.log(res);
        data.attendees.array.forEach((element) => {
            res.data.attendees.push(element);
        });
        calendar.events
            .update({
            calendarId: data.calID,
            eventId: res.data.id,
            requestBody: res.data,
        })
            .then((resp) => {
            eventData = resp;
            // console.log("Event updated: %s", resp);
        })
            .catch((error) => {
            eventError = error;
        });
    })
        .catch((err) => {
        eventError = err;
    });
    if (eventData) {
        return { status: "success", data: eventData };
    }
    else {
        return { status: "error", data: eventError };
    }
});
