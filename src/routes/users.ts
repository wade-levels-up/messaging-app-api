import { Router } from 'express';
import { getMyUserData, getAllUsersData, getUserData, getUserFriends, updateBio, updateProfilePicture } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';
import { upload } from '../middleware/multer';

const usersRouter = Router();

usersRouter.put("/me/profile_picture", decodeAndAttachJWT, upload.single("file"), updateProfilePicture)
usersRouter.put("/me/bio", decodeAndAttachJWT, updateBio);
usersRouter.get("/me", decodeAndAttachJWT, getMyUserData);
usersRouter.get("/:username/friends", getUserFriends)
usersRouter.get("/:username", getUserData);
usersRouter.get("/", getAllUsersData);

export { usersRouter };