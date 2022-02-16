// netlify serverless function to send sms
exports.handler = async (event, context) => {
  const { phone, message } = JSON.parse(event.body);
  console.log("phone", phone);
  let statusCode = 200;
  let data = null;
  try {
    data = await sendSMS(phone, message);
  } catch (error) {
    statusCode = 500;
    data = error;
  }

  return {
    statusCode,
    body: JSON.stringify({ message: data }),
  };
};

// send sms via api request
const sendSMS = async (phoneNumber, message, sender = "Lavi is 13") => {
  console.log("send sms", phoneNumber, message, sender);

  const smsXml = `<?xml version='1.0' encoding='UTF-8'?>
                  <sms>
                  <user>
                  <username>${process.env.SMS_USER}</username>
                  <password>${process.env.SMS_PASS}</password>
                  </user>
                  <source>${sender}</source>
                  <destinations>
                  <phone id='someid1'>${phoneNumber}</phone>
                  </destinations>
                  <message>${message}</message>
                  </sms>`;

  try {
    const res = await fetch("https://my.textme.co.il/api", {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/xml",
      },
      body: smsXml,
    });

    console.log("res", res);
  } catch (error) {
    if (error) throw new Error(error);
  }
};
