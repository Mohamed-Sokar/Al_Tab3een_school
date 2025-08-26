<script setup lang="ts">
// import type { EmployeeLoan } from "~/types";
import { useStudentStore } from "@/stores/students";
const studentsStore = useStudentStore();
const employeesStore = useEmployeesStore();

// const totalEmployeeLoans = computed(() =>
//   employeesStore.loansData.reduce((sum: any, loan: EmployeeLoan) => {
//     return (sum += Number(loan.amount));
//   }, 0)
// );
</script>

<template>
  <div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <HomeCard
        to="/students/view/students_table"
        title="إجمالي الطلاب"
        :value="300"
        color="secondary"
        icon-name="i-heroicons-users"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/teachers/view"
        title="إجمالي المعلمين"
        :value="30"
        color="secondary"
        icon-name="i-heroicons-users"
        :loading="studentsStore.loading"
      />
      <HomeCard
        to="/payments"
        title="إجمالي الصادر والوارد"
        :value="1000"
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
        :value="1000"
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
        :value="employeesStore.sortedIssues.length"
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
