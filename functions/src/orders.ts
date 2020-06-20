import { orderCollection } from "./database";
import { Order, Address } from "./types";

import { TestLob, ProdLob, sgMail } from "./apis";

export const notifyUser = (email: string, lobResponses: any) => {
  const responseSummaries = lobResponses
    .map((lobResponse: any) => {
      return `Sent to: ${lobResponse.to.name}
Expected Delivery: ${lobResponse.expected_delivery_date}
Preview: ${lobResponse.url}`;
    })
    .join("\n\n");

  const body = `You sent some letters!\n\n${responseSummaries}`;

  const msg = {
    to: email,
    from: "defund12@blackmad.com",
    subject: "Letters Sent!",
    text: body,
  };
  console.log("sending this email", msg);
  sgMail.send(msg).catch((err: any) => {
    console.dir(err, { depth: 10 });
    throw err;
  });
};

export const notifyUserAboutAlmostDelivered = (lobResponse: any) => {
  if (lobResponse.event_type.id !== 'letter.processed_for_delivery') {
    return;
  }
  const sendDate = lobResponse.date_created.substring(0, 10);

  const body = `Your defund12 letter has almost arrived.
  
A letter that you sent on ${sendDate} 
is about one day away from arriving at the office of ${lobResponse.body.to.name} in ${
    lobResponse.body.to.address_city
  }. If you don't remember what your letter looks like, it looks like ${lobResponse.body.url}


Because it's a first class letter, we don't know exactly when it arrives at their door. For more information about that, see https://support.lob.com/hc/en-us/articles/115000097404-Can-I-track-my-mail-

`;

  const htmlBody = `Your defund12 letter has almost arrived.
<br><br>  
A <a href="${lobResponse.body.url}">letter</a> that you sent on ${sendDate} 
is about one day away from arriving at the office of ${lobResponse.body.to.name} in ${lobResponse.body.to.address_city}.
<br><br>
Because it's a first class letter, we don't know <a href="https://support.lob.com/hc/en-us/articles/115000097404-Can-I-track-my-mail-">exactly</a> when it arrives at their door, but we do know that it's in the area and should be delivered by tomorrow.

`;

  const msg = {
    to: lobResponse.body.from.email,
    from: "defund12@blackmad.com",
    subject: "Letters Sent!",
    text: body,
    html: htmlBody,
  };
  console.log("sending this email", msg);
  sgMail.send(msg).catch((err: any) => {
    console.dir(err, { depth: 10 });
    throw err;
  });
};

const makeLetter = ({
  toAddress,
  fromAddress,
  body,
  email,
  isTest,
}: {
  toAddress: Address;
  fromAddress: Address;
  body: string;
  email: string;
  isTest: boolean;
}): string => {
  const formattedBody = body.replace(/\n/g, "<br/>");

  const options1 = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const date1 = new Date();

  const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options1);
  const formattedDate = dateTimeFormat3.format(date1);

  return `t
<html>
<head>
<meta charset="UTF-8">
<link href='https://fonts.googleapis.com/css?family=Open+Sans:400' rel='stylesheet' type='text/css'>
<title>Lob.com Outstanding Balance Letter Template</title>
<style>
  @font-face {
    font-family: 'Loved by the King';
    font-style: normal;
    font-weight: 400;
    src: url('https://s3-us-west-2.amazonaws.com/public.lob.com/fonts/lovedByTheKing/LovedbytheKing.ttf') format('truetype');
  }

  *, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  body {
    width: 8.5in;
    height: 11in;
    margin: 0;
    padding: 0;
    font-family: 'Open Sans';
  }

  .page {
    page-break-after: always;
  }

  .page-content {
    position: relative;
    width: 7in;
    height: 10.625in;
    left: 0.75in;
    top: 0.1875in;
  }

  #logo {
    position: absolute;
    right: 0;
  }

  .wrapper {
    position: absolute;
    top: 2.75in;
  }

  .signature {
    font-family: 'Loved by the King';
    font-size: 45px;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="page-content">
      <!-- Your logo here! -->

      <div class='wrapper'>
        ${isTest ? "<h1>TEST TEST TEST TEST TEST</h1>" : ""}
        <p>${formattedDate}</p>

        <p>Dear ${toAddress.name},</p>

        ${formattedBody.replace(/\n\n/g, "<br/>").replace(/\n/g, "<br/>")}

        <p>Thank you,<br/>
        <span class="signature">${fromAddress.name}</span></p>

        <p>
          ${fromAddress.name}<br/>
          <!--${fromAddress.address_line1}, ${fromAddress.address_city}, ${
    fromAddress.address_state
  } ${fromAddress.address_zip}<br/>-->
          ${email}
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export const markOrderPaid = async (orderId: string) => {
  console.log("marking order paid", orderId);
  const docs = await orderCollection.where("orderId", "==", orderId).get();
  if (docs.empty) {
    throw new Error("no order with id " + orderId);
  }

  const order = docs.docs[0];

  const orderPromise = order.ref.update({ paid: true });
  return orderPromise;
};

export const executeOrderId = async (orderId: string) => {
  const docs = await orderCollection.where("orderId", "==", orderId).get();
  if (docs.empty) {
    throw new Error("no order with id " + orderId);
  }

  const order = docs.docs[0];
  const orderData: Order = order.data() as Order;
  return executeOrder(orderData);
};

export const executeOrder = async (orderData: Order): Promise<any> => {
  if (!orderData || !orderData.toAddresses || !orderData.body) {
    throw new Error("no order with id ");
  }

  const Lob = orderData.isTest ? TestLob : ProdLob;

  const lobPromises = orderData.toAddresses.map((toAddress: Address) => {
    return new Promise((resolve, reject) => {
      Lob.letters.create(
        {
          description: "Demo Letter",
          to: toAddress,
          from: orderData.fromAddress,
          file: makeLetter({
            email: orderData.email,
            toAddress,
            fromAddress: orderData.fromAddress,
            body: orderData.body,
            isTest: orderData.isTest,
          }),
          color: false,
        },
        (err: any, body: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        }
      );
    });
  });

  await orderCollection.doc(orderData.orderId).update({ fulfilled: true });
  const lobResponses = await Promise.all([...lobPromises]);
  notifyUser(orderData.email, lobResponses);
  // console.log(lobResponses);
  return lobResponses;
};
