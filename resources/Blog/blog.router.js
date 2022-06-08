import { Router } from 'express';
import { protect } from '../../util/auth';
import { upload } from '../../util/s3-spaces';
import {
	addBlog,
	deleteBlog,
	getAllBlogs,
	getBlog,
	updateBlog
} from './blog.controller';
const blogRouter = Router();

blogRouter
	.route('/')
	.get(getAllBlogs)
	.post(protect, upload.single('thumbnail'), addBlog);
blogRouter
	.route('/blog/:id')
	.get(getBlog)
	.patch(protect, upload.single('thumbnail'), updateBlog)
	.delete(protect, deleteBlog);
blogRouter.route('/category').get();

export default blogRouter;
