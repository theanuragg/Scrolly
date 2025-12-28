import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Ping Pong GameJam - Solana Integration</title>
        <meta
          name="description"
          content="Real-time ping pong game with Solana blockchain integration and cryptocurrency rewards"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
