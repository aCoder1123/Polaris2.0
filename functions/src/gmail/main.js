"use strict";
// Code adapted from https://www.labnol.org/google-api-service-account-220405
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailComposer = new MailComposer(options);
    const message = yield mailComposer.compile().build();
    return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
});
exports.sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = getGmailService();
    const rawMessage = yield createMail(options);
    const data = yield gmail.users.messages.send({
        userId: "me",
        resource: {
            raw: rawMessage,
        },
    });
    return data;
});
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
