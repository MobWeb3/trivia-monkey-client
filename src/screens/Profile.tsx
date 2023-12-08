import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { chains } from '../evm/WagmiConnector'
import { useContext } from 'react'
import { SignerContext } from '../components/SignerContext'
import { getWeb3AuthSigner } from '../evm/Login'
// import { InjectedConnector } from 'wagmi/connectors/injected'

export function Profile() {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { web3auth, setWeb3auth } = useContext(SignerContext);
    const { connect } = useConnect({
        connector: new Web3AuthConnector({
            chains,
            options: {
                web3AuthInstance: web3auth!,
            },
        }),
    })

    if (isConnected) return <div>Connected to {ensName ?? address}</div>
    return <button onClick={async () => {
        const web3authSigner = await getWeb3AuthSigner();
        setWeb3auth(web3authSigner.inner);
        connect()
    }}>Connect Wallet</button>
}