import React from 'react';
import { graphql, StaticQuery } from 'gatsby';

interface HeaderProps {
    title: string;
    subtitle: string;
}

class _Header extends React.Component<HeaderProps> {
    render() {
        return (
            <header>
                <div className="container">
                    <a href="/">
                        <h1 aria-label="Defund Twelve .org" className="pagetitle">{ this.props.title }</h1>
                    </a>
                    <p className="divider">{ this.props.subtitle }</p>
                    <p aria-label="12 = Police"><i>"12" = </i>🚓</p>
                </div>
            </header>
        );
    }
}

export default function Header() {
    return (
        <StaticQuery query={graphql`
            query HeaderQuery {
                yaml {
                    title
                    subtitle
                }
            }
        `} 
        render={(data: any) =>
            <_Header title={data.yaml.title} subtitle={data.yaml.subtitle}></_Header>
        }/>
    );
}
