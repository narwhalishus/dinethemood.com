import { createClient, type Client } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";

const client_id: string = "693eed6c2eaf79fecc2dc99013cb8d9d";
const url: string = "https://bryao.usw-18.palantirfoundry.com";
const ontologyRid: string = "ri.ontology.main.ontology.5802d919-3578-43e0-910d-2a3f187d8dee";
const redirectUrl: string = "http://localhost:5173/auth/callback";
const scopes: string[] = [
    "api:use-ontologies-read",
    "api:use-ontologies-write",
    "api:use-mediasets-read",
    "api:use-mediasets-write"
];

const auth = createPublicOauthClient(client_id, url, redirectUrl, true, undefined, window.location.toString(), scopes);
export const client: Client = createClient(url, ontologyRid, auth);

export const handleAuth = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `${url}/multipass/api/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${client_id}&` +
        `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
        `state=${state}&` +
        `scope=${encodeURIComponent(scopes.join(' '))}`;

    localStorage.setItem('oauth_state', state);

    window.location.href = authUrl;
};