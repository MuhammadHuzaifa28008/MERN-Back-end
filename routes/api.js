import express from 'express'
const router = express.Router();
import { getAll, addApi, deleteApi, getAddedApis  } from '../controllers/api.js';
import { authentication} from './middlewares/auth.js';


router.get('/', getAll);
router.post('/add/:id', authentication, addApi);
router.delete('/delete/:id', authentication, deleteApi);
router.get('/addedapis/:id', authentication, getAddedApis);

export default router;