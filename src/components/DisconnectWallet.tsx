import { Dispatch, SetStateAction } from 'react';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

interface ButtonProps {
    wallet: BeaconWallet | null;
    setPublicToken: Dispatch<SetStateAction<string | null>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    setWallet: Dispatch<SetStateAction<any>>;
    setTezos: Dispatch<SetStateAction<TezosToolkit>>;
    setBeaconConnection: Dispatch<SetStateAction<boolean>>;
}

const DisconnectWallet = ({
    wallet,
    setPublicToken,
    setUserAddress,
    setUserBalance,
    setWallet,
    setTezos,
    setBeaconConnection,
}: ButtonProps): JSX.Element => {
    const disconnectWallet = async (): Promise<void> => {
        if (wallet) {
            await wallet.clearActiveAccount();
            await wallet.disconnect();
        }
        setUserAddress("");
        setUserBalance(0);
        setWallet(null);
        const tezosTK = new TezosToolkit("https://rpc.ghostnet.teztnets.xyz");
        setTezos(tezosTK);
        setBeaconConnection(false);
        setPublicToken(null);
    };

    return (
        <button onClick={disconnectWallet} className="inline-flex items-center justify-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:border rounded-lg hover:border-sky-500 hover:scale-[1.02] transition-transform duration-150 ease-in-out focus:outline-none">
                <span>Disconnect Wallet</span>
            </button>
    )
}

export default DisconnectWallet;