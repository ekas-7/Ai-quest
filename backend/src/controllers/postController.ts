import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
   
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                comments: true,
            },
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching posts" });
    }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                author: true,
                comments: true,
            },
        });
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Error fetching post" });
    }
};

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { authorId, title, content } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                authorId: authorId,
                title,
                content,
            },
        });
        res.status(201).json(post);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: "Error creating post" });
    }
};

// Update a post
// Update a post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content, authorId } = req.body;
    try {
        // First, check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) },
        });
        
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        // Ensure the authorId matches the current post's authorId before updating
        if (post.authorId !== authorId) {
            res.status(403).json({ error: "You are not authorized to update this post" });
            return;
        }

        // Proceed with the update
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id, 10) },
            data: { title, content },
        });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Error updating post" });
    }
};


// Delete a post
// Delete a post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { authorId } = req.body;  // Assuming the author's ID is passed in the request body for validation
    try {
        // First, check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        // Ensure the authorId matches the current post's authorId before deleting
        if (post.authorId !== authorId) {
            res.status(403).json({ error: "You are not authorized to delete this post" });
            return;
        }

        // Proceed with the deletion
        await prisma.post.delete({
            where: { id: parseInt(id, 10) },
        });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting post" });
    }
};

