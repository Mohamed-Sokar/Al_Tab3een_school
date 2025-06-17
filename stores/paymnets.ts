import type { Payment } from "~/types";
import { payments } from "./../constants";
// type NewPayment = Omit<Payment, "id">;
export const usePaymentsStore = () => {
  const paymentsData = ref<Payment[]>(payments);

  const addPayment = (payment: Payment) => {
    return paymentsData.value.unshift({ ...payment, id: Math.random() });
  };
  const deletePayment = (paymentId: number) => {
    const targetedPaymentIndex = paymentsData.value.findIndex(
      (payment) => payment.id === paymentId
    );
    return paymentsData.value.splice(targetedPaymentIndex, 1);
  };
  const updatePayment = (paymentId: number, newPayment: Payment) => {
    const targetedPaymentIndex = getSpecificPaymentIndex(paymentId);
    const targetedPayment = getSpecificPayment(paymentId);

    return (paymentsData.value[targetedPaymentIndex] = {
      ...targetedPayment,
      ...newPayment,
    });
  };
  const getSpecificPayment = (paymentId: number | string) => {
    return paymentsData.value.find((payment) => payment.id == paymentId);
  };
  const getSpecificPaymentIndex = (paymentId: number) => {
    return paymentsData.value.findIndex((payment) => payment.id == paymentId);
  };

  return {
    paymentsData,
    addPayment,
    deletePayment,
    updatePayment,
    getSpecificPayment,
    getSpecificPaymentIndex,
  };
};
