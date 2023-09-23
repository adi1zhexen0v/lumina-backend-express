import PostModel, { IPost } from '../models/post.model.js';

export type CreatePostDto = Pick<IPost, 'caption' | 'tags' | 'userId'> & Partial<Pick<IPost, 'media'>>;
export type UpdatePostDto = Pick<IPost, 'caption' | 'tags' | 'media'>;

class PostRepository {
	async getById(id: string) {
		return await PostModel.findById(id);
	}

	async createPost(data: CreatePostDto) {
		return await new PostModel(data).save();
	}

	async updatePost(data: UpdatePostDto, id: string) {
		await PostModel.findByIdAndUpdate(id, data);
	}

	async deletePost(id: string) {
		const deletedPost = await PostModel.findByIdAndDelete(id);
		return deletedPost !== null;
	}
}

export default new PostRepository();