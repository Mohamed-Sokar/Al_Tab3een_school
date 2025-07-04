import { defineStore } from 'pinia';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const usePaymentsStore = defineStore("payments", () => {
  const { toastSuccess, toastError } = useAppToast();
  const payments = ref([]);
  const loading = ref(false);
  const tableKey = ref(Math.random());
  const fetchPayments = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/payments");
      console.log(data);
      payments.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A \u0628\u0646\u062C\u0627\u062D"
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addPayment = async (payment) => {
    loading.value = true;
    try {
      const { data } = await api.post("/payments", {
        ...payment
      });
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062F\u0641\u0639\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      (payments.value || []).unshift({
        ...payment,
        date: payment.date ? new Date(payment.date).toISOString().split("T")[0] : void 0
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062F\u0641\u0639\u0629"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deletePayment = async (paymentId) => {
    try {
      loading.value = true;
      await api.delete(`payments/${paymentId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062F\u0641\u0639\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      const paymentIndex = getSpecificPaymentIndex(paymentId);
      (payments.value || []).splice(paymentIndex, 1);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u062F\u0641\u0639\u0629"
      });
    } finally {
      loading.value = false;
    }
  };
  const updatePayment = async (paymentId, newPayment) => {
    try {
      loading.value = true;
      const { data } = await api.put(`payments/${paymentId}`, newPayment);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      const targetedPaymentIndex = getSpecificPaymentIndex(paymentId);
      const targetedPayment = getSpecificPayment(paymentId);
      (payments.value || [])[targetedPaymentIndex] = {
        ...targetedPayment,
        ...newPayment
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639\u0629"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const getPaymentById = async (paymentId) => {
    try {
      loading.value = true;
      const { data, status } = await api.get(`payments/${paymentId}`);
      if (status !== 200) {
        toastError({
          title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u062F\u0641\u0639\u0629"
        });
        throw Error("\u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0627\u0644\u0633\u064A\u0631\u0641\u0631");
      }
      toastSuccess({
        title: `:\u062A\u0645 \u062C\u0644\u0628 \u0627\u0644\u062F\u0641\u0639\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      return data[0];
    } catch (err) {
    } finally {
      loading.value = false;
    }
  };
  const getSpecificPayment = (paymentId) => {
    return (payments.value || []).find((payment) => payment.id == paymentId);
  };
  const getSpecificPaymentIndex = (paymentId) => {
    return (payments.value || []).findIndex(
      (payment) => payment.id == paymentId
    );
  };
  const paymentsData = computed(() => payments.value);
  const sortedPayment = computed(() => {
    var _a;
    return [...(_a = paymentsData.value) != null ? _a : []].sort(
      (a, b) => {
        var _a2, _b;
        return ((_a2 = a.amount) != null ? _a2 : 0) - ((_b = b.amount) != null ? _b : 0);
      }
    );
  });
  const totalIncome = computed(() => {
    return (payments.value || []).reduce((sum, payment) => {
      if (payment.type === "\u0648\u0627\u0631\u062F") {
        return sum += payment.amount;
      }
      return sum += 0;
    }, 0);
  });
  const totalPayments = computed(() => payments.value || []);
  const totalExpense = computed(() => {
    const reduce = (payments.value || []).reduce(
      (sum, payment) => {
        if (payment.type === "\u0635\u0627\u062F\u0631") {
          return sum += payment.amount;
        }
        return sum += 0;
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
    sortedPayment
  };
});

export { usePaymentsStore as u };
//# sourceMappingURL=paymnets-DpmBuoF8.mjs.map
