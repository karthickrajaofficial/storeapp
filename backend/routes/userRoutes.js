import express from "express"
import { createUser, getAllUsers, loginUser ,logoutCurrentUser,getCurrentUserProfile,updateCurrentUserProfile,deleteUserById,getUserById,updateUserById,requestPasswordReset, resetPassword } from "../controllers/userControllers.js";
import { authenticate,authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router()

router.route('/').post(createUser).get(authenticate,authorizeAdmin,getAllUsers)
 
router.post('/auth',loginUser)
router.post('/logout',logoutCurrentUser)
router.post("/forgot-password", (req, res, next) => {
     console.log("Received POST request to /forgot-password");
     next(); // Pass control to the next middleware in the chain
   }, requestPasswordReset);
router.put('/reset-password/:token', resetPassword);
router
     .route ('/profile')
     .get(authenticate,getCurrentUserProfile)
     .put(authenticate,updateCurrentUserProfile)
   

//Admin routes
router.route('/:id').delete(authenticate,authorizeAdmin,deleteUserById)
.get(authenticate,authorizeAdmin,getUserById)
.put(authenticate,authorizeAdmin,updateUserById)
export default router;

