import { useContext, useState, useEffect } from 'react';
import './App.css';
import { PostsContext } from './contexts/PostContext';

function App() {
  const { addPost, deletePost, globalState } = useContext(PostsContext);
  const { posts, isPending, error, success } = globalState;

  console.log(globalState);
  console.log('Home rerendered');

  const post1 = {
    title: 'MY TITLE IS CATCHING. WHAT A GREAT TITLE',
    body: 'I have a great body',
    userId: 300,
  };

  // triggers rerender once a CRUD operation is successful to update UI wit the most up to date data
  useEffect(() => {
    // clean forms here
  }, [success]);

  return (
    <div className='App'>
      <button onClick={() => addPost(post1)}>Add Sample Post</button>
      {'  '}
      <button onClick={() => deletePost(99)}>Delete Post number 99</button>
      {error && <h3>{error}</h3>}
      {isPending ? (
        <h3>Pending</h3>
      ) : (
        posts?.map((post) => (
          <p>
            {post.id}: {post.title}
          </p>
        ))
      )}
    </div>
  );
}

export default App;
