const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config(
	{
		path: './config/config.env'
	}
);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.static("public"));
 

// MongoDB connection
 const dbConnection = require("./database/dbConnection");
dbConnection();


// Routes
const routes = require("./routes/emailRoutes");


app.use(
	"/api",
	(req, res, next) => {
		req.io = io;
		next();
	},
	routes
);

// Socket.io connection
io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

// Serve the static HTML page
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
