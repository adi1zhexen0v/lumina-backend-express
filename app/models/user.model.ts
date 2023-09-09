import { Schema, Model, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	profilePicture?: string;
	isActivated: boolean;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	posts: Types.ObjectId[];
}

export const UserSchema: Schema<IUser> = new Schema<IUser>({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	profilePicture: {
		type: String,
		required: false,
		trim: true
	},
	isActivated: {
		type: Boolean,
		required: true,
		default: false
	},
	followers: {
		type: [Types.ObjectId],
		ref: 'User',
		required: true,
		default: []
	},
	following: {
		type: [Types.ObjectId],
		ref: 'User',
		required: true,
		default: []
	},
	posts: {
		type: [Types.ObjectId],
		ref: 'Post',
		required: true,
		default: []
	}
});

const UserModel: Model<IUser> = model<IUser>('User', UserSchema);

export default UserModel;
