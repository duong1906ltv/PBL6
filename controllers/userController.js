import { StatusCodes } from "http-status-codes";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middleware/upload.js";
import bufferToDataURI from "../utils/file.js";

const updateUserAvatar = async (req, res) => {
	try {
		const { file } = req;
		if (!file) throw new ErrorHandler(400, "Image is required");

		const fileFormat = file.mimetype.split("/")[1];
		const { base64 } = bufferToDataURI(fileFormat, file.buffer);

		const imageDetails = await uploadToCloudinary(base64, fileFormat);

		const currentUser = await User.findOne({ _id: req.user.userId });
		currentUser.avatar = imageDetails.secure_url;
		await User.findOneAndUpdate(
			{ _id: req.user.userId },
			{ $set: currentUser },
			{
				new: true,
			}
		);
		res.status(StatusCodes.OK).json(currentUser);
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const sendInvitation = async (req, res) => {
	try {
		const friend = await Profile.findOne({ user: req.body.userId });
		const me = await Profile.findOne({ user: req.user.userId });
		if (!me.invitation_send.includes(req.body.userId)) {
			await me.updateOne({ $push: { invitation_send: req.body.userId } });
			await friend.updateOne({
				$push: { invitation_receive: req.user.userId },
			});
			res.status(200).json("Send invitation success");
		} else {
			await me.updateOne({ $pull: { invitation_send: req.body.userId } });
			await friend.updateOne({
				$pull: { invitation_receive: req.user.userId },
			});
			res.status(200).json("Cancel invitation success");
		}
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const acceptInvitation = async (req, res) => {
	try {
		const friend = await Profile.findOne({ user: req.body.userId });
		const me = await Profile.findOne({ user: req.user.userId });
		if (!me.friends.includes(req.body.userId)) {
			await me.updateOne({ $push: { friends: req.body.userId } });
			await friend.updateOne({
				$push: { friends: req.user.userId },
			});
			await me.updateOne({
				$pull: { invitation_receive: req.body.userId },
			});
			await friend.updateOne({
				$pull: { invitation_send: req.user.userId },
			});
			res.status(200).json("Accept invitation success");
		} else {
			await me.updateOne({ $pull: { friends: req.body.userId } });
			await friend.updateOne({
				$pull: { friends: req.user.userId },
			});
			res.status(200).json("Unfriend success");
		}
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const getAll = async (req, res) => {
	try {
		const listUsers = await Profile.find().populate("user");
		res.status(StatusCodes.OK).json(listUsers);
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const getProfileById = async (req, res) => {
	try {
		const userProfile = await Profile.findOne({
			user: req.params.id,
		}).populate("user");
		res.status(StatusCodes.OK).json(userProfile);
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const userProfile = await Profile.findOne({
			user: req.user.userId,
		}).populate("user");
		userProfile.fullName = req.body.fullName;
		userProfile.gender = req.body.gender;
		userProfile.address = req.body.address;
		userProfile.phoneNumber = req.body.phoneNumber;
		userProfile.hoppy = req.body.hoppy;
		userProfile.dayOfBirth = req.body.dayOfBirth;
		const updateUserProfile = await Profile.findOneAndUpdate(
			{ _id: userProfile._id },
			{ $set: userProfile }
		).populate("user");
		res.status(StatusCodes.OK).json(updateUserProfile);
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};
const getMyInvitation = async (req, res) => {
	try {
		const myProfile = await Profile.findOne({
			user: req.user.userId,
		});
		const listInvitationId = myProfile.invitation_receive;
		const listInvitationPromises = listInvitationId.map((id) => {
			return User.findOne({ _id: id });
		});
		const listInvitation = await Promise.all(listInvitationPromises);
		res.status(StatusCodes.OK).json(listInvitation);
	} catch (error) {
		console.error(error.message);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const getUserById = async (req, res) => {
	const userId = req.query.userId;
	try {
		const user = await User.findById(userId);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

export {
	updateUserAvatar,
	sendInvitation,
	acceptInvitation,
	getAll,
	getProfileById,
	updateUserProfile,
	getMyInvitation,
	getUserById,
};
