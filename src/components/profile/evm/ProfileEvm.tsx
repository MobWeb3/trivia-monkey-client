import { useAccount, useEnsName } from 'wagmi'
import { useContext, useEffect } from 'react'
import { SignerContext } from '../../SignerContext'
import { mintNftActive } from '../../../evm/user-operation/mint'
import { getProvider } from '../../../evm/alchemy/Web3AuthSigner'
import { getNftsFromSmartAccount, providerWithAlchemyEnhancedApis } from '../../../evm/alchemy/EnhancedApis'
import { useNavigate } from 'react-router-dom'
import { getWeb3AuthSigner } from '../../../authentication/Web3AuthAuthentication'

export function ProfileEvm() {
    const { address, isConnected, connector: activeConnector, } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { web3auth, setWeb3auth } = useContext(SignerContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWeb3auth = async () => {
            const web3authSigner = await getWeb3AuthSigner();
            setWeb3auth(web3authSigner.inner);
        };

        const getActiveConnectorData = async () => {
            if (!activeConnector) return;
            // console.log('activeConnector data: ', activeConnector);
        }

        if (!activeConnector && !web3auth) {
            fetchWeb3auth();
        }

        getActiveConnectorData();
    }, [activeConnector, setWeb3auth, web3auth]);


    if (!isConnected) {
        // Show a loading spinner or a placeholder
        return <div>Loading...</div>;
    }

    if (isConnected) {
        return (
            <div>
                Connected to {ensName ?? address}
                <button onClick={async () => {
                    if (web3auth) {
                        const web3authSigner = await getWeb3AuthSigner();
                        const provider = getProvider(web3authSigner);
                        await mintNftActive(provider);
                    }

                }}>MintNft</button>
                <button onClick={async () => {
                    const web3authSigner = await getWeb3AuthSigner();
                    // console.log('providerWithAlchemyEnhancedApis: ', providerWithAlchemyEnhancedApis);
                    if (web3authSigner) {
                        const provider = getProvider(web3authSigner);
                        const providerWithAlchemy = providerWithAlchemyEnhancedApis(provider);
                        await getNftsFromSmartAccount(providerWithAlchemy);
                    }
                }}>GetNfts</button>
                <button onClick={async () => {
                   navigate('/wallet')
                }}>Wallet</button>
            </div>
        )
    }

    return <button onClick={async () => {
        const web3authSigner = await getWeb3AuthSigner();
        setWeb3auth(web3authSigner.inner);
        // connect()
    }}>Connect Wallet</button>
}