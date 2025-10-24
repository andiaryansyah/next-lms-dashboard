"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type students = {
  classId: number;
  id: string;
  address: string;
  img: string | null;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  gender: string;
  createdAt: Date;
  parentId: string;
  gradeId: number;
  birthday: Date;
}[];

const DropdownStudents = ({ students }: { students: students }) => {
  const [studentId, setStudentId] = useState(students[0].id || 0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentId(e.target.value);
  };
  const selectedStudent = students.find((student) => student.id === studentId);

  useEffect(() => {
    if (selectedStudent) {
      router.push(`?studentId=${selectedStudent.id}`);
    }
  }, [router, selectedStudent]);
  return (
    <div>
      <div className="flex flex-col gap-2 w-full md:w-1/4 mb-5">
        <label className="text-xs text-gray-500">Choose Student</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-800 dark:ring-gray-700 dark:focus:ring-green-400"
          defaultValue={studentId}
          onChange={handleChange}
        >
          {students.map((student: { id: string; name: string }) => (
            <option value={student.id} key={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownStudents;
