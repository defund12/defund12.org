import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default class Layout extends React.Component {
    render() {
        return (
            <>
                <Header />
                <div className="content">
                    <div className="container">
                        {this.props.children}
                        <Footer />
                    </div>
                </div>
            </>
        );
    }
}