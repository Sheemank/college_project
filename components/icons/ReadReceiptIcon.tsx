import React from 'react';

const ReadReceiptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
        <title>Message read</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 12.75 6 6 9-13.5" opacity="0.7" />
    </svg>
);

export default ReadReceiptIcon;