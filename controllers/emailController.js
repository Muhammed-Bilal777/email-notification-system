const Email = require("../models/emailModel");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Redis = require("ioredis");
const Queue = require("bull");
const createClient = require("redis");

 
	// Create a new queue
const emailQueue = new Queue("email-queue", {
	redis: {
		host: process.env.REDIS_HOST,
		port:process.env.REDIS_PORT,
		password:process.env.REDIS_PASS
	},
});

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

			// Add the email to the queue
			await emailQueue.add({
				emailId: email._id,
				from: user.email,
				to,
				subject,
				text,
			});

			res.status(200).json({ message: "Email queued successfully" });
		} catch (error) {
			console.error("Error queueing email:", error);
			req.io.emit("emailStatus", { error: "Failed to queue email" });
			res.status(500).json({ error: "Failed to queue email" });
		}
	};

	// Process jobs in the queue
	emailQueue.process(async (job) => {
		const { emailId, from, to, subject, text } = job.data;

		try {
			await transporter.sendMail({
				from,
				to,
				subject,
				text,
			});

			const email = await Email.findById(emailId);
			if (email) {
				email.status = "sent";
				email.updatedAt = new Date();
				await email.save();

				global.io.emit("emailStatus", { id: email._id, status: "sent" });
			}

			console.log(`Email ${emailId} sent successfully`);
		} catch (error) {
			console.error(`Failed to send email ${emailId}:`, error);

			const email = await Email.findById(emailId);
			if (email) {
				email.status = "failed";
				email.updatedAt = new Date();
				await email.save();

				global.io.emit("emailStatus", { id: email._id, status: "failed" });
			}

			throw new Error("Failed to send email");
		}
	});

	// Add error handling for the queue
	emailQueue.on("error", (error) => {
		console.error("Queue error:", error);
	});

	// Optional: Add event listeners for better monitoring
	emailQueue.on("completed", (job) => {
		console.log(`Job ${job.id} completed`);
	});

	emailQueue.on("failed", (job, error) => {
		console.error(`Job ${job.id} failed:`, error);
	});























































// const transporter = nodemailer.createTransport({
// 	host: "smtp.mailtrap.io",
// 	port: 2525,
// 	auth: {
// 		user: process.env.MAIL_TRAP_USER,
// 		pass: process.env.MAIL_TRAP_PASS,
// 	},
// });

// exports.sendEmail = async (req, res) => {
// 	try {
//     const { from, to, subject, text } = req.body;
    
//     const user = await User.findById(from);
// 		const email = new Email({
// 			from,
// 			to,
// 			subject,
// 			text,
// 			status: "pending",
// 		});

// 		await email.save();

// 		req.io.emit("emailStatus", { id: email._id, status: "pending" });

// 		await transporter.sendMail({
// 			from: user.email,
// 			to,
// 			subject,
// 			text,
// 		});

// 		email.status = "sent";
// 		email.updatedAt = new Date();
// 		await email.save();

// 		req.io.emit("emailStatus", { id: email._id, status: "sent" });

// 		res.status(200).json({ message: "Email sent successfully" });
// 	} catch (error) {
// 		console.error("Error sending email:", error);
// 		req.io.emit("emailStatus", { error: "Failed to send email" });
// 		res.status(500).json({ error: "Failed to send email" });
// 	}
// };

exports.getEmails = async (req, res) => {
  let id = req.body.userId;

		try {
			const emails = await Email.find({ from: id });

			res.status(200).json(emails);
		} catch (error) {
			res.status(500).json({ error: "Error fetching emails" });
		}
};
