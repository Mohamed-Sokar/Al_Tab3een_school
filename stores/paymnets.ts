import type { Payment, Filters, PaymentSum } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const usePaymentsStore = defineStore("payments", () => {
  const { toastSuccess, toastError } = useAppToast();
  const client = useSupabaseClient();
  const reports = ref<Payment[]>([]);
  const reportsCount = ref(0);
  const paymentSums = ref<PaymentSum[]>([]);
  const loading = ref(false);
  const tableKey = ref(Math.random());

  /**
   * جلب الطلاب من Supabase مع دعم التصفح والفلاتر
   * @param {number} pageNum - رقم الصفحة (يبدأ من 1)
   * @param {number} pageSize - عدد السجلات لكل صفحة
   * @param {Object} filters - الفلاتر المطبقة (اختيارية)
   * @param {Object} forceRefresh - تحديث إجباري (اختيارية)
   * @returns {Promise<void>}
   */
  const fetchReports = async (
    pageNum: number = 1,
    pageSize: number = 10,
    filters?: Filters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize - 1;

    console.log("filters", filters);
    const shouldForceRefresh = forceRefresh;

    if (!shouldForceRefresh) {
      // التحقق مما إذا كانت البيانات موجودة بالفعل
      const hasEnoughData = reportsData.value.length > start;
      if (hasEnoughData) {
        const slicedData = reportsData.value.slice(start, end + 1);
        if (
          slicedData.length >= Math.min(pageSize, reportsCount.value - start)
        ) {
          console.log(`Using cached data for page ${pageNum}`);
          return;
        }
      }
    }
    try {
      loading.value = true;
      let query = client
        .from("payments")
        .select(
          `id, invoice_number, amount,type_id, description , created_at,
          month:months(id, name),
          type:type_id(id, type)
          `
        )
        .range(start, end)
        .order("id", { ascending: false });

      // Apply filtering based on month_id and invoiceType
      if (filters?.monthFilter) {
        query = query.eq("month_id", filters.monthFilter);
      }
      if (filters?.invoiceTypeFilter) {
        query = query.eq("type_id", filters.invoiceTypeFilter);
      }

      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      console.log("paymnets: ", data);

      if (forceRefresh) {
        reports.value = data as Payment[];
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(reports.value.map((report) => report.id));
        const newData = (data as Payment[]).filter(
          (report) => !existingIds.has(report.id)
        );
        // set reports data
        reports.value = [...reports.value, ...newData];

        toastSuccess({ title: "" });
      }
    } catch (err) {
      toastError({
        title: "خطأ في جلب التقارير",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      reports.value = [];
    } finally {
      loading.value = false;
    }
  };
  const getReportsCount = async (filters: Filters): Promise<void> => {
    try {
      loading.value = true;
      let query = client
        .from("payments")
        .select("*", { count: "exact", head: true });

      // Apply filtering based on month_id and invoiceType
      if (filters.monthFilter) {
        query = query.eq("month_id", filters.monthFilter);
      }
      if (filters.invoiceTypeFilter) {
        query = query.eq("type_id", filters.invoiceTypeFilter);
      }

      const { count, error } = await query;

      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      reportsCount.value = count || 0;
    } catch (err) {
      toastError({ title: "خطأ في جلب عدد التقارير" });
    } finally {
      loading.value = false;
    }
  };
  const fetchPaymentSums = async (filters: Filters = {}): Promise<void> => {
    try {
      loading.value = true;
      let query = client.from("payments").select(
        `type_id, month_id,
          type:invoiceTypes(type),
          month:months(name),
          amount`
      );

      if (filters.monthFilter) {
        query = query.eq("month_id", filters.monthFilter);
      }
      if (filters.invoiceTypeFilter) {
        query = query.eq("type_id", filters.invoiceTypeFilter);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      const sums = data
        .reduce((acc: PaymentSum[], row: any) => {
          const existing = acc.find(
            (item) =>
              item.type_id === row.type_id && item.month_id === row.month_id
          );
          if (existing) {
            existing.total_amount += row.amount;
          } else {
            acc.push({
              type_id: row.type_id,
              type_name: row.type.type,
              month_id: row.month_id,
              month_name: row.month.name,
              total_amount: row.amount,
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.month_id - b.month_id || a.type_id - b.type_id);

      paymentSums.value = sums;
      console.log("sums: ", sums);
      toastSuccess({ title: "تم جلب إجمالي المدفوعات بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في جلب إجمالي المدفوعات",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      paymentSums.value = [];
    } finally {
      loading.value = false;
    }
  };

  const addPayment = async (payment: Payment) => {
    loading.value = true;

    try {
      const { data } = await api.post("/payments", payment);
      toastSuccess({
        title: `:تم إضافة التقرير بنجاح`,
      });
      // add report locally
      (reports.value || []).unshift({
        ...payment,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة التقرير",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deletePayment = async (reportId: number) => {
    try {
      loading.value = true;
      await api.delete(`payments/${reportId}`);

      toastSuccess({
        title: `:تم حذف الدفعة بنجاح`,
      });
      // delete student locally
      const paymentIndex = getSpecificPaymentIndex(reportId);
      (reports.value || []).splice(paymentIndex, 1);
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
      console.log(newPayment);
      loading.value = true;
      const { data } = await api.put(`payments/${paymentId}`, newPayment);

      toastSuccess({
        title: `:تم تحديث بيانات الدفعة بنجاح`,
      });

      // console.log(data);

      // update payment locally
      const targetedPaymentIndex = getSpecificPaymentIndex(paymentId);
      const targetedPayment = getSpecificPayment(paymentId);

      (reports.value || [])[targetedPaymentIndex] = {
        ...targetedPayment,
        ...newPayment,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات الدفعة",
        description: (err as Error).message,
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
  const getSpecificPayment = (reportId: number | string) => {
    return (reports.value || []).find((report) => report.id == reportId);
  };
  const getSpecificPaymentIndex = (reportId: number) => {
    return (reports.value || []).findIndex((report) => report.id == reportId);
  };

  // Getters
  const reportsData = computed(() => reports.value);
  const reportsCountData = computed(() => reportsCount.value);
  const sortedReports = computed(() => {
    return [...(reports.value ?? [])].sort(
      (a, b) => (a.amount ?? 0) - (b.amount ?? 0)
    );
  });
  const totalIncome = computed(() => {
    return (paymentSums.value || []).reduce((sum: any, report: PaymentSum) => {
      if (report.type_name === "وارد") {
        return (sum += report.total_amount);
      }
      return (sum += 0);
    }, 0);
  });
  const totalExpense = computed(() => {
    const reduce = (paymentSums.value || []).reduce(
      (sum: any, payment: PaymentSum) => {
        if (payment?.type_name === "صادر") {
          return (sum += payment.total_amount);
        }
        return (sum += 0);
      },
      0
    );
    return reduce;
  });
  const netDifference = computed(() => {
    return totalIncome.value - totalExpense.value;
  });
  const paymentSumsData = computed(() => paymentSums.value);

  return {
    // data
    loading,
    tableKey,

    // Actions
    fetchReports,
    fetchPaymentSums,
    getReportsCount,
    addPayment,
    deletePayment,
    updatePayment,
    getSpecificPayment,
    getSpecificPaymentIndex,
    getPaymentById,

    // Getters
    totalIncome,
    totalExpense,
    netDifference,
    reportsData,
    reportsCountData,
    reportsCount,
    sortedReports,
    paymentSumsData,
  };
});
