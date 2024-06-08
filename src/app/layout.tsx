import connectDB from "@/configuration/db";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  connectDB();

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
