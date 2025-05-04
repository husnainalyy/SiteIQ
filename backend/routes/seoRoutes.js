    import express from "express";
    import {createNewReport, getExistingReport} from '../controllers/seoController.js'

    const router = express.Router(); 
    // /api/seoreports

    router.post("/create", createNewReport); // 
    router.get("/tempget/:jid", getExistingReport); // 
    export default router;