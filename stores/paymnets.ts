import type { Payment } from "~/types";
// import { payments } from "./../constants";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const usePaymentsStore = defineStore("payments", () => {
  const { toastSuccess, toastError } = useAppToast();
  const payments = ref<Payment[]>([]);
  const loading = ref(false);
  const tableKey = ref(Math.random());

  const fetchPayments = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/payments");

      console.log(data);
      // set payments data to ref locally
      payments.value = data;
      toastSuccess({
        title: "تم تحميل المدفوعات بنجاح",
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل المدفوعات",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addPayment = async (payment: Payment) => {
    loading.value = true;

    try {
      const { data } = await api.post("/payments", {
        ...payment,
      });
      toastSuccess({
        title: `:تم إضافة الدفعة بنجاح`,
      });
      console.log(data);
      // add student locally
      (payments.value || []).unshift({
        ...payment,
        date: payment.date
          ? new Date(payment.date).toISOString().split("T")[0]
          : undefined,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الدفعة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deletePayment = async (paymentId: number) => {
    try {
      loading.value = true;
      await api.delete(`payments/${paymentId}`);

      toastSuccess({
        title: `:تم حذف الدفعة بنجاح`,
      });
      // delete student locally
      const paymentIndex = getSpecificPaymentIndex(paymentId);
      (payments.value || []).splice(paymentIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الدفعة",
      });
    } finally {
      loading.value = false;
    }
  };
  const updatePayment = async (paymentId: number, newPayment: Payment) => {
    try {
      loading.value = true;
      const { data } = await api.put(`payments/${paymentId}`, newPayment);

      toastSuccess({
        title: `:تم تحديث بيانات الدفعة بنجاح`,
      });

      console.log(data);

      // update payment locally
      const targetedPaymentIndex = getSpecificPaymentIndex(paymentId);
      const targetedPayment = getSpecificPayment(paymentId);

      (payments.value || [])[targetedPaymentIndex] = {
        ...targetedPayment,
        ...newPayment,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات الدفعة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const getPaymentById = async (paymentId: number) => {
    try {
      loading.value = true;
      const { data, status } = await api.get(`payments/${paymentId}`);

      if (status !== 200) {
        toastError({
          title: "حدث مشكلة في جلب الدفعة",
        });
        throw Error("مشكلة في السيرفر");
      }

      toastSuccess({
        title: `:تم جلب الدفعة بنجاح`,
      });
      return data[0];
    } catch (err) {
      // toastError({
      //   title: "حدث مشكلة في جلب الدفعة",
      // });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificPayment = (paymentId: number | string) => {
    return (payments.value || []).find((payment) => payment.id == paymentId);
  };
  const getSpecificPaymentIndex = (paymentId: number) => {
    return (payments.value || []).findIndex(
      (payment) => payment.id == paymentId
    );
  };

  // Getters
  const paymentsData = computed(() => payments.value);

  const sortedPayment = computed(() => {
    return [...(paymentsData.value ?? [])].sort(
      (a, b) => (a.amount ?? 0) - (b.amount ?? 0)
    );
  });
  const totalIncome = computed(() => {
    return (payments.value || []).reduce((sum: any, payment: Payment) => {
      if (payment.type === "وارد") {
        return (sum += payment.amount);
      }
      return (sum += 0);
    }, 0);
  });
  const totalPayments = computed(() => payments.value || []);

  const totalExpense = computed(() => {
    const reduce = (payments.value || []).reduce(
      (sum: any, payment: Payment) => {
        if (payment.type === "صادر") {
          return (sum += payment.amount);
        }
        return (sum += 0);
      },
      0
    );
    return reduce;
  });

  return {
    // data
    payments,
    loading,
    tableKey,
    // Actions
    fetchPayments,
    addPayment,
    deletePayment,
    updatePayment,
    getSpecificPayment,
    getSpecificPaymentIndex,
    getPaymentById,
    // Getters
    totalPayments,
    totalIncome,
    totalExpense,
    paymentsData,
    sortedPayment,
  };
});
