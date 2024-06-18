import { NextResponse } from "next/server";
import Unifi from "node-unifi";

import connectDB from "@/configuration/db";
import SiteModel from "@/models/Site.models";
import { decryptText } from "@/utils/crypto/crypto";

connectDB();
// Create controller
export async function POST(req: Request) {
  try {
    // Get data
    const { id, ap, idSite, site: siteId } = await req.json();

    // Site
    const site = await SiteModel.findById(idSite);

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    const passwordEncrypted = decryptText(site.password);

    const unifi = new Unifi.Controller({
      host: site.host,
      port: site.port,
      username: site.username,
      password: passwordEncrypted,
      sslverify: site.sslverify,
      site: siteId,
    });

    const loginData = await unifi.login("iris", "Iris2024*");
    console.log(unifi.opts.site);
    console.log("🚀 ~ app.post ~ loginData:", loginData);
    const algo = await unifi.authorizeGuest(
      id,
      60 * 24 * 30,
      null,
      null,
      null,
      ap
    );
    console.log("🚀 ~ POST ~ algo:", algo);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
