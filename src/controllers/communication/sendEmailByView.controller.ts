import ViewModel from "@/models/View.model";
import { NextResponse } from "next/server";
import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { BREVO_API_KEY } from "@/configuration/config";

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendEmail = async (body: any) => {
  try {
    const { id_view, template, email } = body;
    const code = generateCode();
    const viewUpdate = await ViewModel.findByIdAndUpdate(
      id_view,
      { code },
      { new: true }
    );

    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "Codigo de verificación";
    sendSmtpEmail.to = [{ email, name: "User" }];
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Code: ${code}</h1>
          <p>Use this code to verify your account</p>
          <button>Verify</button>
          <a href="http://localhost:3000/verify/${code}">Verify</a>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { "name": "iris", "email": "jcardona@netmask.co" };

    const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("🚀 ~ sendEmail ~ res:", res);

    return NextResponse.json(
      {
        message: "Email sent",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};
