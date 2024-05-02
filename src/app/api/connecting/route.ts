import { NextResponse } from "next/server";
import Unifi from "node-unifi";

// Create controller
export async function POST(req: Request) {
  try {
    // Get data
    const formData = await req.formData()
    const id = formData.get('id')
    const ap = formData.get('ap')
    const site = formData.get('site')

    const unifi = new Unifi.Controller({
      host: "10.1.5.2",
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

    return NextResponse.json({ message: 'error.message' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
