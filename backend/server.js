const http = require("http");

const { app } = require("./app");
const connectToDb = require("./db/db");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDb();
    console.log("Database connected successfully");

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
