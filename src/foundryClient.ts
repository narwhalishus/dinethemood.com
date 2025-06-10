import { createClient, type Client } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";

const client_id = "693eed6c2eaf79fecc2dc99013cb8d9d";
const url = "https://bryao.usw-18.palantirfoundry.com";
const ontologyRid = "ri.ontology.main.ontology.5802d919-3578-43e0-910d-2a3f187d8dee";
const redirectUrl = "http://localhost:5173/auth/callback";
const scopes = [
  "api:use-ontologies-read",
  "api:use-ontologies-write",
  "api:use-mediasets-read",
  "api:use-mediasets-write"
];

const auth = createPublicOauthClient(
  client_id,
  url,
  redirectUrl,
  true,
  undefined,
  window.location.toString(),
  scopes
);
export const client: Client = createClient(url, ontologyRid, auth);

function base64url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateVerifier(length = 128) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => ("0" + b.toString(16)).slice(-2)).join("");
}

async function generateChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url(hash);
}

export const handleAuth = async () => {
  const code_verifier = generateVerifier();
  const code_challenge = await generateChallenge(code_verifier);
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem("pkce_verifier", code_verifier);
  localStorage.setItem("oauth_state", state);
  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    redirect_uri: redirectUrl,
    state,
    scope: scopes.join(" "),
    code_challenge,
    code_challenge_method: "S256"
  });
  window.location.href = `${url}/multipass/api/oauth2/authorize?${params}`;
};
