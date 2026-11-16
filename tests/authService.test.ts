import test from "node:test";
import assert from "node:assert/strict";
import { LoginState } from "@wix/sdk";
import { AUTH_MODE, DirectAuthClient, executeWixAuthAction } from "../src/services/authService";

const createBrowserGlobals = () => {
  const g = globalThis as Record<string, unknown>;
  g.window = { location: { origin: "http://localhost:3000", protocol: "http:" } };
  g.document = { cookie: "" };
};

const createDirectMock = (overrides: Partial<DirectAuthClient["auth"]> = {}): DirectAuthClient => ({
  auth: {
    login: async () => ({ loginState: LoginState.SUCCESS, data: { sessionToken: "sess-123" } }),
    register: async () => ({ loginState: LoginState.SUCCESS, data: { sessionToken: "reg-123" } }),
    sendPasswordResetEmail: async () => undefined,
    processVerification: async () => ({ loginState: LoginState.SUCCESS, data: { sessionToken: "ver-123" } }),
    getMemberTokensForDirectLogin: async () => ({
      accessToken: { value: "acc", expiresAt: 9999999999 },
      refreshToken: { value: "ref", role: "member" as never },
    }),
    setTokens: () => undefined,
    ...overrides,
  },
});

test("executeWixAuthAction completes genuine Wix registration and exchanges OAuth member tokens", async () => {
  createBrowserGlobals();
  let exchangedSession = "";
  let tokensStored = false;

  const client = createDirectMock({
    getMemberTokensForDirectLogin: async (sessionToken) => {
      exchangedSession = sessionToken;
      return {
        accessToken: { value: "acc-live", expiresAt: 9999999999 },
        refreshToken: { value: "ref-live", role: "member" as never },
      };
    },
    setTokens: () => { tokensStored = true; },
  });

  const res = await executeWixAuthAction(client, AUTH_MODE.REGISTER, {
    email: "zyad@example.com",
    password: "Password123!",
    username: "Zyad Moataz",
    redirectUrl: "http://localhost:3000/login",
  }, true);

  assert.equal(res.status, "SUCCESS");
  assert.equal(exchangedSession, "reg-123");
  assert.equal(tokensStored, true);
});

test("executeWixAuthAction surfaces Wix errors accurately without creating fake local accounts", async () => {
  createBrowserGlobals();

  const dupClient = createDirectMock({
    register: async () => ({ loginState: LoginState.FAILURE, errorCode: "emailAlreadyExists", error: "Exists" }),
  });
  const dup = await executeWixAuthAction(dupClient, AUTH_MODE.REGISTER, {
    email: "existing@example.com",
    password: "Password123!",
    redirectUrl: "http://localhost:3000/login",
  }, true);
  assert.equal(dup.status, "ERROR");
  assert.match(dup.message || "", /already exists/i);

  const captchaClient = createDirectMock({
    register: async () => ({ loginState: LoginState.FAILURE, errorCode: "missingCaptchaToken", error: "403" }),
  });
  const blocked = await executeWixAuthAction(captchaClient, AUTH_MODE.REGISTER, {
    email: "new@example.com",
    password: "Password123!",
    redirectUrl: "http://localhost:3000/login",
  }, true);
  assert.equal(blocked.status, "ERROR");
  assert.match(blocked.message || "", /security verification|Wix Dashboard/i);

  const verifyClient = createDirectMock({
    register: async () => ({ loginState: LoginState.EMAIL_VERIFICATION_REQUIRED, data: { stateToken: "st" } }),
  });
  const verify = await executeWixAuthAction(verifyClient, AUTH_MODE.REGISTER, {
    email: "verify@example.com",
    password: "Password123!",
    redirectUrl: "http://localhost:3000/login",
  }, true);
  assert.equal(verify.status, "VERIFY");
});
