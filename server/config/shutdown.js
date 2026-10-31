import { disconnectDB } from "./db.js";

async function gracefulShutdown(signal, server) {

    console.log(`${signal} received. Starting graceful shutdown...`);

    server.close(async (error) => {
        if (error) {
            console.error("HTTP server shutdown error:", error);
            process.exitCode = 1;
        }
        console.log("HTTP server closed.");

        try {
            await disconnectDB();

            console.log("Graceful shutdown completed.");

            process.exitCode = 0;

        } catch (error) {
            console.error("Shutdown error:", error);
            process.exitCode = 1;
        }
    });
}

async function uncaughtException(err, server){
    console.error("❌ uncaughtException: ", err)
    gracefulShutdown("uncaughtException", server);
}

async function unhandledRejection(reson, server){
    console.error("❌ unhandledRejection: ", reson)
    gracefulShutdown("unhandledRejection", server);
}

export {
    gracefulShutdown,
    uncaughtException,
    unhandledRejection
}