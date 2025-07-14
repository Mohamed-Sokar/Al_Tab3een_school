<script setup lang="ts">
import type { Payment, TeacherLoan } from "~/types";
import { useStudentStore } from "@/stores/students";
import { useTeachersStore } from "@/stores/teachers";
import { usePaymentsStore } from "@/stores/paymnets";
import { useLevelsStore } from "@/stores/levels";
const studentsStore = useStudentStore();
const {
  teachersData,
  behavioralIssuesTeachersData,
  // teachersUpsentReportsData,
  teachersLoansData,
} = useTeachersStore();

const paymentsStore = usePaymentsStore();
const { levelsData } = useLevelsStore();
const totalPayments = computed(() =>
  paymentsStore.totalPayments.reduce((sum: any, payment: Payment) => {
    if (payment.type === "وارد") {
      return (sum += payment.amount);
    } else {
      return (sum -= payment.amount ?? 0);
    }
  }, 0)
);
const totalTeachersLoans = computed(() =>
  teachersLoansData.reduce((sum: any, loan: TeacherLoan) => {
    return (sum += +loan.amount);
  }, 0)
);
const studentsGradeAvarage = computed(() => "91.5%");
</script>

<template>
  <div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <HomeCard
        to="/students/view/students_table"
        title="إجمالي الطلاب"
        :value="studentsStore.sortedStudents.length"
        color="secondary"
        icon-name="i-heroicons-users"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/teachers/view"
        title="إجمالي المعلمين"
        :value="teachersData.length"
        color="secondary"
        icon-name="i-heroicons-users"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/payments"
        title="إجمالي الصادر والوارد"
        :value="totalPayments"
        color="warning"
        icon-name="i-heroicons-currency-dollar"
        :loading="studentsStore.loading"
      />
      <!-- <HomeCard
        to="/levels"
        title="إجمالي المستويات"
        color="primary"
        :value="levelsData.length"
        icon-name="i-lucide-book-open"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/students/view/grades"
        title="معدل درجات جميع الطلاب"
        color="primary"
        :value="studentsGradeAvarage"
        icon-name="i-lucide-book-open"
        :loading="studentsStore.loading"
      /> -->
      <HomeCard
        to="/teachers/view/loans"
        title="مجموع سلف المدرسين"
        :value="totalTeachersLoans"
        color="warning"
        icon-name="i-heroicons-currency-dollar"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/students/view/behavioral_issues"
        title="مجموع المخالفات السلوكية للطلاب"
        :value="studentsStore.sortedIssues.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/teachers/view/behavioral_issues"
        title="مجموع المخالفات الإدارية للمعلمين"
        :value="behavioralIssuesTeachersData.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
        :loading="studentsStore.loading"
      />
      <!-- <HomeCard
        to="/teachers/view/ubsent"
        title="مجموع أيام غياب المدرسين"
        :value="teachersUpsentReportsData.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
        :loading="studentsStore.loading"
      /> -->
    </div>
  </div>
</template>

<style scoped></style>
