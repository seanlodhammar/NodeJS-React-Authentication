import React, { forwardRef, useEffect, useState } from 'react';
import './InputField.css';

const InputField = forwardRef((props, ref) => {

    const [error, setError] = useState();

    useEffect(() => {
        if(props.errors) {
            const errorFind = props.errors.find(error => error.param.includes(idSplit));
            setError(errorFind);
            return;
        }
        setError(false);
    })

    const idSplit = props.inputId.split('-')[0];

    return (
        <div className={`InputField-${idSplit}`}>
            <label id={props.labelId} htmlFor={props.inputId}>{props.label}</label>
            <input type={props.inputType} id={props.inputId} ref={ref} className={!error ? '' : 'error'} />
            {!error ? '' : <h5 id="error-message">{error.msg}</h5>}
        </div>
    )
})

export default InputField;