import './App.css'
import { useState } from 'react';
import { GET_USERS } from './query/user';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER, DELETE_USER } from './mutation/user';
import { CREATE_POST, DELETE_POST } from './mutation/post';

type Post = {
  id: number;
  userId: number;
  text: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  posts?: Post[];
}

function App() {
  const { loading, error, data, refetch: refetchUsers } = useQuery<{ getUsers: User[] }>(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [createPost] = useMutation(CREATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [textData, setTextData] = useState<Record<number, string>>({});

  const handleUserCreate = () => {
    createUser({
      variables: {
        createUserInput: {
          name, email
        }
      }
    }).then(() => {
      setName('');
      setEmail('');
      refetchUsers();
    });
  };

  const handleUserDelete = (id: number) => {
    deleteUser({
      variables: { id }
    }).then(refetchUsers);
  };

  const handlePostCreate = (id: number) => {
    createPost({
      variables: {
        createPostInput: {
          userId: id, text: textData[id]
        }
      }
    }).then(() => {
      setTextData(Object.fromEntries(Object.entries(textData).filter(([key]) => Number(key) !== id)));
      refetchUsers();
    });
  };

  const handlePostDelete = (id: number) => {
    deletePost({
      variables: { id }
    }).then(refetchUsers);
  };

  return (
    <div>
      <div className='userForm'>
        <h2>Create user</h2>
        <form>
          <label htmlFor='name' className='label'>
            Name
            <input 
              id='#name'
              type='text'
              value={name}
              className='input'
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor='email' className='label'>
            Email
            <input
              id='#email'
              type='email'
              value={email}
              className='input'
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type='button' className='submitButton' onClick={handleUserCreate}>Create</button>
        </form>
      </div>

      {loading && <h2>Loading...</h2>}

      {error && <h4>Error : {error.message}</h4>}

      {!loading && !error && (
        <div className='cards'>
          {data?.getUsers?.map(({ id, name, email, posts }) => (
            <div key={id} className='card'>
              <h3>{name}</h3>
              <p><span>Email: </span>{email}</p>
              <button type='button' className='deleteButton' onClick={() => handleUserDelete(id)}>Delete</button>

              <div className='posts'>
                <h4>{posts?.length ? 'Posts:' : 'No posts yet'}</h4>
                {posts?.map(({ id, text }) => (
                  <div key={id} className='post'>
                    <p>{text}</p>
                    <button type='button' className='postDeleteButton' onClick={() => handlePostDelete(id)}>x</button>
                  </div>
                ))}
              </div>

              <input 
                type='text'
                value={textData[id] || ''}
                className='input'
                placeholder='Type something...'
                onChange={(e) => setTextData((prev) => ({ ...prev, [id]: e.target.value }))}
              />

              <button type='button' className='addButton' onClick={() => handlePostCreate(id)}>Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App;
