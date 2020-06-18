import React from "react";
import { PageProps } from "gatsby";
import Layout from "../components/common/Layout";
import EmailList from "../components/email-list/EmailList";
import { SiteProps } from "../types/PropTypes";

/**
 * The landing/home/root page. Defund 12!
 */
export default class Index extends React.Component<PageProps<SiteProps>> {
  /**
   * Initialize the component.
   * @param {PageProps<SiteProps>} props
   */
  constructor(props: PageProps<SiteProps>) {
    super(props);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <Layout>
        <EmailList />
      </Layout>
    );
  }
}
