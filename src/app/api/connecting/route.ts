import { NextResponse } from "next/server";
// @ts-ignore
import Unifi from "node-unifi";


// Create controller
export async function POST(req: Request) {
  try {
    // Get data
    const { id, ap, site } = await req.json()

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
    const algo = await unifi.authorizeGuest(id, 60*24*30, null, null, null, ap);
    console.log("🚀 ~ POST ~ algo:", algo);

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
