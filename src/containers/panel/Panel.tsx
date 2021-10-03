import React, { ReactNode } from 'react';
import './Panel.css';

export default function Panel({ children }: { children: ReactNode }) {
    return (
        <div id="panel">
            <div id="panel-container">
                {children}
            </div>
        </div>
    );
}