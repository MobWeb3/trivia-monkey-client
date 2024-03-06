import { getWeb3AuthSigner } from "./Web3AuthAuthentication";

export const logout = async () => {

    const web3authSigner = await getWeb3AuthSigner();
    const web3auth = web3authSigner.inner;
    if (!web3auth) {
        console.log('Could not get web3auth instance. Could not logout');
        return;
    }
    try {
        await web3auth.logout();
        web3auth.clearCache();
    } catch (error) {
        console.error(error);
    }
    localStorage.removeItem('userInfo'); // Deprecated
    localStorage.removeItem('web3auth'); // Deprecated
    localStorage.removeItem('sessionData');
    localStorage.removeItem('authSessionData');
    console.log('Disconnected');
};