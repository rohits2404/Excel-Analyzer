import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            required: true
        },
        selectedX: String,
        selectedY: String,
        chartType: {
            type: String,
            enum: ['bar', 'line', 'pie', 'scatter', '3d'],
        },
        parsedData: Object,
        summary: String
    },
    { timestamps: true }
);

const Analysis = mongoose.model("Analysis",analysisSchema);

export default Analysis;