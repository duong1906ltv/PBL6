import React, { useState, useRef, useEffect } from "react";
import { Carousel, Input, Tooltip, Modal, Spin } from "antd";
import { useParams } from "react-router-dom";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import Comment from "../comment";
import { getDateTime } from "../../helpers/formatDate";
import { useAppContext } from "../../context/appContext";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import EditPost from "../modal/edit-post";
import axios from "axios";
import "./post.scss";
const { TextArea } = Input;
function Post({ post }) {
	const slider = useRef();
	const {
		user,
		userProfile,
		getProfileById,
		commentsOfPost,
		getCommentsByPostId,
		listUsers,
		getAllUsers,
		createLike,
	} = useAppContext();
	const [currentPost, setCurrentPost] = useState();
	const [showComment, setShowComment] = useState(false);
	const [showHiddenPost, setShowHiddenPost] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [limit, setLimit] = useState(5);
	const [likeState, setLikeState] = useState(false);
	const [numberOfLike, setNumberOfLike] = useState();
	const [numberOfComment, setNumberOfComment] = useState();
	const [listToolTips, setListToolTips] = useState([]);
	const [savingState, setSavingState] = useState();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editPost, setEditPost] = useState();
	const [responseState, setResponSate] = useState(false);
	var postUser;

	const { id } = useParams();
	useEffect(() => {
		if (id) {
			axios.get(`/api/post/${id}`).then((res) => {
				setCurrentPost(res.data);
				setLimit(res.data.comments.length);
				setShowComment(true);
			});
		} else {
			setCurrentPost(post);
		}
	}, []);

	useEffect(() => {
		if (currentPost) {
			setSavingState(
				!!currentPost.beSaved?.find((item) => item === user._id)
			);
			postUser = listUsers.find(
				(userInfo) => userInfo.user._id === currentPost?.user._id
			);
			setNumberOfLike(currentPost.likes.length);
			if (currentPost.likes.includes(user._id)) {
				setLikeState(true);
			}
			setNumberOfComment(currentPost.comments.length);
			getCommentsByPostId(currentPost._id, limit);
			getProfileById(user._id);
			getAllUsers();
		}
	}, [currentPost]);

	useEffect(() => {
		if (currentPost) getCommentsByPostId(currentPost._id, limit);
	}, [limit]);
	useEffect(() => {
		setListToolTips([]);
		currentPost?.likes.map((userId) => {
			for (let i = 0; i < listUsers.length; i++) {
				if (listUsers[i].user._id === userId) {
					setListToolTips((listToolTips) => [
						...listToolTips,
						listUsers[i],
					]);
				}
			}
		});
	}, [listUsers]);
	const handleEnter = (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			if (commentText !== "") {
				const newComment = {
					postId: currentPost._id,
					text: commentText,
				};
				handleCreateComment(newComment);
				setCommentText("");
			}
		}
	};
	const handleCreateComment = async (values) => {
		try {
			setResponSate(true);
			await axios
				.post("/api/post/predict", {
					text: values.text,
				})
				.then((respData) => {
					return respData.data;
				})
				.then((data) => {
					const comment = {
						postId: values.postId,
						text: values.text,
						parentId: values.parentId,
						status: data,
					};
					const response = axios.post(
						"/api/comment",
						comment,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									"token"
								)}`,
							},
						}
					);
					setResponSate(false);
				});
			setShowComment(true);
		} catch (error) {
			console.log(error);
		}
		getCommentsByPostId(currentPost._id, limit);
		setNumberOfComment(numberOfComment + 1);
	};
	const handleOpenComment = () => {
		if (!showComment) {
			getCommentsByPostId(currentPost._id, limit);
		}
		setShowComment(!showComment);
	};
	const handleCreateLike = () => {
		const like = {
			postId: currentPost._id,
		};
		createLike(like);
		if (likeState) {
			setNumberOfLike(numberOfLike - 1);
			const user = listToolTips.filter(
				(item) => item.user._id !== userProfile.user._id
			);
			setListToolTips(user);
		} else {
			setNumberOfLike(numberOfLike + 1);
			setListToolTips((listToolTips) => [...listToolTips, userProfile]);
		}
		setLikeState(!likeState);
	};
	const handleSavePost = async (value) => {
		const updatePost = {
			saver: user._id,
		};
		await axios.put(`/api/post/${currentPost._id}`, updatePost, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		setSavingState(value);
	};
	const handleDeletePost = async () => {
		try {
			const response = await axios.delete(`/api/post/${post._id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			alert(response.data.message);
			window.location.reload(false);
		} catch (error) {
			alert(error.response.data.message);
		}
	};
	const handleEditPostModal = (value) => {
		setShowEditModal(value);
	};
	return (
		currentPost && (
			<div className={id ? "post" : ""}>
				<div
					className={
						"post-container " +
						(!showHiddenPost && currentPost.status === "negative"
							? "is-hidden"
							: "")
					}
				>
					<div className="post-content">
						<div className="mx-3">
							<div className="d-flex align-items-center">
								<div className="shape-circle">
									<img
										className="img-circle"
										style={{
											width: "50px",
											height: "50px",
										}}
										alt=""
										src={currentPost.user.avatar}
									/>
								</div>
								<div className="ms-3">
									<a className="user-name" href="/">
										{currentPost.user.username}
									</a>
									<br />
									<span>
										{getDateTime(currentPost.createdAt)}
									</span>
								</div>
								{currentPost.user._id !== user._id &&
									!savingState && (
										<svg
											aria-label="Save"
											class="_ab6-"
											color="#262626"
											fill="#262626"
											height="24"
											role="img"
											viewBox="0 0 24 24"
											width="24"
											className="icon-save"
											onClick={() => handleSavePost(true)}
										>
											<polygon
												fill="none"
												points="20 21 12 13.44 4 21 4 3 20 3 20 21"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
											></polygon>
										</svg>
									)}

								{currentPost.user._id !== user._id &&
									savingState && (
										<svg
											aria-label="Remove"
											class="_ab6-"
											color="#0f83bd"
											fill="#0f83bd "
											height="24"
											role="img"
											viewBox="0 0 24 24"
											width="24"
											className="icon-save"
											onClick={() =>
												handleSavePost(false)
											}
										>
											<path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
										</svg>
									)}
								{currentPost.user._id === user._id && (
									<div className="ms-auto mb-auto">
										<EditOutlined
											className="icon icon-edit"
											onClick={() => {
												setEditPost(currentPost);
												setShowEditModal(true);
											}}
										/>
										<CloseOutlined
											className="icon icon-delete"
											onClick={() =>
												setShowDeleteModal(true)
											}
										/>
									</div>
								)}
							</div>
							<p className="post-text mt-2">{currentPost.text}</p>
						</div>
						<div className="position-relative">
							{currentPost.images.length > 0 && (
								<Carousel
									className="post-container__list-images"
									ref={(ref) => {
										slider.current = ref;
									}}
								>
									{currentPost.images.map((image) => (
										<img alt="" src={image} />
									))}
								</Carousel>
							)}
							{currentPost.images.length > 1 && (
								<>
									<div
										className="post-container__list-images__btn-prev"
										onClick={() => slider.current.prev()}
									>
										<img
											alt=""
											src={require("../../assets/images/btn-prev.png")}
										/>
									</div>
									<div
										className="post-container__list-images__btn-next"
										onClick={() => slider.current.next()}
									>
										<img
											alt=""
											src={require("../../assets/images/btn-next.png")}
										/>
									</div>
								</>
							)}
						</div>
						<div className="post-container__bottom mx-3">
							<div className="d-flex align-item-center">
								{numberOfLike > 0 && (
									<Tooltip
										title={() =>
											listToolTips.map((item) => (
												<>
													{item.fullName !== ""
														? item.fullName
														: item.user.username}
													<br />
												</>
											))
										}
										style={{
											cursor: "pointer",
											whiteSpace: "pre-wrap",
										}}
										className="number-of-like underline"
									>
										<img
											className="img-circle"
											style={{ width: "20px" }}
											src={require("../../assets/images/like.png")}
											alt=""
										/>
										<span className="ms-2">
											{numberOfLike}
										</span>
									</Tooltip>
								)}
								{numberOfComment > 0 && (
									<div className="number-of-comment ms-auto underline">
										<span
											onClick={() => handleOpenComment()}
										>
											{numberOfComment} bình luận
										</span>
									</div>
								)}
							</div>
							<div className="post-container__bottom__action">
								<div
									className={
										!likeState
											? "like-post-state col-4 d-flex justify-content-center"
											: "like-post-state col-4 d-flex justify-content-center txt-blue"
									}
									onClick={() =>
										handleCreateLike({
											postId: currentPost._id,
										})
									}
								>
									{likeState ? (
										<LikeFilled className="icon" />
									) : (
										<LikeOutlined className="icon" />
									)}

									<p>Thích</p>
								</div>
								<div
									className="col-4"
									onClick={() => handleOpenComment()}
								>
									<p>Bình luận</p>
								</div>
								<div className="col-4">
									<p>Chia sẻ</p>
								</div>
							</div>
							<div className="d-flex flex-column">
								{responseState && (
									<div className="posting-spin my-2">
										<Spin />
										<p>Đang xử lí..</p>
									</div>
								)}
								<div className="post-container__bottom__comment col-12">
									<img
										className="img-circle"
										alt=""
										src={user.avatar}
									/>
									<div className="comment">
										<TextArea
											className="textarea"
											name="text"
											placeholder="Viết bình luận..."
											autoSize={{ maxRows: 5 }}
											onChange={(e) => {
												setCommentText(e.target.value);
											}}
											value={commentText}
											onKeyDown={(e) => handleEnter(e)}
										/>
									</div>
								</div>
							</div>

							{showComment &&
								commentsOfPost?.length > 0 &&
								commentsOfPost.map(
									(comment, index) =>
										comment.post === currentPost._id && (
											<Comment
												post={post}
												comment={comment}
												handleCreateComment={
													handleCreateComment
												}
											/>
										)
								)}
							{limit < currentPost.comments.length &&
								showComment && (
									<p
										className="more-comment"
										onClick={() =>
											setLimit((prev) => prev + 5)
										}
									>
										Xem thêm bình luận
									</p>
								)}
						</div>
					</div>
					<div className="post-overlay">
						<p className="post-overlay__message">
							This post is hidden by some reasons.
						</p>
						<button
							className="post-overlay__button"
							onClick={() => setShowHiddenPost(true)}
						>
							Click to view.
						</button>
					</div>
				</div>
				<Modal
					className="delete-post-modal"
					open={showDeleteModal}
					footer={null}
					onCancel={() => setShowDeleteModal(false)}
				>
					<h5>Bạn không thể hoàn tác sau khi xóa bài viết </h5>
					<div className="delete-post-modal__footer">
						<button
							type="button"
							onClick={() => setShowDeleteModal(false)}
						>
							Thoát
						</button>
						<button
							type="primary"
							className="btn-blue"
							onClick={handleDeletePost}
						>
							Xóa
						</button>
					</div>
				</Modal>
				<EditPost
					post={editPost}
					showEditModal={showEditModal}
					handleEditPostModal={handleEditPostModal}
				/>
			</div>
		)
	);
}

export default Post;
