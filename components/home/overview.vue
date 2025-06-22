<script setup lang="ts">
import type { Payment, TeacherLoan } from "~/types";
import { useStudentStore } from "@/stores/students";
import { useTeacherStore } from "@/stores/teachers";
import { usePaymentsStore } from "@/stores/paymnets";
import { useLevelsStore } from "@/stores/levels";
const { studentsData, behavioralIssuesStudentData } = useStudentStore();
const {
  teachersData,
  behavioralIssuesTeacherData,
  teachersUpsentReportsData,
  teachersLoansData,
} = useTeacherStore();
const { paymentsData } = usePaymentsStore();
const { levelsData } = useLevelsStore();

const totalPayments = computed(() =>
  paymentsData.reduce((sum: any, payment: Payment) => {
    if (payment.type === "دخل") {
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
        :value="studentsData.length"
        color="secondary"
        icon-name="i-heroicons-users"
      />
      <HomeCard
        to="/teachers/view"
        title="إجمالي المعلمين"
        :value="teachersData.length"
        color="secondary"
        icon-name="i-heroicons-users"
      />
      <HomeCard
        to="/payments"
        title="إجمالي الصادر والوارد"
        :value="totalPayments"
        color="warning"
        icon-name="i-heroicons-currency-dollar"
      />
      <HomeCard
        to="/levels"
        title="إجمالي المستويات"
        color="primary"
        :value="levelsData.length"
        icon-name="i-lucide-book-open"
      />
      <HomeCard
        to="/students/view/grades"
        title="معدل درجات جميع الطلاب"
        color="primary"
        :value="studentsGradeAvarage"
        icon-name="i-lucide-book-open"
      />
      <HomeCard
        to="/teachers/view/loans"
        title="مجموع سلف المدرسين"
        :value="totalTeachersLoans"
        color="warning"
        icon-name="i-heroicons-currency-dollar"
      />
      <HomeCard
        to="/students/view/behavioral_issues"
        title="مجموع المخالفات السلوكية للطلاب"
        :value="behavioralIssuesStudentData.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
      />
      <HomeCard
        to="/teachers/view/behavioral_issues"
        title="مجموع المخالفات الإدارية للمعلمين"
        :value="behavioralIssuesTeacherData.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
      />
      <HomeCard
        to="/teachers/view/ubsent"
        title="مجموع أيام غياب المدرسين"
        :value="teachersUpsentReportsData.length"
        color="error"
        icon-name="i-heroicons-exclamation-triangle"
      />
    </div>
  </div>
</template>

<style scoped></style>
