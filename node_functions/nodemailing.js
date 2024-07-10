const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const { initializeApp } = require("firebase-admin/app");
const nodemailer = require("nodemailer");

initializeApp();

exports.sendEmail = onCall(
	{
		cors: [
			/firebase\.com$/,
			"127.0.0.1/",
			"https://polaris-60dce.web.app/coffeeMachine.html",
		],
	},
	(request) => {
		const text = request.data.text;

		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: "bailey.tuckman@gmail.com",
				pass: "umqb elua enws jbgb",
			},
		});

		async function main() {
			// send mail with defined transport object
			const info = await transporter.sendMail({
				from: '"Bailey Tuckman" <bailey.tuckman@gmail.com>', // sender address
				to: "bailey.tuckman@westtown.edu", // robert.frazier@westtown.edu,
				subject: "Coffee Order", // Subject line
				text: "Hello world?", // plain text body
				html: `<b>Your Coffee good sir:</b><img src="coffeGig.gif"><p>${text}</p>`, // html body
				attachments: [
					{
						path: ""
					}
				]
			});
		}
		let errorMsg;
		main().catch((error) => {
			errorMsg = error;
		});
		return errorMsg ? { text: "Error" } : { text: "Message Sent Succesfully" };
	}
);

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
