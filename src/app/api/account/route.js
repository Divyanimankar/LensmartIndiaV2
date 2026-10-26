import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerQuery, emailFromIdToken } from "@/lib/shopify-account";

const GET_QUERY = `
query {
  customer {
    firstName
    lastName
    phoneNumber { phoneNumber }
    emailAddress { emailAddress }
    defaultAddress { id }
    addresses(first: 20) {
      nodes { id firstName lastName phoneNumber address1 address2 city zoneCode zip territoryCode }
    }
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
      nodes {
        id name processedAt financialStatus
        fulfillments(first: 1) { nodes { status } }
        totalPrice { amount currencyCode }
        lineItems(first: 5) { nodes { title quantity image { url } } }
      }
    }
  }
}`;

const noStore = { headers: { "Cache-Control": "no-store" } };

async function getToken() {
  const store = await cookies();
  return {
    token: store.get("sh_access")?.value,
    idToken: store.get("sh_id_token")?.value,
  };
}

export async function GET() {
  const { token, idToken } = await getToken();
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const res = await customerQuery(token, GET_QUERY);
  if (res.unauthorized || !res.data?.customer) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const c = res.data.customer;
  return NextResponse.json(
    {
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      // Email of the logged-in user (from Shopify, fallback to id token)
      email: c.emailAddress?.emailAddress || emailFromIdToken(idToken || ""),
      phone: c.phoneNumber?.phoneNumber || "",
      defaultAddressId: c.defaultAddress?.id || null,
      addresses: c.addresses?.nodes || [],
      orders: (c.orders?.nodes || []).map((o) => ({
        id: o.id,
        name: o.name,
        date: o.processedAt,
        payment: o.financialStatus,
        fulfillment: o.fulfillments?.nodes?.[0]?.status || "UNFULFILLED",
        total: o.totalPrice,
        items: o.lineItems?.nodes || [],
      })),
    },
    noStore
  );
}

const MUTATIONS = {
  updateProfile: `mutation($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) { userErrors { message } }
  }`,
  addAddress: `mutation($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { userErrors { message } }
  }`,
  updateAddress: `mutation($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { userErrors { message } }
  }`,
  deleteAddress: `mutation($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) { userErrors { message } }
  }`,
};

const clean = (v, max = 100) => String(v ?? "").trim().slice(0, max);

function validateAddress(a) {
  if (!/^[A-Za-z .'-]{2,}$/.test(a.firstName)) return "Enter a valid first name";
  if (!/^[6-9]\d{9}$/.test(a.phoneNumber.replace(/^\+91/, ""))) return "Enter a valid 10-digit mobile number";
  if (a.address1.length < 5) return "Enter your full address";
  if (a.city.length < 2) return "Enter a city";
  if (!a.zoneCode) return "Select a state";
  if (!/^\d{6}$/.test(a.zip)) return "Enter a valid 6-digit PIN code";
  return null;
}

export async function POST(req) {
  const { token } = await getToken();
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action } = body;
  if (!MUTATIONS[action]) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  let variables;

  if (action === "updateProfile") {
    const firstName = clean(body.firstName, 50);
    const lastName = clean(body.lastName, 50);
    if (!/^[A-Za-z .'-]{2,}$/.test(firstName)) {
      return NextResponse.json({ error: "Enter a valid first name" }, { status: 400 });
    }
    if (lastName && !/^[A-Za-z .'-]+$/.test(lastName)) {
      return NextResponse.json({ error: "Enter a valid last name" }, { status: 400 });
    }
    variables = { input: { firstName, lastName } };
  } else if (action === "deleteAddress") {
    variables = { addressId: body.addressId };
  } else {
    const a = body.address || {};
    const address = {
      firstName: clean(a.firstName, 50),
      lastName: clean(a.lastName, 50),
      phoneNumber: clean(a.phoneNumber, 15),
      address1: clean(a.address1, 150),
      address2: clean(a.address2, 150),
      city: clean(a.city, 60),
      zoneCode: clean(a.zoneCode, 5),
      zip: clean(a.zip, 6),
      territoryCode: "IN",
    };
    const err = validateAddress(address);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    address.phoneNumber = "+91" + address.phoneNumber.replace(/^\+91/, "");
    variables = { address, defaultAddress: !!body.makeDefault };
    if (action === "updateAddress") variables.addressId = body.addressId;
  }

  const res = await customerQuery(token, MUTATIONS[action], variables);
  if (res.unauthorized) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = res.data && Object.values(res.data)[0];
  const msg = payload?.userErrors?.[0]?.message || res.errors?.[0]?.message;
  if (msg) return NextResponse.json({ error: msg }, { status: 400 });

  return NextResponse.json({ ok: true });
}