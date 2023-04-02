import { Dispatch, SetStateAction } from "react";
import { MichelsonMap } from "@taquito/taquito";

interface UpdateStorageProps {
    contract: any;
    setStorage: Dispatch<SetStateAction<MichelsonMap<[string, string], MichelsonMap<string, string>>>>;
}

const UpdateStorage = ({
    contract,
    setStorage,
}: UpdateStorageProps): JSX.Element => {
    const updateStorage = async (): Promise<void> => {
        const newStorage = await contract.storage();
        setStorage(newStorage);
    }

    return (
        <button className="inline-flex p-2 rounded-lg hover:bg-neutral-600 text-neutral-300 group-hover:text-sky-500" onClick={updateStorage}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g> <rect fill-rule="nonzero" x="0" y="0" width="24" height="24"></rect><path d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762" stroke="currentColor" stroke-width="2" stroke-linecap="round"> </path><path d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g></g></g></svg>
        </button>
    );
}

export default UpdateStorage;