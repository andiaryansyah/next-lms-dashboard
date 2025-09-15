import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import PerformanceChart from "@/components/PerformanceChart";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-pickSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="https://marketplace.canva.com/EAFgn7KRn6s/1/0/1600w/canva-cokelat-estetis-facebook-foto-profil--277-QYXnjI.jpg"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Jeanne V</h1>
                <FormModal
                  table="student"
                  type="update"
                  data={{
                    id: 1,
                    username: "jeanne",
                    email: "user@gmail.com",
                    password: "123456",
                    firstName: "Jeanne",
                    lastName: "V",
                    phone: "+62 812320",
                    address: "1234 Main St, Anytown, USA",
                    birthday: "2000-01-01",
                    gender: "female",
                    img: "https://marketplace.canva.com/EAFgn7KRn6s/1/0/1600w/canva-cokelat-estetis-facebook-foto-profil--277-QYXnjI.jpg",
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.{" "}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                {/* <div className="w-full md:w-1/3 lg:w-full xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>A+</span>
                </div> */}
                <div className="w-full md:w-1/3 lg:w-full xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>+62 812320</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARD */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">18</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6A</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              href={`/list/lessons?classId=${2}`}
              className="p-4 rounded-md bg-pickSkyLight"
            >
              Student&apos;s Lessons
            </Link>
            <Link
              href={`/list/teachers?classId=${2}`}
              className="p-4 rounded-md bg-pickPurpleLight"
            >
              Student&apos;s Teachers
            </Link>
            <Link
              href={`/list/exams?classId=${2}`}
              className="p-4 rounded-md bg-pickYellowLight"
            >
              Student&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?classId=${2}`}
              className="p-4 rounded-md bg-pickSkyLight"
            >
              Student&apos;s Assignments
            </Link>
            <Link
              href={`/list/results?studentId=${"student2"}`}
              className="p-4 rounded-md bg-pink-50"
            >
              Student&apos; Results
            </Link>
          </div>
        </div>
        <PerformanceChart />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
