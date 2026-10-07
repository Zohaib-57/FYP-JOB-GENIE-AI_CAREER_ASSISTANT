import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, { dbName: "JobGenie" });
		console.log("MongoDB Connected......");
	} catch (error) {
		console.error("DB Error:", error.name);
		process.exit(1);
	}
};

export default connectDB;
