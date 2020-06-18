// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactElement } from "react";

import Container from "react-bootstrap/Container";

const Success = (): ReactElement => {
  return (
    <Container className="p-5">
      <h1>
        Thanks, you should get an email in a bit confirming your postcards have
        been sent
      </h1>
      If you don't in like ... 15 minutes? email me at{" "}
      <a href="mailto:mail-your-rep@blackmad.com">mail-your-rep@blackmad.com</a>
    </Container>
  );
};

export default Success;
