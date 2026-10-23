import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyCheckoutSignature, verifyWebhookSignature } from "../src/lib/payments";

const SECRET = "test_secret_key";
const ORDER = "order_TEST123";
const PAYMENT = "pay_TEST456";

const goodSig = createHmac("sha256", SECRET).update(`${ORDER}|${PAYMENT}`).digest("hex");

test("valid Razorpay checkout signature is accepted", () => {
  assert.equal(
    verifyCheckoutSignature({ orderId: ORDER, paymentId: PAYMENT, signature: goodSig, secret: SECRET }),
    true
  );
});

test("tampered signature is rejected", () => {
  const bad = goodSig.replace(/^./, goodSig[0] === "a" ? "b" : "a");
  assert.equal(
    verifyCheckoutSignature({ orderId: ORDER, paymentId: PAYMENT, signature: bad, secret: SECRET }),
    false
  );
});

test("wrong secret is rejected", () => {
  assert.equal(
    verifyCheckoutSignature({ orderId: ORDER, paymentId: PAYMENT, signature: goodSig, secret: "other" }),
    false
  );
});

test("swapped order/payment ids are rejected", () => {
  assert.equal(
    verifyCheckoutSignature({ orderId: PAYMENT, paymentId: ORDER, signature: goodSig, secret: SECRET }),
    false
  );
});

test("missing fields are rejected", () => {
  assert.equal(verifyCheckoutSignature({ orderId: "", paymentId: PAYMENT, signature: goodSig, secret: SECRET }), false);
  assert.equal(verifyCheckoutSignature({ orderId: ORDER, paymentId: PAYMENT, signature: "", secret: SECRET }), false);
});

test("webhook signature verifies raw body correctly", () => {
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: PAYMENT } } } });
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  assert.equal(verifyWebhookSignature(body, sig, SECRET), true);
  assert.equal(verifyWebhookSignature(body + " ", sig, SECRET), false);
  assert.equal(verifyWebhookSignature(body, sig, "wrong"), false);
});
