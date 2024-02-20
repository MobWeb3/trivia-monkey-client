import { Flex } from '@mantine/core';
import OptionButton from './OptionButton';
import { useNavigate } from 'react-router-dom';
import { colors } from '../colors';
import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../../game-domain/AuthSessionData';

type ModalContentProps = {
    style?: React.CSSProperties;
    closeModal?: () => void;
    children?: React.ReactNode;
};

export const ActionOptionsComponent = () => {
    const navigate = useNavigate();
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});

    // mint session data as NFT
    const mintSessionData = async () => {
        // get network from useLocalStorageState
        const sessionData = localStorage.getItem('sessionData');
        console.log('mintSessionData: sessionData: ', sessionData);
    
        console.log('mintSessionData: authSessionData: ', authSessionData);
    }

    return (
        // Flex component from Mantine
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            w="100%"
            h="auto" // Fixed height
        >
            <OptionButton
                fontSize={"20px"}
                onClick={() => {
                    console.log("clicked")
                    mintSessionData();
                }}
                background={colors.yellow_gradient}
                color={colors.black}
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit and Save
            </OptionButton>

            <OptionButton
                fontSize={"20px"}
                onClick={() => {
                    // Delete game session
                    localStorage.removeItem('sessionData');

                    // Redirect to lobby
                    navigate('/playlobby')
                }}
                background={colors.yellow_gradient}
                color={colors.black}
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit Without Saving
            </OptionButton>
        </Flex>

    );
};

export default ActionOptionsComponent;
