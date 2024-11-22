import { Router } from 'express';
import { login, register } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Correcting the route handler
router.get("/", (req, res) => {
    res.send("Route works!");
});

export default router;
