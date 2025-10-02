import { Schema, model } from "mongoose";
export const USER_ROLES = ["admin", "user"];
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 120,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
        default: "user",
    },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.index({ email: 1 }, { unique: true });
export const UserModel = model("User", userSchema);
//# sourceMappingURL=user.model.js.map