
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");

// [END imports]

// [START v2allAdd]
// [START v2addFunctionTrigger]
// Adds two numbers to each other.
exports.addnumbers = onCall((request) => {

	const firstNumber = request.data.firstNumber;
	const secondNumber = request.data.secondNumber;
	// [END v2readAddData]

	// [START v2addHttpsError]
	// Checking that attributes are present and are numbers.
	if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new HttpsError(
			"invalid-argument",
			"The function must be called " +
				'with two arguments "firstNumber" and "secondNumber" which ' +
				"must both be numbers."
		);
	}
	return {
		firstNumber: firstNumber,
		secondNumber: secondNumber,
		operator: "+",
		operationResult: firstNumber + secondNumber,
	};
});

const nodemailer = require("nodemailer");

exports.sendEmail = onCall((request) => {
		const email = request.data.email;
		if (!email) {
			throw new HttpsError("invalid-argument", "invalid email adress");
		}
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: "bailey.tuckman@gmail.com",
				pass: "thbf puxs hlkj asje", //thbf puxs hlkj asje - prod  //umqb elua enws jbgb
			},
		});
        let info = undefined
		async function send() {
			info = await transporter.sendMail({
				from: '"Bailey Tuckman" <bailey.tuckman@gmail.com>',
				to: email, // robert.frazier@westtown.edu,
                cc: ["bailey.tuckman@gmail.com"],
				subject: "Coffee Order",
				text: "Hello world?", // plain text body
				html: "<b>Your Coffee:</b><br><br><br><br><p>P.S. Don't ask how long this took...</p>", // html body
				attachments: [
					{
						path: "../coffeGif.gif",
					},
				],
			});
		}
		let errorMsg = null;

		send().catch((error) => {
			errorMsg = error;
		});

		if (errorMsg) {
			return {
				messageStatus: errorMsg, messageInfo: info
			};
		} else {
			return {
				messageStatus: "Message Sent Succesfully",
				messageInfo: info,
			};
		}
        
	}
);





const { createICS } = require("./icsGen");


exports.sendInvite = onCall((request) => {
	const email = request.data.email;
	if (!email) {
		throw new HttpsError("invalid-argument", "invalid email adress");
	}

    let invite = createICS()

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "bailey.tuckman@gmail.com",
			pass: "umqb elua enws jbgb",
		},
	});


    let message = {
			from: "bailey.tuckman@gmail.com",
			to: "bailey.tuckman@westtown.edu",
			subject: "Appointment",
			text: "Please see the attached appointment",
			icalEvent: {
				filename: "invitation.ics",
				method: "request",
				content: invite
			},
		};
    let info = undefined
	async function send() {
		info = await transporter.sendMail(message);
	}
	let errorMsg = null;

	send().catch((error) => {
		errorMsg = error;
	});

	if (errorMsg) {
		return {
			messageStatus: errorMsg,
			messageInfo: info,
		};
	} else {
		return {
			messageStatus: "Message Sent Succesfully",
			messageInfo: info,
		};
	}
});

