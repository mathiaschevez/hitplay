import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { api } from '~/utils/api'
import { Input } from 'antd'
import { addSelectedTrack, clearSelectedTracks, removeSelectedTrack, selectSelectedTracks } from '~/store/reducers/creationSlice'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { type Track } from '~/utils/types'
import { VscDiffAdded } from 'react-icons/vsc'
import { AiFillCheckCircle } from 'react-icons/ai'

const Create = () => {
  const [activeSection, setActiveSection] = useState<'create' | 'add'>('create')
  const selectedTracks = useAppSelector(selectSelectedTracks)

  return (
    <>
      <Head>
        <title>Create</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex h-full'>
        <div className='flex flex-col w-full'>
          <h1 className='text-white text-5xl font-bold mb-6 px-6 pt-6'>CREATE</h1>
          <div className='flex w-full justify-between border-b pb-6 px-6'>
            <button onClick={() => setActiveSection('create')} className='text-white font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black'>
              Create a new playlist
            </button>
            <button onClick={() => setActiveSection('add')} className='text-white font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black'>
              Add to an existing playlist
            </button>
          </div>
          { activeSection === 'create' ? <CreateSection selectedTracks={selectedTracks} /> : <AddSection /> }
        </div>
        {/* <HelperAi selectedTracks={selectedTracks} /> */}
      </main>
    </>
  )
}

export default Create

// const HelperAi = ({ selectedTracks }: { selectedTracks: Track[] }) => {
//   return (
//     <div className='w-[30%] border-l p-6'>
//       <h1 className='text-white font-bold text-3xl'>Helper AI</h1>
//     </div>
//   )
// }

const CreateSection = ({ selectedTracks }: { selectedTracks: Track[] }) => {
  const dispatch = useAppDispatch()
  const { data: sessionData } = useSession()
  const { data: spotifyUser } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')
  const { data: userTopTracks } = api.user.getCurrentUserTopTracks.useQuery(sessionData?.user.id ?? '')
  const playlistCreation = api.playlist.createPlaylist.useMutation()
  const addTracksToPlaylist = api.playlist.addTracksToPlaylist.useMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handlePlaylistCreation = async () => {
    if (!sessionData || !spotifyUser) return
    const playlist = await playlistCreation.mutateAsync({
      userId: sessionData.user.id,
      userSpotifyId: spotifyUser.id,
      title,
      description
    })

    if(playlist?.id && selectedTracks.length > 0) {
      const playlistWithTracks = await addTracksToPlaylist.mutateAsync({
        userId: sessionData.user.id,
        playlistId: playlist?.id,
        trackList: selectedTracks.map(track => track.uri)
      })

      console.log(playlistWithTracks, 'PLAYLIST WITH TRACKS')
    }

    dispatch(clearSelectedTracks())
    setTitle('')
    setDescription('')
  }

  return (
    <div className='p-6'>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className='bg-[#0B132B] border-2 border-white text-lg font-bold' placeholder='Title' />
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className='bg-[#0B132B] border-2 border-white text-lg font-bold mt-6' placeholder='Description' />
      <Input className='border-2 border-white bg-[#0B132B] text-lg font-bold mt-6' placeholder='Search for tracks' />
      <div className='flex w-full justify-between gap-12'>
        <div className='bg-[#0B132B] flex flex-col mt-6 border-2 rounded-lg overflow-y-scroll max-h-[400px] w-[50%]'>
          { userTopTracks?.items.map((track) => (
            <div key={track.id} className='text-white border-b px-3 py-2 flex justify-between'>
              <div>{track.name}</div>
              { selectedTracks.find((selectedTrack) => selectedTrack.id === track.id) ? 
                <button onClick={() => dispatch(removeSelectedTrack({ trackId: track.id }))}><AiFillCheckCircle size={27} /></button> :
                <button onClick={() => dispatch(addSelectedTrack(track))}><VscDiffAdded size={27} /></button>
              }
            </div>
          ))}
        </div>
        <div className='border-2 rounded-lg bg-[#0B132B] mt-6 overflow-y-scroll max-h-[400px] w-[50%]'>
          <h1 className='px-3 py-2 text-white border-b font-bold text-lg'>Songs in Playlist</h1>
          { selectedTracks.map((track) => (
            <div key={track.id} className='text-white border-b px-3 py-2 flex justify-between'>
              <div>{track.name}</div>
            </div>  
          ))}
        </div>
      </div>
      <button disabled={!title} onClick={() => void handlePlaylistCreation()} className='border-2 rounded-lg w-full text-white py-3 px-2 text-lg font-bold mt-3'>Create</button>
    </div>
  )
}

const AddSection = () => {
  return (
    <div>Add</div>
  )
}