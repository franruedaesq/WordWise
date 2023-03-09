import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';

const LoaderComponent: React.FC = () => (
    <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
    >
        <InfinitySpin
            width='200'
            color="#4fa94d"
        />
    </div>

);

export default LoaderComponent;
