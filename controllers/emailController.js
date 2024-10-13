const Email = require("../models/emailModel");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

const transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAIL_TRAP_USER,
		pass: process.env.MAIL_TRAP_PASS,
	},
});

exports.sendEmail = async (req, res) => {
	try {
    const { from, to, subject, text } = req.body;
    
    const user = await User.findById(from);
		const email = new Email({
			from,
			to,
			subject,
			text,
			status: "pending",
		});

		await email.save();

		req.io.emit("emailStatus", { id: email._id, status: "pending" });

		await transporter.sendMail({
			from: user.email,
			to,
			subject,
			text,
		});

		email.status = "sent";
		email.updatedAt = new Date();
		await email.save();

		req.io.emit("emailStatus", { id: email._id, status: "sent" });

		res.status(200).json({ message: "Email sent successfully" });
	} catch (error) {
		console.error("Error sending email:", error);
		req.io.emit("emailStatus", { error: "Failed to send email" });
		res.status(500).json({ error: "Failed to send email" });
	}
};

exports.getEmails = async (req, res) => {
	try {
		const emails = await Email.find().populate("from", "username email");
		res.status(200).json(emails);
	} catch (error) {
		res.status(500).json({ error: "Error fetching emails" });
	}
};
