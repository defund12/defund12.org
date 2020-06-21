import React from "react";
import { PageProps } from "gatsby";
import Layout from "../components/common/Layout";
import TemplateList from "../components/template-list/TemplateList";
import { SiteProps } from "../types/PropTypes";

/**
 * Contains a list just like the homepage, but with letters.
 */
export default class Letters extends React.Component<PageProps<SiteProps>> {
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
        <TemplateList layout="letter" />
      </Layout>
    );
  }
}
