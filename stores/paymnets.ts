import type { Payment } from "~/types";
import { payments } from "./../constants";
import { defineStore } from "pinia";

export const usePaymentsStore = defineStore("payments", () => {
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
  const totalIncome = () => {
    return paymentsData.value.reduce((sum: any, payment: Payment) => {
      if (payment.type === "دخل") {
        return (sum += payment.amount);
      }
      return (sum += 0);
    }, 0);
  };

  const totalExpense = () => {
    const reduce = paymentsData.value.reduce((sum: any, payment: Payment) => {
      if (payment.type === "مصروف") {
        return (sum += payment.amount);
      }
      return (sum += 0);
    }, 0);
    return reduce;
  };

  return {
    paymentsData,
    addPayment,
    deletePayment,
    updatePayment,
    getSpecificPayment,
    getSpecificPaymentIndex,
    totalIncome,
    totalExpense,
  };
});
