import { NextResponse } from "next/server";
import Unifi from "node-unifi";

// Create controller
export async function POST(req: Request) {
  try {
    // Get data
    const formData = await req.formData();
    const id = formData.get("id");
    const ap = formData.get("ap");
    const site = formData.get("site");

    const unifi = new Unifi.Controller({
      host: "161.18.232.231",
      port: "8443",
      username: "iris",
      password: "Iris2024*",
      sslverify: false,
      site,
    });

    const loginData = await unifi.login("iris", "Iris2024*");
    console.log(unifi.opts.site);
    console.log("🚀 ~ app.post ~ loginData:", loginData);
    const algo = await unifi.authorizeGuest(id, 2, null, null, null, ap);
    console.log("🚀 ~ POST ~ algo:", algo);

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mensaje Satisfactorio</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  background-color: #f5f5f5;
              }
              .message {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h2 {
                  color: #007bff;
              }
          </style>
      </head>
      <body>
          <div class="message">
              <h2>¡Inicio de Sesión Exitoso!</h2>
              <p>Has iniciado sesión correctamente en nuestra página.</p>
          </div>
      </body>
      </html>
      `,
      { status: 200, headers: { "content-type": "text/html" } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
