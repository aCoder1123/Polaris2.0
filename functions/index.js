/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START imports]
// Dependencies for callable functions.
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");

// [END imports]

// [START v2allAdd]
// [START v2addFunctionTrigger]
// Adds two numbers to each other.
exports.addnumbers = onCall((request) => {
	// [END v2addFunctionTrigger]
	// [START v2readAddData]
	// Numbers passed from the client.
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
	// [END v2addHttpsError]

	// [START v2returnAddData]
	return {
		firstNumber: firstNumber,
		secondNumber: secondNumber,
		operator: "+",
		operationResult: firstNumber + secondNumber,
	};
	// [END v2returnAddData]
});
// [END v2allAdd]

const nodemailer = require("nodemailer");

exports.sendEmail = onCall(	(request) => {
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
				pass: "umqb elua enws jbgb",
			},
		});

		async function send() {
			const info = await transporter.sendMail({
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
				messageStatus: errorMsg,
			};
		} else {
			return {
				messageStatus: "Message Sent Succesfully",
			};
		}
	}
);
