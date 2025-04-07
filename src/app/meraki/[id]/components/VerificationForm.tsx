import { Stack, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { StyledButton, MuiOtpInputStyled } from "./StyledComponents";

interface VerificationFormProps {
  otp: string;
  handleChangeOtp: (otp: string) => void;
  handleVerifyCode: () => void;
}

export const VerificationForm = ({
  otp,
  handleChangeOtp,
  handleVerifyCode
}: VerificationFormProps) => (
  <>
    <Typography fontSize="1.3rem" fontWeight="bold" color="#fff">
      Introduce tu código de verificación
    </Typography>
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "center",
        gap: "10px",
        color: "red",
      }}
    >
      <MuiOtpInputStyled
        value={otp}
        onChange={handleChangeOtp}
        length={6}
      />
    </Stack>
    <StyledButton onClick={handleVerifyCode} variant="contained" fullWidth>
      Verificar
    </StyledButton>
  </>
); 