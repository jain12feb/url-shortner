import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

// export async function getClicks() {
//   let {data, error} = await supabase.from("clicks").select("*");

//   if (error) {
//     console.error(error);
//     throw new Error("Unable to load Stats");
//   }

//   return data;
// }

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const result = parser.getResult();
    console.log("ua result", result);
    const {
      browser: { bName, bVersion },
      cpu: { architecture },
      device: { model, type },
      engine: { eName, eVersion },
      os: { osName, osVersion },
      ua,
    } = result;
    // const device = result.device.type || "desktop"; // Default to desktop if type is not detected

    const response = await fetch("https://ipapi.co/json");
    const {
      city,
      country_name: country,
      ip,
      latitude,
      longitude,
    } = await response.json();

    // Record the click
    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device_type: type || "desktop",
      ip_address: ip,
      latitude,
      longitude,
      browser: bName + " " + bVersion || null,
      os: osName + " " + osVersion || null,
      device_model: model || null,
    });

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
