import React, {useState} from 'react';

function MyComponent() {
    const [istrue, setIstrue] = useState(false)
    const divStyle = {
        backgroundColor: istrue ? '#00C538' : '#C50009',
        width: '18px',
        height: '18px',
        borderRadius:'50%'
    };

    return (
        <div style={divStyle}>
            {/* Контент компонента */}
        </div>
    );
}

export default MyComponent