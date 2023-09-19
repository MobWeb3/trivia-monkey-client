import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Text,
    createStyles,
  } from '@mantine/core';
  import { IconChevronRight } from '@tabler/icons-react';
import { SignerContext } from './SignerContext';
import { useContext } from 'react';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { getConnectedPublicKey } from '../ably/ChannelListener';

  
  const useStyles = createStyles((theme) => ({
    user: {
      display: 'block',
      width: '100%',
      padding: theme.spacing.md,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      },
    },
  }));
  
  interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }
  
  export function ConnectionStatus({ image, name, email, icon, ...others }: UserButtonProps) {
    const { classes } = useStyles();
    // const { loggedIn, userInfo } = useContext(SignerContext);
    const { signer, web3auth, setSigner, loggedIn, setLoggedIn, setUserInfo, userInfo } = useContext(SignerContext);


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
      <UnstyledButton className={classes.user} {...others} onClick={login}>
        <Group>
          {/* <Avatar src={image} radius="xl" /> */}
  
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {userInfo?.name ?? ""}
            </Text>
  
            <Text color="dimmed" size="xs">
              {loggedIn ? "Logged in" : "Not logged in"}
            </Text>
          </div>
  
          {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
        </Group>
      </UnstyledButton>
    );
  }