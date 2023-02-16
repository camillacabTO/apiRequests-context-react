import { useReducer, useEffect, useState, createContext } from 'react';
import axios from 'axios';

export const PostsContext = createContext(null);

let initialState = {
  posts: [],
  isPending: false,
  error: null,
  success: null,
};

const postsReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return {
        isPending: true,
        success: false,
        error: null,
        posts: [...state.posts],
      };
    case 'FETCH_POSTS':
      return {
        isPending: false,
        posts: action.payload,
        success: true,
        error: null,
      };
    case 'ADDED_POST':
      return {
        isPending: false,
        posts: [...state.posts, action.payload],
        success: true,
        error: null,
      };
    case 'DELETED_POST':
      return {
        isPending: false,
        posts: state.posts.filter((post) => post.id !== action.payload),
        success: true,
        error: null,
      };
    case 'ERROR':
      return {
        isPending: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const PostContextProvider = ({ children }) => {
  const [globalState, dispatch] = useReducer(postsReducer, initialState);

  const fetchPosts = async () => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts`
      );
      //fetch posts from database and stored in store (global state for this context)
      dispatch({ type: 'FETCH_POSTS', payload: data });
      console.log('data', data);
    } catch (err) {
      //if there is an error, it updates the store with the error message
      dispatch({ type: 'ERROR', payload: 'could not fetch data' });
    }
  };

  const addPost = async (post) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      // add new post to the DB - updates DB
      const { data } = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        post
      );
      // add new post to the store / state - updates local state
      dispatch({ type: 'ADDED_POST', payload: data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    }
  };

  // delete a document
  const deletePost = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      // delete post in the DB
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      // delete post in the store / state - updates local state
      dispatch({ type: 'DELETED_POST', payload: id });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: 'could not delete' });
    }
  };

  useEffect(() => {
    // fetch posts from DB first time the component renders
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider
      value={{ fetchPosts, addPost, deletePost, globalState }}
    >
      {children}
    </PostsContext.Provider>
  );
};
