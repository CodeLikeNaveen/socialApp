import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Message from './pages/Message';
import ChatBox from './pages/ChatBox';
import Layout from './pages/Layout';
import Connection from './pages/Connection';
import CreatePost from './pages/CreatePost';
import Discover from './pages/Discover';
import Profile from './pages/Profile';

import { useAuth, useUser } from '@clerk/react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

function App() {
  const { user } = useUser()
  const { getToken } = useAuth()
  useEffect(() => {
    if (user) {
      getToken().then((token) => console.log(token))
    }
  }, [user])
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path='/messages' element={<Message />} />
          <Route path='/messages/:userId' element={<ChatBox />} />
          <Route path='/connections' element={<Connection />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:profileId' element={<Profile />} />
          <Route path='/create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
