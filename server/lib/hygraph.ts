import { requireHygraphConfig } from "./env";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

type CreateAssetResponse = {
  data?: {
    createAsset?: {
      id?: string;
      url?: string;
      fileName?: string;
      mimeType?: string;
      upload?: {
        requestPostData?: {
          url?: string;
          date?: string;
          key?: string;
          signature?: string;
          algorithm?: string;
          policy?: string;
          credential?: string;
          securityToken?: string | null;
        };
      };
    };
  };
  errors?: Array<{ message?: string }>;
};

/**
 * Upload an image to Hygraph via Management API (createAsset + pre-signed POST).
 * Credentials never leave the server.
 */
export async function uploadImageToHygraph(input: {
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
}): Promise<{
  assetId: string;
  url: string;
  fileName: string;
  mimeType: string | null;
}> {
  const { endpoint, token } = requireHygraphConfig();

  if (!isAllowedImageMime(input.mimeType)) {
    throw new Error("Unsupported image type");
  }
  if (input.bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds 5MB limit");
  }

  const mutation = `
    mutation CreateAsset($fileName: String!) {
      createAsset(data: { fileName: $fileName }) {
        id
        url
        fileName
        mimeType
        upload {
          requestPostData {
            url
            date
            key
            signature
            algorithm
            policy
            credential
            securityToken
          }
        }
      }
    }
  `;

  const createRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { fileName: input.fileName },
    }),
  });

  if (!createRes.ok) {
    throw new Error("Hygraph createAsset request failed");
  }

  const created = (await createRes.json()) as CreateAssetResponse;
  if (created.errors?.length) {
    throw new Error(created.errors[0]?.message || "Hygraph createAsset error");
  }

  const asset = created.data?.createAsset;
  const post = asset?.upload?.requestPostData;
  if (!asset?.id || !post?.url) {
    throw new Error("Hygraph did not return upload credentials");
  }

  const form = new FormData();
  if (post.date) form.append("X-Amz-Date", post.date);
  if (post.key) form.append("key", post.key);
  if (post.signature) form.append("X-Amz-Signature", post.signature);
  if (post.algorithm) form.append("X-Amz-Algorithm", post.algorithm);
  if (post.policy) form.append("policy", post.policy);
  if (post.credential) form.append("X-Amz-Credential", post.credential);
  if (post.securityToken) {
    form.append("X-Amz-Security-Token", post.securityToken);
  }

  // file must be last per Hygraph docs
  form.append(
    "file",
    new Blob([input.bytes], { type: input.mimeType }),
    input.fileName
  );

  const uploadRes = await fetch(post.url, {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    throw new Error("Hygraph file upload failed");
  }

  // Re-fetch asset URL after upload completes (create may return empty url while pending).
  let publicUrl = asset.url?.trim() || "";
  if (!publicUrl) {
    publicUrl = await fetchAssetUrl(endpoint, token, asset.id);
  }

  if (!publicUrl) {
    throw new Error("Hygraph asset URL unavailable after upload");
  }

  return {
    assetId: asset.id,
    url: publicUrl,
    fileName: asset.fileName || input.fileName,
    mimeType: asset.mimeType || input.mimeType,
  };
}

async function fetchAssetUrl(
  endpoint: string,
  token: string,
  id: string
): Promise<string> {
  const query = `
    query AssetUrl($id: ID!) {
      asset(where: { id: $id }) {
        id
        url
      }
    }
  `;

  // Brief retry — asset may still be ASSET_CREATE_PENDING.
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { id } }),
    });

    if (!res.ok) continue;
    const json = (await res.json()) as {
      data?: { asset?: { url?: string } };
    };
    const url = json.data?.asset?.url?.trim();
    if (url) return url;
  }

  return "";
}
