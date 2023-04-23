import Head from "next/head";
import { type NextPage } from 'next';
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
  return (
    <div>
      <h1>Playlists with your top songs!</h1>
      <div>
        {['long_term', 'medium_term', 'short_term'].map((term, index) => (
          <Link key={index} href={`playlist/${term}`}>
            <div>TOP 20 TRACKS {term.replace(/_/g, ' ').toUpperCase()}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
