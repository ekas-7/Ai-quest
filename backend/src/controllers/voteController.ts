import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const voteController = {
  async voteOnPost(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { authorId, voteType } = req.body;

    
    if (!id || !authorId || !voteType) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      res.status(400).json({ error: "Invalid vote type. Must be 'upvote' or 'downvote'." });
      return;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Changed to use unique identifier
        const existingVote = await tx.vote.findFirst({
          where: {
            userId: authorId,
            id: parseInt(id),
          },
        });

        const voteChange = voteType === 'upvote' ? 1 : -1;

        if (existingVote) {
          const oldVoteChange = existingVote.voteType === 'upvote' ? 1 : -1;
          
          const updatedVote = await tx.vote.update({
            where: { id: existingVote.id },
            data: { voteType },
          });

          await tx.post.update({
            where: { id: parseInt(id) },
            data: {
              votingScore: {
                increment: voteChange - oldVoteChange,
              },
            },
          });

          res.status(200).json(updatedVote);
        } else {
          const newVote = await tx.vote.create({
            data: {
              userId: authorId,
              id: parseInt(id),
              postId: parseInt(id),
              voteType,
            },
          });

          await tx.post.update({
            where: { id: parseInt(id) },
            data: {
              votingScore: {
                increment: voteChange,
              },
            },
          });

          res.status(201).json(newVote);
        }
      });
    } catch (error) {
      console.error('Error processing vote:', error);
      res.status(500).json({ error: 'An error occurred while processing the vote.' });
    }
  },
};

export default voteController;