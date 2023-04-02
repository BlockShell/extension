import { useState } from 'react';
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';

import ConnectWallet from "@components/ConnectWallet";
import DisconnectWallet from "@components/DisconnectWallet";
import Unlock from "@components/Unlock";
import PasswordList from "@components/PasswordList";

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://ghostnet.ecadinfra.com"));
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userBSKey, setUserBSKey] = useState<CryptoKey>(); // BlockShell secret key
  const [userBSPassword, setUserBSPassword] = useState<ArrayBuffer>(new ArrayBuffer(0)); // User BlockShell hashed password
  const [storage, setStorage] = useState<MichelsonMap<string, string>>(new MichelsonMap());
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("connect");
  // Ghostnet BlockShell contract
  const contractAddress: string = "KT1XuggS2Lsgor6nZELaEn7nkQL3513WECWi"; // Random address for now

  if (publicToken && (!userAddress || isNaN(userBalance))) { // When connecting to wallet
    console.log("BlockShell: publicToken -> " + publicToken);
    console.log("BlockShell: Connecting to wallet...");
    return (
      <section className="min-w-[400px] min-h-[600px] bg-neutral-900">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-lime-600 mb-10">BlockShell</h1>
          <button type="button" className="inline-flex items-center justify-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 border rounded-lg border-sky-500 transition ease-in-out duration-150 cursor-not-allowed" disabled>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          Connecting...
          </button>
        </div>
      </section>
    )
  } else if (userAddress && !isNaN(userBalance)) { // When connected to wallet
    console.log("BlockShell: userAddress -> " + userAddress);
    console.log("BlockShell: userBalance -> " + userBalance);
    if (userBSKey) { // When BlockShell key is set
      console.log("BlockShell: Key set");
      console.log("BlockShell: userBSKey -> " + userBSKey);
      console.log("BlockShell: userBSPassword -> " + Array.from(new Uint8Array(userBSPassword)).map(x => x.toString(16).padStart(2, '0')).join(''));
      return (
        <section className="min-w-[400px] min-h-[600px] bg-neutral-900">
          <div className="flex flex-col gap-4 p-2">
            <input className="w-auto h-12 px-4 rounded-lg bg-neutral-800 text-neutral-300 focus:border focus:border-sky-500 focus:outline-none" type="text" placeholder="Rechercher" />
            <h2 className="text-neutral-400 uppercase">Credentials</h2>
            <PasswordList
              storage={storage}
            />
            <button className="inline-flex items-center justify-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:bg-neutral-600 focus:outline-none">
            <span>Add a credential</span>
            </button>
            <DisconnectWallet
              wallet={wallet}
              setPublicToken={setPublicToken}
              setUserAddress={setUserAddress}
              setUserBalance={setUserBalance}
              setWallet={setWallet}
              setTezos={setTezos}
              setBeaconConnection={setBeaconConnection}
            />
          </div>
        </section>
      )
    } else { // When BlockShell key is not set
      console.log("BlockShell: Key not set - Locked");
      return (
        <section className="min-w-[400px] min-h-[600px] bg-neutral-900">
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-lime-600 mb-10">BlockShell</h1>
            <Unlock
              setUserBSKey={setUserBSKey}
              userBSPassword={userBSPassword}
              setUserBSPassword={setUserBSPassword}
            />
          </div>
        </section>
      )
    }
  } else if (!publicToken && !userAddress && !userBalance) { // When not connected to wallet
    console.log("BlockShell: Not connected to wallet");
    return (
      <section className="min-w-[400px] min-h-[600px] bg-neutral-900">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-lime-600 mb-10">BlockShell</h1>
          <ConnectWallet
            Tezos={Tezos}
            setContract={setContract}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            contractAddress={contractAddress}
            setBeaconConnection={setBeaconConnection}
            setPublicToken={setPublicToken}
            wallet={wallet}
          />
        </div>
      </section>
    )
  } else {
    console.log("BlockShell: Error");
    return (
      <section className="min-w-[400px] min-h-[600px] bg-neutral-900">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-lime-600 mb-10">BlockShell</h1>
          <h2 className="text-2xl font-bold text-neutral-300 mb-10">An error has occured</h2>
        </div>
      </section>
    )
  }
}

export default App;