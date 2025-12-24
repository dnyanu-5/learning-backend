import { asyncHandler } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "OK"
    })
    //user details from frontend
    const { username, fullName, password, email } = req.body;
    console.log("email", email);
    // is empty validation
    if (
        [username, fullName, password, email].some((feild) =>
            feild?.trim === "")
    ) {
        throw new ApiError(400, "All feilds are required");
    }
    //  check if user already exits?/
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "user already exists!");
    }
    //coverimage and avtar upload
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }
    //create user in db 
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })
    // remove refresh token and password feild
    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registerinh user");
    }
    // send response 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd successfully!!")
    )
})
export { registerUser };