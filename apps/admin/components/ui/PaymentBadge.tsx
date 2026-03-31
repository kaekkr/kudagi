import { KuDagiOrder } from "@kudagi/core";
import { Badge } from "./Badge";

export const PaymentBadge = ({ order }: { order: KuDagiOrder }) => {
  if (order.fullPaid)
    return <Badge color="bg-green-100" text="Оплачено" textColor="text-green-700" />;
  if (order.depositPaid)
    return <Badge color="bg-blue-50" text="Предоплата" textColor="text-blue-700" />;
  return <Badge color="bg-red-50" text="Не оплачено" textColor="text-red-600" />;
};
