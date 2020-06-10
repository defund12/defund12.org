import React from 'react';

interface FooterProps {
    footerText: string;
}

const footerTextRegex: RegExp = /(?<text>.*)\[(?<linkText>.*)\]\((?<href>.*)\)/;

export class Footer extends React.Component<FooterProps> {
    text: string;
    linkText: string;
    href: string;
    constructor(props: FooterProps) {
        super(props);
        [this.text, this.linkText, this.href] = this.parseFooterText(this.props.footerText);
    }


    parseFooterText(footerText: string): [string, string, string] {
        const captures = footerTextRegex.exec(footerText);
        if (captures != null && captures.groups !== undefined) {
            const text = captures.groups['text'];
            const linkText = captures.groups['linkText'];
            const href = captures.groups['href'];
            return [text, linkText, href];
        };
        throw new Error('Could not parse footer.');
    }

    render() {
        return (
            <p className="divider footer">{this.text} <a href="{this.href}">{this.linkText}</a></p>
        );
    }
}