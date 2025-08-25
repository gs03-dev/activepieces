import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import { newCustomer } from "./lib/triggers/new-customer";
import { mollieAPIKeyAuth } from "./lib/common/auth";
import { newInvoice } from "./lib/triggers/new-invoice";
import { newOrder } from "./lib/triggers/new-order";
import { newPaymentChargeback } from "./lib/triggers/new-payment-chargeback";
import { newPayment } from "./lib/triggers/new-payment";
import { newRefund } from "./lib/triggers/new-refund";
import { newSettlement } from "./lib/triggers/new-settlement";

export const mollie = createPiece({
  displayName: "Mollie",
  auth: mollieAPIKeyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/mollie.png",
  authors: ["gs03dev"],
  actions: [],
  triggers: [
    newCustomer,
    newInvoice,
    newOrder,
    newPaymentChargeback,
    newPayment,
    newRefund,
    newSettlement
  ],
});
