import { MichelsonMap } from "@taquito/taquito";

import PasswordWrapper from "@components/PasswordWrapper";

interface PasswordListProps {
    storage: MichelsonMap<[string, string], MichelsonMap<string, string>>; // address, website, username, password
    userAddress: string;
    userBSKey: CryptoKey;
}

const PasswordList = ({
    storage,
    userAddress,
    userBSKey,
}: PasswordListProps): JSX.Element => {
    if (!MichelsonMap.isMichelsonMap(storage)) {
        console.log("storage is not a MichelsonMap. Is it the right contract ?"); // Should raise an error?
    }
    console.log("storage: ", storage);

    if (storage.size === 0) {
        console.log("Empty storage !");
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        )
    }

    const credentials: Array<[string, string, string]> = [];
    storage.forEach((value, key) => {
        value.forEach(async (password, username) => {
            if (key[0] === userAddress) {
                credentials.push([key[1], username, password])
            }
        });
    });

    if (credentials.length === 0) {
        console.log("No credentials found for this user.");
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        )
    }

    const listPasswords = credentials.map((credential, index) => 
        <div className="flex flex-col gap-2 border-2 hover:border-sky-500 rounded-lg border-neutral-300 text-neutral-300 hover:text-sky-500 hover:scale-[1.02] duration-150 ease-in-out">
            <PasswordWrapper
                website={credential[0]}
                username={credential[1]}
                password={credential[2]}
                userBSKey={userBSKey}
            />
        </div>
    )

    return (
        <>{listPasswords}</>
    );
}

export default PasswordList;