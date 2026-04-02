import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Please provide a username'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters long'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: [6, 'Password must be at least 6 characters long'],
			select: false,
		},
		profileImage: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before save
userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;