import React, {
	FC,
	MouseEvent,
	MutableRefObject,
	SyntheticEvent,
	useState,
} from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import styles from './AdvancedGame.module.scss';

interface AdvancedGameProps {
	engContext: string;
	rusContext: string;
	onCheck: (event: SyntheticEvent) => void;
	inputRef: MutableRefObject<HTMLInputElement | undefined>;
}

export const AdvancedGame: FC<AdvancedGameProps> = ({
	engContext,
	rusContext,
	onCheck,
	inputRef,
}) => {
	const [isAnswered, setIsAnswered] = useState(false);

	const handleCheck = (event: MouseEvent<HTMLButtonElement>) => {
		if (!isAnswered) {
			setIsAnswered(true);
			return;
		}

		onCheck(event);
	};

	return (
		<div className={styles.wrapper}>
			<h3 className={styles.title}>{rusContext}</h3>
			<TextField
				inputRef={inputRef}
				multiline={true}
				autoComplete="off"
				color="primary"
				fullWidth={true}
				label="Type your answer"
				variant="outlined"
				className={styles.verticalOffset}
			/>
			{isAnswered && (
				<TextField
					value={engContext}
					multiline={true}
					autoComplete="off"
					color="primary"
					fullWidth={true}
					variant="outlined"
					disabled={true}
					className={styles.verticalOffset}
				/>
			)}
			<Button variant="outlined" fullWidth={true} onClick={handleCheck}>
				{isAnswered ? 'Next' : 'Check'}
			</Button>
		</div>
	);
};
