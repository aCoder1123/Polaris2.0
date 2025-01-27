// TODO Run this to generate credentials for google apis
// To reset credentials delete token.json and run again

const fs = require("fs").promises;
const path = require("path");
// const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = [
	"https://www.googleapis.com/auth/calendar.events",
	"https://www.googleapis.com/auth/gmail.send",
	"https://www.googleapis.com/auth/drive.readonly",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const CREDENTIALS_PATH = path.join(process.cwd(), "./OAuthClient.json");
let TOKEN_PATH;
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
	} catch (err) {
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


const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question("Use different account (y/n): ", (ans) => {
	if (ans === "y") {
		TOKEN_PATH = path.join(process.cwd(), "./tokenDiff.json");
	} else {
		TOKEN_PATH = path.join(process.cwd(), "./token.json");
	}
	readline.close();
	authorize()
});
