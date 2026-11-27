// app/api/prescription/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminGraphQL } from "@/lib/shopifyAdmin";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

/* File ke pehle bytes se asli type pehchano (sirf naam/type pe bharosa nahi) */
function sniffType(buffer) {
  const b = buffer;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf";
  return null;
}

const STAGED = `
mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets {
      url
      resourceUrl
      parameters { name value }
    }
    userErrors { field message }
  }
}`;

const FILE_CREATE = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files { id fileStatus }
    userErrors { field message }
  }
}`;

const FILE_STATUS = `
query fileStatus($id: ID!) {
  node(id: $id) {
    ... on MediaImage { fileStatus image { url } }
    ... on GenericFile { fileStatus url }
  }
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = sniffType(buffer);

    if (!mimeType || !TYPES[mimeType]) {
      return NextResponse.json(
        { error: "Only JPG, PNG or PDF files are allowed." },
        { status: 400 }
      );
    }

    const isImage = mimeType !== "application/pdf";

    // Random naam: koi personal info nahi, link guess karna mushkil
    const filename = `rx-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${TYPES[mimeType]}`;

    /* 1) Shopify se upload ki jagah maango */
    const staged = await adminGraphQL(STAGED, {
      input: [
        {
          filename,
          mimeType,
          httpMethod: "POST",
          resource: isImage ? "IMAGE" : "FILE",
        },
      ],
    });

    const stagedErrors = staged.stagedUploadsCreate?.userErrors || [];
    const target = staged.stagedUploadsCreate?.stagedTargets?.[0];

    if (stagedErrors.length || !target) {
      console.error("stagedUploadsCreate:", JSON.stringify(stagedErrors));
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    /* 2) File wahan upload karo (parameters pehle, file sabse aakhir me) */
    const uploadForm = new FormData();
    target.parameters.forEach((p) => uploadForm.append(p.name, p.value));
    uploadForm.append("file", new Blob([buffer], { type: mimeType }), filename);

    const uploadRes = await fetch(target.url, { method: "POST", body: uploadForm });

    if (!uploadRes.ok) {
      console.error("Staged upload failed:", uploadRes.status, await uploadRes.text());
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    /* 3) Shopify Files me register karo */
    const created = await adminGraphQL(FILE_CREATE, {
      files: [
        {
          originalSource: target.resourceUrl,
          contentType: isImage ? "IMAGE" : "FILE",
          filename,
          alt: "Contact lens prescription",
        },
      ],
    });

    const createErrors = created.fileCreate?.userErrors || [];
    const fileId = created.fileCreate?.files?.[0]?.id;

    if (createErrors.length || !fileId) {
      console.error("fileCreate:", JSON.stringify(createErrors));
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    /* 4) File ready hone tak ruko, phir CDN link lo */
    let url = null;

    for (let i = 0; i < 12; i++) {
      await sleep(800);

      const status = await adminGraphQL(FILE_STATUS, { id: fileId });
      const node = status.node;
      const state = node?.fileStatus;

      if (state === "FAILED") {
        return NextResponse.json({ error: "File processing failed" }, { status: 500 });
      }

      if (state === "READY") {
        url = node.image?.url || node.url || null;
        if (url) break;
      }
    }

    if (!url) {
      return NextResponse.json(
        { error: "File is still processing. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json({ url, fileId, filename });
  } catch (error) {
    console.error("Prescription route crashed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}