import express from 'express';
import { getContract, getWinners } from '../controllers/contract';
import { getWinnersValidator } from '../validators/contract.validator';
import parser from '../validators/errors.parser';

const router = express.Router();

router.get('/', getContract);
router.get('/winners/:type', getWinnersValidator(), parser, getWinners);

export default router;
