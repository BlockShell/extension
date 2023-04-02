import { MichelsonMap } from "@taquito/taquito";

import PasswordWrapper from "@components/PasswordWrapper";

interface PasswordListProps {
    storage: MichelsonMap<[string, string], MichelsonMap<string, string>>; // address, website, username, password
}

const PasswordList = ({
    storage,
}: PasswordListProps): JSX.Element => {

    if (!MichelsonMap.isMichelsonMap(storage)) {
        console.log("storage is not a MichelsonMap !!!!!!!!!!");
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        )
    }
    console.log("storage: ", storage);

    if (storage.size === 0) {
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        );
    }
    const credentials: Array<[website: string, username: string, password: string]> = [];
    storage.forEach((value, key) => {
        const website = key[1];
        value.forEach((password, username) => {
            credentials.push([website, username, password]);
        });
    });

    if (credentials.length === 0) {
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        );
    }
    const listPasswords = credentials.map((credential, index) =>
        <div className="flex flex-col gap-2 border-2 hover:border-sky-500 rounded-lg border-neutral-300 text-neutral-300 hover:text-sky-500 hover:scale-[1.02] duration-150 ease-in-out">
            <PasswordWrapper
                website={credential[0]}
                username={credential[1]}
                password={credential[2]}
            />
        </div>
    );

    return (
        <>{listPasswords}</>
    );
}

export default PasswordList;