import React, { lazy, Suspense, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Layout from './pages/Layout';
import Feed from './pages/Feed';
const Message = lazy(() => import('./pages/Message'));
const ChatBox = lazy(() => import('./pages/ChatBox'));
const Connection = lazy(() => import('./pages/Connection'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Discover = lazy(() => import('./pages/Discover'));
const Profile = lazy(() => import('./pages/Profile'));
const Notification = lazy(() => import('./components/Notification'));
const Loading = lazy(() => import('./components/Loading'));

import { useAuth, useUser } from '@clerk/react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/user/userSlice';
import { fetchConnections } from './features/connections/connectionSlice';
import { addMessages } from './features/messages/messagesSlice';

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
        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
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
          <Route path='/messages' element={<Suspense fallback={<Loading />}><Message /> </Suspense>} />
          <Route path='/messages/:userId' element={<Suspense fallback={<Loading />}><ChatBox /> </Suspense>} />
          <Route path='/connections' element={<Suspense fallback={<Loading />}><Connection /> </Suspense>} />
          <Route path='/discover' element={<Suspense fallback={<Loading />}><Discover /> </Suspense>} />
          <Route path='/profile' element={<Suspense fallback={<Loading />}><Profile /> </Suspense>} />
          <Route path='/profile/:profileId' element={<Suspense fallback={<Loading />}><Profile /> </Suspense>} />
          <Route path='/create-post' element={<Suspense fallback={<Loading />}><CreatePost /> </Suspense>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
