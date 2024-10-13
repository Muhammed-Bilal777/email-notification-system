const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
	from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	to: { type: String, required: true },
	subject: { type: String, required: true },
	text: { type: String, required: true },
	status: {
		type: String,
		enum: ["pending", "sent", "failed"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);
