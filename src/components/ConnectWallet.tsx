import { Dispatch, SetStateAction, useEffect } from 'react';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import {
    NetworkType,
    BeaconEvent,
    defaultEventCallbacks,
} from "@airgap/beacon-dapp";

interface ButtonProps {
    Tezos: TezosToolkit;
    setContract: Dispatch<SetStateAction<any>>;
    setWallet: Dispatch<SetStateAction<any>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    setStorage: Dispatch<SetStateAction<MichelsonMap<[string, string], MichelsonMap<string, string>>>>;
    contractAddress: string;
    setBeaconConnection: Dispatch<SetStateAction<boolean>>;
    setPublicToken: Dispatch<SetStateAction<string | null>>;
    wallet: BeaconWallet;
}

const ConnectWallet = ({
    Tezos,
    setContract,
    setWallet,
    setUserAddress,
    setUserBalance,
    setStorage,
    contractAddress,
    setBeaconConnection,
    setPublicToken,
    wallet,
}: ButtonProps): JSX.Element => {
    const setup = async (userAddress: string): Promise<void> => {
        setUserAddress(userAddress);
        // Update user balance
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());
        // Create contract instance
        const contract = await Tezos.wallet.at(contractAddress);
        setContract(contract);
        setStorage(await contract.storage());
    };

    const connectWallet = async (): Promise<void> => {
        try {
            await wallet.requestPermissions({
                network: {
                    type: NetworkType.GHOSTNET,
                    rpcUrl: "https://rpc.ghostnet.teztnets.xyz",
                }
            });
            // Get user address
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
            setBeaconConnection(true);
        } catch(error) {
            console.log("Error while connecting wallet: ", error);
        }
    };

    useEffect(() => {
        (async () => {
            // Create a wallet instance
            const wallet = new BeaconWallet({
                name: "BlockShell",
                preferredNetwork: NetworkType.GHOSTNET,
                disableDefaultEvents: true,
                eventHandlers: {
                    // Keep the pairing alert
                    [BeaconEvent.PAIR_INIT]: {
                        handler: defaultEventCallbacks.PAIR_INIT
                    },
                    [BeaconEvent.PAIR_SUCCESS]: {
                        handler: data => setPublicToken(data.publicKey)
                    }
                }
            });
            Tezos.setWalletProvider(wallet);
            setWallet(wallet);
            // Check if wallet was connected before
            const activeAccount = await wallet.client.getActiveAccount();
            if (activeAccount) {
                const userAddress = await wallet.getPKH();
                await setup(userAddress);
                setBeaconConnection(true);
            }
        })();
    });

    return (
            <button onClick={connectWallet} className="inline-flex items-center justify-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:border rounded-lg hover:border-sky-500 hover:scale-[1.02] transition-transform duration-150 ease-in-out focus:outline-none">
                <span>Connect Wallet</span>
            </button>
    )
}

export default ConnectWallet;