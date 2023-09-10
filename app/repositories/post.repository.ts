import PostModel, { IPost } from '@models/post.model.js';

export type TypeCreatePost = Pick<IPost, 'caption' | 'tags' | 'media' | 'userId'>;
export type TypeUpdatePost = Pick<IPost, 'caption' | 'tags' | 'media'>;

class PostRepository {
	async createPost(data: TypeCreatePost) {
		return await new PostModel(data).save();
	}

	async updatePost(data: TypeUpdatePost, id: string) {
		await PostModel.findByIdAndUpdate(id, data);
	}

	async deletePost(id: string) {
		const deletedPost = await PostModel.findByIdAndDelete(id);
		return deletedPost !== null;
	}
}

export default new PostRepository();
