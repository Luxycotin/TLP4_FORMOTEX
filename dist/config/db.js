import mongoose from "mongoose";
const DEFAULT_URI = "mongodb://127.0.0.1:27017/formotex";
export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    const uri = process.env.MONGODB_URI ?? DEFAULT_URI;
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(uri, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
        });
        return mongoose;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to connect to MongoDB: ${message}`);
    }
};
export const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};
mongoose.connection.on("connected", () => {
    console.info("MongoDB connected");
});
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error", error);
});
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
});
//# sourceMappingURL=db.js.map