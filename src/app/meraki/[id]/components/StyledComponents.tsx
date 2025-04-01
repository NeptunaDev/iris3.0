import { Button, Stack, styled } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

export const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
  gap: 30px;
  max-width: 600px;
  margin-inline: auto;
  .MuiOtpInput-TextField {
    background-color: white;
  }
`;

export const StyledStack = styled(Stack)`
  background-image: url(/velezdesktop.jpg);
  background-position: center;
  height: 100vh;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  align-items: flex-end;
  @media (max-width: 600px) {
    background-image: url(/velezresponsive.jpg);
  }
`;

export const ContentStack = styled(Stack)`
  width: 40%;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 1rem;
  @media (max-width: 600px) {
    width: 90%;
    margin-top: 7rem;
  }
`;

export const StyledButton = styled(Button)`
  background-color: #4D4D4D !important;
  color: #fff;
  padding: 8px 16px;
  width: 200px;
  text-transform: none;
`; 