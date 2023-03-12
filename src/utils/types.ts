export type Playlist = {
  id: string
  name: string
  images: {
    url: string,
    height: number,
    width: number,
  }[] 
}

export type Track = {
  id: string
  name: string
  artists: {
    id: string
    name: string
  }[]
  preview_url: string
}
