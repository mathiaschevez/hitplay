import Head from "next/head";
import { type NextPage } from 'next';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Spin } from "antd";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hitplay</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <TopPlaylistsRow />
      </main>
    </>
  );
};

export default Home;

function TopPlaylistsRow() {
  const { data: sessionData } = useSession()
  const { data: topTracks } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '' })
  const { data: topTracksMediumTerm } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '', timeRange: 'medium_term' })
  const { data: topTracksShortTerm } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '', timeRange: 'short_term' })

  return (
    <div>
      <h1>Playlists with your top songs!</h1>
      {(topTracks && topTracksMediumTerm && topTracksShortTerm) ?
        <div>
          {['long_term', 'medium_term', 'short_term'].map((term, index) => (
            <Link key={index} href={`toptrackplaylist/${term}`}>
              <div>TOP 20 TRACKS {term.replace(/_/g, ' ').toUpperCase()}</div>
            </Link>
          ))}
        </div> :
        <div className={``}>
          <Spin />
        </div>
      }
    </div>
  )
}

// function TopTracksRow() {
//   return (
//     <div>
//       <h2>Top Tracks</h2>
//       <div>Track 1</div>
//       <div>Track 2</div>
//       <div>Track 3</div>
//     </div>
//   );
// }

// function TopArtistsRow() {
//   return (
//     <div>
//       <h2>Top Artists</h2>
//       <div>Artist 1</div>
//       <div>Artist 2</div>
//       <div>Artist 3</div>
//     </div>
//   );
// }

