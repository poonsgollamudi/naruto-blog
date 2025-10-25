const POSTS_STORAGE_KEY = 'naruto-blog-posts';

export const savePostsToStorage = (posts) => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts:', error);
  }
};

export const loadPostsFromStorage = () => {
  try {
    const posts = localStorage.getItem(POSTS_STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Failed to load posts:', error);
    return [];
  }
};