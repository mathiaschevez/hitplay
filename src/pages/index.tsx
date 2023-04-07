import Head from "next/head";
import { type NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hitplay</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div>Main</div>
      </main>
    </>
  );
};

export default Home;

