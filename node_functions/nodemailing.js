const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: "bailey.tuckman@gmail.com",
		pass: "umqb elua enws jbgb",
	},
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: '"Bailey Tuckman" <bailey.tuckman@gmail.com>', // sender address
		to: "robert.frazier@westtown.edu, bailey.tuckman@westtown.edu", // list of receivers
		subject: "Coffee Order", // Subject line
		text: "Hello world?", // plain text body
		html: "<b>Your Coffee good sir:</b><img src=\"coffeGig.gif\">", // html body
	});

	console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
