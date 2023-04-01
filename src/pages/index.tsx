import Head from "next/head";
import { type NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { Layout } from "~/components/Layout";

const Home: NextPage = () => {
  const { data: sessionData } = useSession()

  return (
    <>
      <Head>
        <title>Hitplay</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        { sessionData?.user ? <Main /> : <Auth /> }
      </main>
    </>
  );
};

export default Home;

function Main() {
  return (
    <Layout>
      <div>Main</div>
    </Layout>
  )
}

function Auth() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-[#090446] to-[#1A0BC1] w-screen items-center justify-center'>
      <h1 className='text-5xl text-[#7165F6] font-extrabold sm:text-[5rem] mb-9'>Hitplay</h1>
      <button
        className='rounded-full w-72 bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20'
        onClick={() => void signIn()}
      >
        Sign In
      </button>
    </div>
  )
}