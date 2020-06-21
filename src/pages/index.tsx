import React from "react";
import { PageProps } from "gatsby";
import Layout from "../components/common/Layout";
import TemplateList from "../components/template-list/TemplateList";
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
        <TemplateList layout="email" />
      </Layout>
    );
  }
}
