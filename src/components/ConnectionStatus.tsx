import {
    UnstyledButtonProps,
    Group,
    Text,
    Button,
  } from '@mantine/core';
  import { IconChevronRight } from '@tabler/icons-react';
import { SignerContext } from './SignerContext';
import { useContext } from 'react';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { SessionDataContext } from './SessionDataContext';
import { getConnectedPublicKey } from '../utils/Web3AuthAuthentication';
  
  interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }
  
  export function ConnectionStatus({ image, name, email, icon, ...others }: UserButtonProps) {
    const { signer, web3auth, setSigner, loggedIn, setLoggedIn, setUserInfo, userInfo } = useContext(SignerContext);
    const { sessionData, setSessionData } = useContext(SessionDataContext);

    const login = async () => {
      if (!web3auth) {
          console.log("web3auth not initialized yet");
          return {};
      }
      await web3auth.connect();
      // setProvider(web3authProvider);
      setLoggedIn(true);

      const userInfo = await web3auth.getUserInfo();
      setUserInfo(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      if (sessionData){
        setSessionData({ ...sessionData, clientId: userInfo.email });
      }
      const evmChain = false;

      if (evmChain) {
          const _signer = await getZeroDevSigner({
              projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
              owner: getRPCProviderOwner(web3auth.provider),
          })

          setSigner(_signer);
          console.log("signer created: ", signer);
          console.log("signer address", await _signer.getAddress());
      } else {
          const publicKey = await getConnectedPublicKey(web3auth);
          console.log(`publick key: ${publicKey?.toString()}`);
          // console.log(`userInfo: ${JSON.stringify(userInfo)}`);

          return {
              clientId: userInfo.email ?? "",
              name: userInfo.name ?? "",
              publicKey: publicKey ?? ""
          }
      }
      return {}
  };

    return (
      <Button color='blue' variant='light' onClick={login} fullWidth >
        <Group>
          {/* <Avatar src={image} radius="xl" /> */}
  
          <div style={{ flex: 1 }}>
            <Text size="sm">
              {userInfo?.name ?? ""}
            </Text>
  
            <Text color="dimmed" size="xs">
              {loggedIn ? "Logged in" : "Not logged in"}
            </Text>
          </div>
  
          {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
        </Group>
      </Button>
    );
  }