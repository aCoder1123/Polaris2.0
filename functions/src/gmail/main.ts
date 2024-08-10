// Code adapted from https://www.labnol.org/google-api-service-account-220405

const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");
const credentials = require("./credentials.json");
const tokens = require("./token.json");

const getGmailService = () => {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	oAuth2Client.setCredentials(tokens);
	const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
	return gmail;
};

const createMail = async (options) => {
	const mailComposer = new MailComposer(options);
	const message = await mailComposer.compile().build();
	return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

exports.sendMail = async (options) => {
	const gmail = getGmailService();
	const rawMessage = await createMail(options);
	const { data: { id } = {} } = await gmail.users.messages.send({
		userId: "me",
		resource: {
			raw: rawMessage,
		},
	});
	return id;
};

exports.emailOptions = {
		to: "",
		cc: "bailey.tuckman@gmail.com",
		replyTo: "bailey.tuckman@gmail.com",
		subject: "",
		text: "",
		html: "",
		// attachments: fileAttachments,
		headers: [
			{ key: "X-Application-Developer", value: "Bailey Tuckman" },
			{ key: "X-Application-Version", value: "v1.0.0" },
		],
	};