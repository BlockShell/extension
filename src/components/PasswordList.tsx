import { MichelsonMap } from "@taquito/taquito";

import PasswordWrapper from "@components/PasswordWrapper";

interface PasswordListProps {
    storage: MichelsonMap<string, string>; // address, website, username, password
}

const PasswordList = ({
    storage,
}: PasswordListProps): JSX.Element => {

    if (!MichelsonMap.isMichelsonMap(storage)) {
        console.log("storage is not a MichelsonMap !!!!!!!!!!");
    }
    console.log("storage: ", storage);

    if (storage.size === 0) {
        return (
            <p className="text-center text-neutral-300">No password saved</p>
        );
    }
    const credentials: Array<[website: string, username: string, password: string]> = [];
    const entries = storage.entries();
    let next;
    while (!(next = entries.next()).done) {
        const [address, credential] = next.value;
        const items = credential.split('/');
        if (items.length !== 3) {
            console.log("credential is not in the correct format: ", credential, items.length);
            continue;
        }
        credentials.push([items[0], items[1], items[2]]);
    }

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