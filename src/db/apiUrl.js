import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function getUrl({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function getLongUrl(id) {
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id}, custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

export async function createUrl(
  { title, longUrl, customUrl, short_url, user_id },
  qrcode
) {
  const fileName = `qr-${short_url}`;

  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr_code = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr_code,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function updateUrl({ title, longUrl, user_id, id }) {
  const { data, error } = await supabase
    .from("urls")
    .update(
      {
        title,
        original_url: longUrl,
      }
      // {
      //   count: "exact",
      // }
    )
    .eq("id", id)
    .eq("user_id", user_id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id)
    .select("id, short_url")
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message || "Unable to delete Url");
  }

  const fileName = `qr-${data.short_url}`;

  const { error: storageError } = await supabase.storage
    .from("qr")
    .remove([fileName]);

  if (storageError) {
    console.error(storageError);
    throw new Error(storageError.message || "Unable to delete Url");
  }

  return data;
}
