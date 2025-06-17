<template>
  <div>
    <page-header
      title="لوحة التحكم"
      description="مرحباً بك في نظام إدارة المدرسة"
    >
    </page-header>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
      <HomeCard
        to="/students/view"
        title="إجمالي الطلاب"
        :value="totalStudents"
      />
      <HomeCard
        to="/teachers/view"
        title="إجمالي المعلمين"
        :value="totalTeachers"
      />
      <HomeCard
        to="/payments"
        title="إجمالي الصادر والوارد"
        :value="totalPayments"
      />
      <HomeCard to="/levels" title="إجمالي المستويات" :value="10" />
      <HomeCard
        to="/students/view/grades"
        title="معدل درجات جميع الطلاب"
        :value="studentsGradeAvarage"
      />
      <HomeCard
        to="/students/view/behavioral_issues"
        title="مجموع المخالفات السلوكية للطلاب"
        :value="5"
      />
      <HomeCard
        to="/teachers/view/behavioral_issues"
        title="مجموع المخالفات الإدارية للمعلمين"
        :value="2"
      />
      <HomeCard
        to="/teachers/view/loans"
        title="مجموع سلف المدرسين"
        :value="1300"
      />
      <HomeCard
        to="/teachers/view/ubsent"
        title="مجموع أيام غياب المدرسين"
        :value="10"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { students } from "~/constants";
import type { Payment } from "~/types";
import { useTeacherStore } from "@/stores/teachers";
import { usePaymentsStore } from "@/stores/paymnets";

const { teachersData } = useTeacherStore();
const { paymentsData } = usePaymentsStore();

const totalStudents = computed(() => students.length);
const totalTeachers = computed(() => teachersData.length);
const totalPayments = computed(() =>
  paymentsData.value.reduce((sum: any, payment: Payment) => {
    if (payment.type === "دخل") {
      return (sum += payment.amount);
    } else {
      return (sum -= payment.amount ?? 0);
    }
  }, 0)
);
const studentsGradeAvarage = computed(() => "91.5%");
</script>

<style scoped></style>
