import express from 'express'
import { createJob } from '../controllers/createJob.js'
import { deleteJob } from '../controllers/deleteJob.js'
import { getJobs } from '../controllers/getJobs.js'
import { reorderJobs } from '../controllers/reorderJobs.js'
import { updateJobStatus } from '../controllers/updateJobStatus.js'

const router = express.Router()

router.get('/', getJobs)
router.post('/', createJob)
router.patch('/:id', updateJobStatus)
router.delete('/:id', deleteJob)
router.post('/reorder/:columnId', reorderJobs)

export default router
