import React from 'react'
import { api } from '~/utils/api'

const Tracks = () => {
  const tracks = api.track.getTracks.useQuery()


  console.log(tracks.data, 'TRACKS')

  return (
    <div>Tracks</div>
  )
}

export default Tracks