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
    <div className={`p-6`}>
      <h1 className={`text-white font-bold text-3xl mb-6`}>Playlists with your top songs</h1>
      <div className={`grid grid-cols-5 gap-6`}>
        {['long_term', 'medium_term', 'short_term'].map((term, index) => (
          <Link key={index} href={`playlist/${term}`}>
            <div
              className={`bg-white text-black font-bold py-2 px-4 rounded-full text-center hover:bg-white/90`}
            >TOP 20 TRACKS {term.replace(/_/g, ' ').toUpperCase()}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
