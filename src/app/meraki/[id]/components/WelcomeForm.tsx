import { Checkbox, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Input } from "@/Components/Input/Input";
import { FormData } from "../interfaces";
import { inputs } from "../data";
import { StyledButton } from "./StyledComponents";

interface WelcomeFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  handleSendEmail: () => void;
}

export const WelcomeForm = ({ 
  formData, 
  handleChange, 
  acceptedTerms, 
  setAcceptedTerms, 
  handleSendEmail 
}: WelcomeFormProps) => (
  <>
    <Typography fontSize="1.3rem" fontWeight="bold" color="#fff">
      Te damos la bienvenida
    </Typography>
    {inputs.map((input, index) => (
      <Input
        key={index}
        handleChange={handleChange}
        label={input.label}
        type={input.type}
        placeholder={input?.placeholder}
        value={formData[input.label].value}
        sx={{
          backgroundColor: "white",
          color: "black",
          width: { md: "400px", xs: "300px" },
        }}
      />
    ))}
    <Stack direction="row" alignItems="center" spacing={1}>
      <Checkbox
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        sx={{
          color: "grey",
          "&.Mui-checked": {
            color: "white",
          },
        }}
      />
      <Link href="https://www.ciscocolombia.co/pages/politica-de-privacidad" passHref>
        <Typography
          sx={{
            color: "#fff",
            textDecoration: "none",
            "&:hover": {
              color: "#2",
            },
          }}
        >
          Acepto términos y condiciones descritos en este enlace
        </Typography>
      </Link>
    </Stack>
    <StyledButton onClick={handleSendEmail} variant="contained" fullWidth>
      Conectarme!
    </StyledButton>
  </>
); 