import { Schema, Model, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
	caption: string;
	tags: string[];
	media?: string[];
	userId: Types.ObjectId | undefined;
}

export const PostSchema: Schema<IPost> = new Schema<IPost>({
	caption: {
		type: String,
		required: true,
		trim: true
	},
	tags: {
		type: [String],
		required: true
	},
	media: {
		type: [String],
		required: false
	},
	userId: {
		type: Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const PostModel: Model<IPost> = model<IPost>('Post', PostSchema);

export default PostModel;