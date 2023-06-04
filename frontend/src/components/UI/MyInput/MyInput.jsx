import React from 'react';
import s from './MyInput.module.scss'

const MyInput = ({ style, ...props }) => {
	return (
		<div className={s.inputs} style={{ display: 'inline-block', position: 'relative' }}>
			<input {...props} placeholder={props.placeholder} />
			<img style={style} src={props.imageSrc} alt={props.altText}  />
		</div>
	);
};

export default MyInput;