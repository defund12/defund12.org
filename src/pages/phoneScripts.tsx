import React from "react";
import { PageProps } from "gatsby";
import Layout from "../components/common/Layout";
import { SiteProps } from "../types/PropTypes";
import PhoneList from "../components/template-list/PhoneList";

/**
 * Contains another list just like the homepage, this time with call scripts.
 */
export default class PhoneScripts extends React.Component<
  PageProps<SiteProps>
> {
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
        <PhoneList />
      </Layout>
    );
  }
}
