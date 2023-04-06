export type Track = {
  id: string
  name: string
  artists: {
    id: string
    name: string
  }[]
  preview_url: string
  album: {
    images: {
      url: string
    }[]
  },
  uri: string
}

export type PlaylistTrack = {
  track: Track
}

export type Playlist = {
  id: string
  name: string
  images: {
    url: string,
    height: number,
    width: number,
  }[],
  owner: {
    id: string,
  }
  tracks: {
    total: number
  }
}

export type Artist = {
  id: string
  name: string
  images: {
    url: string
  }[]
}
