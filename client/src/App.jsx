import React, { useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/user/userSlice';
import { fetchConnections } from './features/connections/connectionSlice';
import { addMessages } from './features/messages/messagesSlice';
import Notification from './components/Notification';

function App() {
  const { user } = useUser()
  const { getToken } = useAuth()

  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)


  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
  }, [user, getToken, dispatch])


  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id)

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (pathnameRef.current = ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessages(message))
        } else {
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), { position: "bottom-right" })
        }
      }

      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch])


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
