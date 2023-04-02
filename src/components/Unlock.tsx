import { Dispatch, SetStateAction, useState } from "react";

interface KeyBuilderProps {
    setUserBSKey: Dispatch<SetStateAction<CryptoKey | undefined>>;
    userBSPassword: ArrayBuffer;
    setUserBSPassword: Dispatch<SetStateAction<ArrayBuffer>>;
}

const KeyBuilder = ({
    setUserBSKey,
    userBSPassword,
    setUserBSPassword,
}: KeyBuilderProps): JSX.Element => {
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const enc = new TextEncoder();

    const passwordToggle = () => {
        setShowPassword(!showPassword);
    }

    const getPassword = (event: any) => {
        event.preventDefault();
        setPassword(event.currentTarget.value);
    }

    const buildKey = async (): Promise<void> => {
        // First, hash the password using SHA-256
        setUserBSPassword(await crypto.subtle.digest("SHA-256", enc.encode(password)));
        console.log("Password hashed.");
        // Then, generate a key from the hashed password
        setUserBSKey(await window.crypto.subtle.importKey("raw", userBSPassword, "AES-GCM", false, ["encrypt", "decrypt"]));
        console.log("Key generated.");
    }

    return (
        <>
            <label className="text-2xl self-start font-bold text-neutral-300 mb-2" htmlFor="password">Enter password:</label>
            <div className="flex flex-row justify-center gap-2 w-full mb-10">
                <input onChange={getPassword} className="w-auto h-12 px-4 rounded-lg bg-neutral-800 text-neutral-300 focus:border focus:border-sky-500 focus:outline-none" name="password" type={showPassword ? "text" : "password"} value={password} />
                <button className="inline-flex p-2 rounded-lg hover:bg-neutral-600 text-neutral-300 group-hover:text-sky-500" onClick={passwordToggle}>
                    {showPassword ?
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><path d="M4 4L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.22308 5.63732C4.19212 6.89322 2.60069 8.79137 1.73175 11.0474C1.49567 11.6604 1.49567 12.3396 1.73175 12.9526C3.31889 17.0733 7.31641 20 12 20C14.422 20 16.6606 19.2173 18.4773 17.8915L17.042 16.4562C15.6033 17.4309 13.8678 18 12 18C8.17084 18 4.89784 15.6083 3.5981 12.2337C3.54022 12.0835 3.54022 11.9165 3.5981 11.7663C4.36731 9.76914 5.82766 8.11625 7.6854 7.09964L6.22308 5.63732ZM9.47955 8.89379C8.5768 9.6272 7.99997 10.7462 7.99997 12C7.99997 14.2091 9.79083 16 12 16C13.2537 16 14.3728 15.4232 15.1062 14.5204L13.6766 13.0908C13.3197 13.6382 12.7021 14 12 14C10.8954 14 9.99997 13.1046 9.99997 12C9.99997 11.2979 10.3618 10.6802 10.9091 10.3234L9.47955 8.89379ZM15.9627 12.5485L11.4515 8.03729C11.6308 8.0127 11.8139 8 12 8C14.2091 8 16 9.79086 16 12C16 12.1861 15.9873 12.3692 15.9627 12.5485ZM18.5678 15.1536C19.3538 14.3151 19.9812 13.3259 20.4018 12.2337C20.4597 12.0835 20.4597 11.9165 20.4018 11.7663C19.1021 8.39172 15.8291 6 12 6C11.2082 6 10.4402 6.10226 9.70851 6.29433L8.11855 4.70437C9.32541 4.24913 10.6335 4 12 4C16.6835 4 20.681 6.92668 22.2682 11.0474C22.5043 11.6604 22.5043 12.3396 22.2682 12.9526C21.7464 14.3074 20.964 15.5331 19.9824 16.5682L18.5678 15.1536Z" fill="currentColor"></path></g></svg>
                        :
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><path d="M21.335 11.4069L22.2682 11.0474L21.335 11.4069ZM21.335 12.5932L20.4018 12.2337L21.335 12.5932ZM2.66492 11.4068L1.73175 11.0474L2.66492 11.4068ZM2.66492 12.5932L1.73175 12.9526L2.66492 12.5932ZM3.5981 11.7663C4.89784 8.39171 8.17084 6 12 6V4C7.31641 4 3.31889 6.92667 1.73175 11.0474L3.5981 11.7663ZM12 6C15.8291 6 19.1021 8.39172 20.4018 11.7663L22.2682 11.0474C20.681 6.92668 16.6835 4 12 4V6ZM20.4018 12.2337C19.1021 15.6083 15.8291 18 12 18V20C16.6835 20 20.681 17.0733 22.2682 12.9526L20.4018 12.2337ZM12 18C8.17084 18 4.89784 15.6083 3.5981 12.2337L1.73175 12.9526C3.31889 17.0733 7.31641 20 12 20V18ZM20.4018 11.7663C20.4597 11.9165 20.4597 12.0835 20.4018 12.2337L22.2682 12.9526C22.5043 12.3396 22.5043 11.6604 22.2682 11.0474L20.4018 11.7663ZM1.73175 11.0474C1.49567 11.6604 1.49567 12.3396 1.73175 12.9526L3.5981 12.2337C3.54022 12.0835 3.54022 11.9165 3.5981 11.7663L1.73175 11.0474Z" fill="currentColor"></path><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle></g></svg>}
                </button>
            </div>
            <button onClick={buildKey} className="inline-flex items-center justify-center self-center w-auto h-12 px-4 bg-neutral-800 text-neutral-300 hover:border rounded-lg hover:border-sky-500 hover:scale-[1.02] transition-transform duration-150 ease-in-out focus:outline-none" disabled={password.length === 0}>
                <span>Unlock</span>
            </button>
        </>
    )
}

export default KeyBuilder;