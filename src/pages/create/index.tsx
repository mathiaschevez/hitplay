import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { api } from '~/utils/api'
import { Input } from 'antd'

const Create = () => {
  const [activeSection, setActiveSection] = useState<'create' | 'add'>('create')

  return (
    <>
      <Head>
        <title>Create</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-full flex flex-1'>
        <div className='flex flex-col flex-1'>
          <div className='border-b p-6'>
            <h1 className='text-white text-5xl font-bold mb-6'>CREATE</h1>
            <div className='flex w-full justify-between'>
              <button onClick={() => setActiveSection('create')} className='text-white font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black'>
                Create a new playlist
              </button>
              <button onClick={() => setActiveSection('add')} className='text-white font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black'>
                Add to an existing playlist
              </button>
            </div>
          </div>
          { activeSection === 'create' ? <CreateSection /> : <AddSection /> }
        </div>
        <HelperAi />
      </main>
    </>
  )
}

export default Create

const HelperAi = () => {
  return (
    <div className=' w-[510px] border-l p-6 flex flex-col justify-between h-full'>
      <h1 className='text-white font-bold text-3xl'>Helper AI</h1>
      <div>
        <Input className='border-2 border-white bg-transparent text-lg font-bold' placeholder="What's a good name for a banger playlist?"/>
        <button className='border-2 rounded-lg text-white w-full mt-3 py-1 font-bold hover:bg-white hover:text-black text-lg'>Generate</button>
      </div>
    </div>
  )
}

const CreateSection = () => {
  const { data: sessionData } = useSession()
  const { data: spotifyUser } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')
  const playlistCreation = api.playlist.createPlaylist.useMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handlePlaylistCreation = async () => {
    if (sessionData && spotifyUser) {
      const playlist = await playlistCreation.mutateAsync({
        userId: sessionData.user.id,
        userSpotifyId: spotifyUser.id,
        title,
        description
      })

      console.log(playlist)
    }
  }

  return (
    <div className='p-6 flex flex-col justify-between flex-1'>
      <div className='flex flex-col h-full'>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className='bg-transparent border-2 border-white text-lg font-bold' placeholder='Title' />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} className='bg-transparent border-2 border-white text-lg font-bold mt-6' placeholder='Description' />
        <div className='mt-6 border-2 rounded-lg flex-1'>
          <h1 className='text-white font-bold text-lg p-3'>AI Suggestions</h1>
        </div>
      </div>
      <button onClick={() => void handlePlaylistCreation()} className='border-2 rounded-lg w-full text-white py-3 px-2 text-lg font-bold mt-6'>Create</button>
    </div>
  )
}

const AddSection = () => {
  return (
    <div>Add</div>
  )
}