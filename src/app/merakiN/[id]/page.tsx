"use client";
import React from "react";
import { Params } from "./interfaces";
import { PortalCautive } from "./PortalCautiveView";
import { useMerakiAuth } from "./hooks/useMerakiAuth";

const PortalCautiveView: React.FC<Params> = ({ params }) => {
  const {
    formData,
    handleChange,
    handleChangeSelect,
    acceptedTerms,
    setAcceptedTerms,
    sendForm,
    isError,
  } = useMerakiAuth(params.id);

  if (isError) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h1>Error de Conexión</h1>
        <p>No se pudo conectar al portal. Por favor, intente de nuevo.</p>
      </div>
    );
  }

  return (
    <PortalCautive
      formData={formData}
      handleChange={handleChange}
      handleChangeSelect={handleChangeSelect}
      acceptedTerms={acceptedTerms}
      setAcceptedTerms={setAcceptedTerms}
      sendForm={sendForm}
    />
  );
};

export default PortalCautiveView; 