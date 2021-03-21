import Head from "next/head";
import { Card } from "../components";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chess Break</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Chess Break!</h1>

        <p className={styles.description}>
          Training games to build your chess vision
        </p>

        <div className={styles.grid}>
          <Card href="/type-to-move" title="Type to move &rarr;">
            <p>Make moves by typing the correct algebraic notation.</p>
          </Card>
          <Card href="/chat" title="Real-time chat powered by Phoenix &rarr;">
            <p>Chat!</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
