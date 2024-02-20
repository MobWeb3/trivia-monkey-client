/**
 * Card component to pick user web3 level (beginner or advanced)
 */

import React from "react";
import { Card, Text, Button, Group, Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { colors } from "../colors";
import classes from './PickUserLevelCard.module.css';
import { login } from "../../authentication/Login";
import useLocalStorageState from "use-local-storage-state";
import { SessionData } from "../../screens/SessionData";
import { AuthSessionData } from "../../game-domain/AuthSessionData";

// PickUserLevelCard props
export interface PickUserLevelCardProps {
    showCard: boolean;
    styles?: any;
}

const PickUserLevelCard: React.FC<PickUserLevelCardProps> = ({ showCard, styles }) => {
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const [isSigningIn, setIsSigningIn] = React.useState(false);
    const navigate = useNavigate();


    const ButtonOptions = () => {
        return (
            <>
                <Button
                    color={colors.purple}
                    className={classes.button}
                    onClick={async () => {
                        setIsSigningIn(true);
                        const { userInfo, network } = await login();
                        if (userInfo !== undefined || userInfo!) {
                            setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });
                            setAuthSessionData({ ...authSessionData, userInfo, currentNetwork: network });
                            setIsSigningIn(false);
                            navigate('/playlobby');
                        }
                    }}
                >
                    Beginner
                </Button>
                <Button
                    color={colors.purple}
                    className={classes.button}
                    onClick={() => navigate('/playlobby')}
                >
                    Advanced
                </Button>
            </>
        )
    }

    return (
        showCard ? <Card
            shadow="xs"
            padding="md"
            radius="md"
            className={classes.card}
            bg={colors.purple_gradient}
            style={styles}
        >
            <Text size="xl" className={classes.textXl} c={colors.yellow}>
                Are you ready for the challenge?
            </Text>
            <Text size="sm" className={classes.textSm} c={colors.yellow}>
                Choose your web3 expertise level to start the game.
            </Text>
            <Group justify="center" p={'sm'}>
                {isSigningIn ? <Loader size={30} /> : <ButtonOptions />}
            </Group>


        </Card> : null
    );
};

export default PickUserLevelCard;