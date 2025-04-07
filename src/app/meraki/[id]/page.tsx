"use client";

import { Params } from "./interfaces";
import { WelcomeForm } from "./components/WelcomeForm";
import { VerificationForm } from "./components/VerificationForm";
import { StyledStack, ContentStack } from "./components/StyledComponents";
import { useMerakiAuth } from "./hooks/useMerakiAuth";

export default function Page({ params }: Params) {
  const {
    formData,
    handleChange,
    acceptedTerms,
    setAcceptedTerms,
    showVerificationForm,
    otp,
    handleChangeOtp,
    handleSendEmail,
    handleVerifyCode,
  } = useMerakiAuth(params.id);

  return (
    <StyledStack>
      <ContentStack>
        {!showVerificationForm ? (
          <WelcomeForm
            formData={formData}
            handleChange={handleChange}
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
            handleSendEmail={handleSendEmail}
          />
        ) : (
          <VerificationForm
            otp={otp}
            handleChangeOtp={handleChangeOtp}
            handleVerifyCode={handleVerifyCode}
          />
        )}
      </ContentStack>
    </StyledStack>
  );
}
