import { Dispatch, SetStateAction, useState } from "react";
import { TezosToolkit } from "@taquito/taquito";

interface AddCredentialProps {
    contractAddress: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    Tezos: TezosToolkit;
    userBSKey: CryptoKey;
}

const AddCredential = ({
    contractAddress,
    setActiveTab,
    Tezos,
    userBSKey,
}: AddCredentialProps): JSX.Element => {
    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [buttonText, setButtonText] = useState("Add");

    const encrypt = async (data: string): Promise<string> => {
        const initVector = new Uint8Array([21, 66, 33, 204, 85, 7, 16, 63, 113, 62, 14, 5]);
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: initVector,
            },
            userBSKey,
            new TextEncoder().encode(data)
        );
        let binary = '';
        let bytes = new Uint8Array(encrypted);
        for (let i=0; i<bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const addCredential = async (): Promise<void> => {
        setLoading(true);
        const websiteEncrypted = await encrypt(website);
        const usernameEncrypted = await encrypt(username);
        const passwordEncrypted = await encrypt(password);
        Tezos.wallet
            .at(contractAddress)
            .then((contract) => {
                console.log("Adding credential...");
                setButtonText("Adding...");
                return contract.methods.new_cred(websiteEncrypted, usernameEncrypted, passwordEncrypted).send();
            })
            .then((op) => {
                console.log(`Waiting for confirmation of ${op.opHash}...`);
                setButtonText("Waiting for confirmation...")
                return op.confirmation(1).then(() => op.opHash);
            })
            .then((hash) => {
                console.log(`Operation injected: https://ghost.tzstats.com/${hash}`);
                setButtonText("Added. Go back to list.");
                setLoading(false);
            })
            .catch((error) => {
                console.log(`Error: ${JSON.stringify(error, null, 2)}`)
                setButtonText("Error. Try again later.");
                setError(error.message);
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-neutral-300 mb-2" htmlFor="website">Website</label>
                <input
                    type="text"
                    name="website"
                    id="website"
                    className="w-auto h-12 px-4 rounded-lg bg-neutral-800 text-neutral-300 focus:border focus:border-sky-500 focus:outline-none"
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-neutral-300 mb-2" htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="w-auto h-12 px-4 rounded-lg bg-neutral-800 text-neutral-300 focus:border focus:border-sky-500 focus:outline-none"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-neutral-300 mb-2" htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-auto h-12 px-4 rounded-lg bg-neutral-800 text-neutral-300 focus:border focus:border-sky-500 focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                className="inline-flex items-center justify-center gap-2 self-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:border rounded-lg hover:border-sky-500 hover:scale-[1.02] transition-transform duration-150 ease-in-out focus:outline-none"
                onClick={addCredential}
                disabled={loading || !website || !username || !password || error !== ""}
            >
                <span>{buttonText}</span>
                {loading &&
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
            </button>
            {error && <p className="my-2 text-red-500 text-center">{error}</p>}
            <button
                className="inline-flex items-center justify-center self-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:border rounded-lg hover:border-sky-500 hover:scale-[1.02] transition-transform duration-150 ease-in-out focus:outline-none"
                onClick={() => setActiveTab("credentials")}
            >
                🠐 Back
            </button>
        </div>
    );
};

export default AddCredential;