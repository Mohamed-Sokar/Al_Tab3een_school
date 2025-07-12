import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body: AssignAcademicClassBody = await readBody(event);

  interface AssignAcademicClassBody {
    academicClassesIds: number[];
    teacherId: string;
  }

  const { academicClassesIds, teacherId } = body;

  if (!Array.isArray(academicClassesIds) || !teacherId) {
    throw createError({
      statusCode: 400,
      message: "removeAcademicClassesIds array and teacherId are required",
    });
  }
  const { error, data } = await client
    .from("teachers_academic_classes")
    .delete()
    .match({ teacher_id: teacherId })
    .in("academic_class_id", academicClassesIds)
    .select();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
