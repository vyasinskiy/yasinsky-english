import * as React from 'react';
import { Button, TextField } from '@mui/material';
import { ChangeEvent, FC, FormEvent, useState } from 'react';

interface CheckFormProps {
	onCheck: (value: string) => void;
}

export const CheckForm: FC<CheckFormProps> = ({ onCheck }) => {
	const [value, setValue] = useState('');

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onCheck(value);
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				onChange={onChange}
				value={value}
				label="Type your answer"
				variant="outlined"
			/>
			<Button type="submit">Answer!</Button>
		</form>
	);
};
