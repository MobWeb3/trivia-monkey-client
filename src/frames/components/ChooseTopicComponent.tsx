import DisplayBadge from '../../components/topics/DisplayBadge';
import CustomTopicEntries from '../../components/topics/CustomTopicEntries';
import CustomButton from '../../components/CustomButton';

type ModalContentProps = {
    numberOfQuestions: number;
    style?: React.CSSProperties;
    closeModal?: () => void;
    children?: React.ReactNode;
};

export const ChooseTopicComponent = ({ numberOfQuestions, ...props }: ModalContentProps) => {
    
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            ...props.style
        }}>
            {/* <DisplayBadge text="Topics" fontSize='30px' /> */}

            <div style={{ padding: '5px' }}>
                {/* <ChipGroup
                    options={generalTopics}
                    disabled={chipDisabled}
                /> */}
                <DisplayBadge text="Topic of choice" fontSize='30px' />
                <CustomTopicEntries
                    entrySize={1}
                />

            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <CustomButton
                    fontSize='30px'
                    onClick={props.closeModal}
                    style={{ marginTop: '0px' }}
                >Done</CustomButton>
            </div>
        </div>
    );
};

export default ChooseTopicComponent;
