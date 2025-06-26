// app/utils/utils.tsx
import * as ImagePicker from "expo-image-picker";

type UploadParams = {
  idToken: string;
  backendUrl: string;
};

export async function handlePhotoUpload({
  idToken,
  backendUrl,
}: UploadParams): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    const uri = asset.uri;
    const fileExt = uri.split(".").pop()?.toLowerCase();
    const mimeType =
      fileExt === "png"
        ? "image/png"
        : fileExt === "webp"
        ? "image/webp"
        : "image/jpeg";

    const response = await fetch(
      `${backendUrl}/v1/user/profile/image/upload-url?mimeType=${mimeType}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    const { uploadUrl } = await response.json();
    const imageBlob = await (await fetch(uri)).blob();

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: imageBlob,
    });

    if (!uploadResponse.ok) throw new Error("Upload failed");

    return uri;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
}

export function getMimeTypeFromUri(uri: string): string {
  if (!uri || typeof uri !== "string") return "image/jpeg";
  const ext = uri.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "heic":
      return "image/heic";
    default:
      return "image/jpeg";
  }
}
