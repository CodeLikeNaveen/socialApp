import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Mongoose connection monitoring
        mongoose.connection.on('connected',
            () => {
                console.log('✅ DataBase Connected')
            })

        mongoose.connection.on('error',
            (err) => {
                console.log('❌ DB Connection Error:', err.message || err)
            })

        mongoose.connection.on('disconnected',
            () => {
                console.log('⚠️ DataBase Disconnected!')
            })
        await mongoose.connect(`${process.env.MONGODB_URI}/socialApp`, {
            maxPoolSize: 10,
            minPoolSize: 0,
            maxConnecting: 2,

            serverSelectionTimeoutMS: 10000,
            waitQueueTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        })


        // // MongoDB connection pool monitoring
        // const client = mongoose.connection.getClient();

        // client.on("connectionCheckOutStarted",
        //     () => console.log("🔄 Connection checkout started")
        // );

        // client.on("connectionCheckedOut", () => {
        //     console.log("✅ Connection acquired from pool");
        // });

        // client.on("connectionCheckOutFailed", (event) => {
        //     console.error(
        //         "❌ Connection checkout failed:",
        //         event.reason
        //     );
        // });

        // client.on("connectionCheckedIn", () => {
        //     console.log("↩️ Connection returned to pool");
        // });

        // client.on("connectionCreated", () => {
        //     console.log("🆕 New DB connection created");
        // });

        // client.on("connectionClosed", () => {
        //     console.log("🔒 DB connection closed");
        // });

    } catch (error) {
        console.log("❌ DB connection Failed: ", error.message);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    try {
        mongoose.connection.on('error', (err) => {
            console.log('❌ DB Connection Error:', err.message || err)
        })

        mongoose.connection.on('close',() => {
            console.log('🔒 Database Connection Closed!')
        })
        await mongoose.connection.close()

    } catch (error) {
        console.log("❌ DB connection shutdown Failed: ", error.message);
        throw error;
    }
}

export {
    connectDB,
    disconnectDB
}