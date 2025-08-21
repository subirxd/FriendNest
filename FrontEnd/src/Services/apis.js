const BaseURL = import.meta.env.VITE_BASE_URL;

export const userRoutes = {
  fetchUser: `${BaseURL}/api/user/data`,
  updateUser: `${BaseURL}/api/user/update`,
  discoverUser: `${BaseURL}/api/user/discover`,
  followUser: `${BaseURL}/api/user/follow`,
  unfollowUser: `${BaseURL}/api/user/unfollow`,
  connectUser: `${BaseURL}/api/user/connect`,
  acceptConnection: `${BaseURL}/api/user/accept`,
  rejectConnection: `${BaseURL}/api/user/reject`,
  getConnections: `${BaseURL}/api/user/connections`,
  getProfile: `${BaseURL}/api/user/profiles`,
  getRecentMessages: `${BaseURL}/api/user/recent-messages`,
};

export const storyRoutes = {
  createStory: `${BaseURL}/api/story/create`,
  getStories: `${BaseURL}/api/story/getStory`,
};

export const postRoutes = {
  addPost: `${BaseURL}/api/post/add`,
  getFeed: `${BaseURL}/api/post/feed`,
  likePost: `${BaseURL}/api/post/like`,
};

export const messageRoutes = {
  messageStream: (userId) => `${BaseURL}/api/message/${userId}`, // dynamic
  sendMessage: `${BaseURL}/api/message/send`,
  getMessages: `${BaseURL}/api/message/get`,
};
