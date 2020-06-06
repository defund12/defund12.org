import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export class Header extends React.Component<HeaderProps> {
    render() {
        return (
            <header>
                <div className="container">
                    <a href="/">
                        <h1 className="pagetitle">{this.props.title}</h1>
                    </a>
                    <p className="divider">{this.props.subtitle}</p>
                    <p aria-label="12 = Police"><i>"12" = </i>🚓</p>
                </div>
            </header>
        );
    }
}