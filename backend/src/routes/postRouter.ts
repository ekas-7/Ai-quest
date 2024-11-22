import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';
import voteController from '../controllers/voteController';

const router = Router();

// Route to get all posts (no authentication needed)
router.get('/getAll', getAllPosts);

// Route to get a post by ID (no authentication needed, you can modify if needed)
router.get('/:id', getPostById);

// Route to create a new post (authentication required)
router.post('/', authenticate, createPost);

// Route to update a post (authentication required)
router.put('/:id', authenticate, updatePost);

// Route to delete a post (authentication required)
router.delete('/:id', authenticate, deletePost);

router.post('/:id/vote',authenticate, voteController.voteOnPost);

export default router;
