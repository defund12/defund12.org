import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";
import { DefundUtils } from "../../DefundUtils";
import { FooterProps } from "../../types/PropTypes";
import styled from "@emotion/styled";

/**
 * The site footer, containing issue request and contact information.
 *
 * _This is meant to be internal to this file and should
 * probably not be exported._
 */
class _Footer extends React.Component<FooterProps> {
  /**
   * Initialize the component.
   * @param {FooterProps} props
   */
  constructor(props: FooterProps) {
    super(props);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const isLetterPage = url.includes("/letters");

    return (
      <>
        <StickyAside>
          <div className="sticky-container">
            <span className="city-request-link">
              <span className="emojicon emojicon-city"></span>
              <span
                className="react-inserted"
                dangerouslySetInnerHTML={{
                  __html: DefundUtils.markdownToHTML(this.props.footerTextPr),
                }}
              />
            </span>
            {isLetterPage ? (
              <span className="email-link">
                <span className="emojicon">📧</span>
                <Link to="/">Send an email</Link>
              </span>
            ) : (
              <span className="snail-mail-link">
                <span className="emojicon">📬</span>
                <Link to="/letters">Send a letter</Link>
                <span className="beta-bubble">BETA</span>
              </span>
            )}
          </div>
        </StickyAside>
        <StyledFooter>
          {/* TODO: determine if this is something we want to keep around
            <span
            className="react-inserted"
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(
                this.props.footerTextInstructions
              ),
            }}
          ></span> */}
          <span
            className="divider footer react-inserted"
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(this.props.contactEmailFooter),
            }}
          ></span>
        </StyledFooter>
      </>
    );
  }
}

/**
 * The site footer, containing issue request and contact information.
 * @return {React.ReactNode}
 */
export default function Footer(): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query FooterQuery {
          siteConfig {
            footerTextPr
            footerTextInstructions
            contactEmailFooter
          }
        }
      `}
      render={(data: { siteConfig: FooterProps }) => (
        <_Footer {...data.siteConfig} />
      )}
    />
  );
}

const StickyAside = styled.aside`
  display: flex;
  position: sticky;
  justify-content: center;
  bottom: 0;
  width: 100vw;
  padding: var(--x1) 0 var(--x2);
  box-shadow: 0 -8px 8px 2px var(--bg);
  background-color: var(--bg);

  .sticky-container {
    display: flex;
    flex-direction: column;
    width: calc(100vw - var(--x8));
    max-width: var(--m);
  }

  .city-request-link {
    display: flex;
  }

  p {
    margin-bottom: 0;
  }

  .beta-bubble {
    background: var(--beta);
    border-radius: var(--x1);
    padding: 2px 5px;
    margin: 0 var(--x1);
    font-weight: bold;
    font-size: 12px;
    color: var(--beta-text);
  }

  .emojicon {
    padding: 0 var(--x1) 0 0;
    font-size: 20px;
    &-city {
      &:after {
        display: inline;
        content: var(--emojicon-city);
      }
    }
  }
`;

const StyledFooter = styled.footer`
  margin-bottom: var(--x4);
  p {
    width: calc(100vw - var(--x8));
    max-width: var(--m);

    &:nth-of-type(3) {
      margin-bottom: var(--x4);
    }
  }
`;
