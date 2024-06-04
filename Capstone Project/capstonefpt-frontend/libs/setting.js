import { IconUser } from "@douyinfe/semi-icons";
import {
  FaBook,
  FaBookMedical,
  FaBriefcaseMedical,
  FaCalendarAlt,
  FaCommentAlt,
  FaPager,
  FaPills,
  FaUserCog,
  FaUserNurse,
  FaUsers,
  FaPlus,
  FaList,
  FaUserPlus,
  FaCalendarPlus,
  FaComment,
  FaChartArea,
} from "react-icons/fa";
import { FaUserDoctor, FaUserGroup, FaRegMessage } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { BsRobot } from "react-icons/bs";

export const AdminNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/admin/home",
  },
  {
    type: "item",
    icon: <IconUser className="text-xl" />,
    itemKey: "userInfo",
    text: "My Profile",
    link: "/general/userInfo",
  },
  {
    type: "sub",
    itemKey: "user",
    text: "User ",
    icon: <FaUserGroup className="w-min" />,
    items: [
      {
        type: "item",
        itemKey: "user-list",
        text: "List",
        link: "/admin/user/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "user-create",
        text: "Create",
        link: "/admin/user/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "doctor",
    text: "Doctor ",
    icon: <FaUserDoctor className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "doctor-list",
        text: "List",
        link: "/admin/doctor/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "doctor-create",
        text: "Create",
        link: "/admin/doctor/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "staff",
    text: "Staff ",
    icon: <FaUserNurse className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "staff-list",
        text: "List",
        link: "/admin/staff/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "staff-create",
        text: "Create",
        link: "/admin/staff/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "student",
    text: "Student ",
    icon: <FaUsers className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "student-list",
        text: "List",
        link: "/admin/student/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "student-create",
        text: "Create",
        link: "/admin/student/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "role",
    text: "Role ",
    icon: <FaUserCog className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "role-list",
        text: "List",
        link: "/admin/role/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "role-create",
        text: "Create",
        link: "/admin/role/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "unit",
    text: "Unit ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "unit-list",
        text: "List",
        link: "/admin/unit/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "unit-create",
        text: "Create",
        link: "/admin/unit/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicine",
    text: "Medicine ",
    icon: <FaBriefcaseMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicine-list",
        text: "List",
        link: "/admin/medicine/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicine-create",
        text: "Create",
        link: "/admin/medicine/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "examinatedRecord",
    text: "Examined record",
    icon: <FaBook className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "examinatedRecord-list",
        text: "List",
        link: "/admin/examinatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "examinatedRecord-create",
        text: "Create",
        link: "/admin/examinatedRecord/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicalExaminatedRecord",
    text: "Medical Examinated Record ",
    icon: <FaBookMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-list",
        text: "List",
        link: "/admin/medicalExaminatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-create",
        text: "Create",
        link: "/admin/medicalExaminatedRecord/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicineCode",
    text: "Medicine Code ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicineCode-list",
        text: "List",
        link: "/admin/medicineCode/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicineCode-create",
        text: "Create",
        link: "/admin/medicineCode/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "feedback",
    text: "Feedback ",
    icon: <FaCommentAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "feedback-list",
        text: "List",
        link: "/admin/feedback/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "feedback-create",
        text: "Create",
        link: "/admin/feedback/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog ",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "blog-list",
        text: "List",
        link: "/admin/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "blog-create",
        text: "Create",
        link: "/admin/blog/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "schedule",
    text: "Schedule ",
    icon: <FaCalendarAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "schedule-list",
        text: "List",
        link: "/admin/schedule/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "schedule-create",
        text: "Create",
        link: "/admin/schedule/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "schedule-register",
        text: "Register",
        link: "/admin/schedule/register",
        icon: <FaUserPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "chat",
    text: "Chat",
    icon: <FaRegMessage className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "chat-list",
        text: "Statistic",
        link: "/admin/chat/list",
        icon: <FaChartArea className="text-xs mt-1 ml-1" />,
      },
    ],
  },
];

export const DoctorNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/",
  },
  {
    type: "item",
    icon: <IconUser className="text-xl" />,
    itemKey: "userInfo",
    text: "My Profile",
    link: "/general/userInfo",
  },

  {
    type: "sub",
    itemKey: "staff",
    text: "Staff ",
    icon: <FaUserNurse className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "staff-list",
        text: "List",
        link: "/client/staff/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "student",
    text: "Student ",
    icon: <FaUsers className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "student-list",
        text: "List",
        link: "/client/student/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicine",
    text: "Medicine ",
    icon: <FaBriefcaseMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicine-list",
        text: "List",
        link: "/client/medicine/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "examinatedRecord",
    text: "Examined record",
    icon: <FaBook className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "examinatedRecord-list",
        text: "List",
        link: "/client/examinatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "examinatedRecord-create",
        text: "Create",
        link: "/client/examinatedRecord/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicalExaminatedRecord",
    text: "Medical Examinated Record ",
    icon: <FaBookMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-list",
        text: "List",
        link: "/client/medicalExaminatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-create",
        text: "Create",
        link: "/client/medicalExaminatedRecord/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicineCode",
    text: "Medicine Code ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicineCode-list",
        text: "List",
        link: "/client/medicineCode/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "feedback",
    text: "Feedback ",
    icon: <FaCommentAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "feedback-list",
        text: "List",
        link: "/client/feedback/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog ",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "client-blog-list",
        text: "List",
        link: "/client/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "item",
    icon: <FaComment className="text-xl" />,
    itemKey: "chat",
    text: "Chat",
    link: "/client/chat",
  },
  {
    type: "item",
    icon: <BsRobot className="text-xl" />,
    itemKey: "heleperAI",
    text: "AI Assistant",
    link: "/client/helperWithAI",
  },
];

export const MedicalStaffNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/",
  },
  {
    type: "item",
    icon: <IconUser className="text-xl" />,
    itemKey: "userInfo",
    text: "My Profile",
    link: "/general/userInfo",
  },
  {
    type: "sub",
    itemKey: "unit",
    text: "Unit ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "unit-list",
        text: "List",
        link: "/client/unit/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "unit-create",
        text: "Create",
        link: "/client/unit/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicine",
    text: "Medicine ",
    icon: <FaBriefcaseMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicine-list",
        text: "List",
        link: "/client/medicine/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicine-create",
        text: "Create",
        link: "/client/medicine/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicineCode",
    text: "Medicine Code ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicineCode-list",
        text: "List",
        link: "/client/medicineCode/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "medicineCode-create",
        text: "Create",
        link: "/client/medicineCode/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "feedback",
    text: "Feedback ",
    icon: <FaCommentAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "feedback-list",
        text: "List",
        link: "/client/feedback/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog ",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "blog-list",
        text: "Published blog list",
        link: "/client/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "client-blog-list",
        text: "Admin blog list",
        link: "/admin/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "blog-create",
        text: "Create",
        link: "/client/blog/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "schedule",
    text: "Schedule ",
    icon: <FaCalendarAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "schedule-list",
        text: "List",
        link: "/client/schedule/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
];

export const StaffNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/",
  },
  {
    type: "item",
    icon: <IconUser className="text-xl" />,
    itemKey: "userInfo",
    text: "My Profile",
    link: "/general/userInfo",
  },
  {
    type: "sub",
    itemKey: "doctor",
    text: "Doctor ",
    icon: <FaUserDoctor className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "doctor-list",
        text: "List",
        link: "/client/doctor/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicine",
    text: "Medicine ",
    icon: <FaBriefcaseMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicine-list",
        text: "List",
        link: "/client/medicine/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "examinatedRecord",
    text: "Examined record",
    icon: <FaBook className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "examinatedRecord-list",
        text: "List",
        link: "/client/examinatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicalExaminatedRecord",
    text: "Medical Examinated Record ",
    icon: <FaBookMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-list",
        text: "List",
        link: "/client/medicalExaminatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicineCode",
    text: "Medicine Code ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicineCode-list",
        text: "List",
        link: "/client/medicineCode/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "feedback",
    text: "Feedback ",
    icon: <FaCommentAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "feedback-list",
        text: "List",
        link: "/client/feedback/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "feedback-create",
        text: "Create",
        link: "/client/feedback/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog ",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "client-blog-list",
        text: "List",
        link: "/client/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "schedule",
    text: "Schedule ",
    icon: <FaCalendarAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "schedule-register",
        text: "Register",
        link: "/client/schedule/register",
        icon: <FaCalendarPlus className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "waitingPatient-list",
        text: "Waiting schedule",
        link: "/client/waitingPatient/list",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "item",
    icon: <BsRobot className="text-xl" />,
    itemKey: "heleperAI",
    text: "AI Assistant",
    link: "/client/helperWithAI",
  },
];

export const StudentNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/",
  },
  {
    type: "item",
    icon: <IconUser className="text-xl" />,
    itemKey: "userInfo",
    text: "My Profile",
    link: "/general/userInfo",
  },
  {
    type: "sub",
    itemKey: "doctor",
    text: "Doctor ",
    icon: <FaUserDoctor className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "doctor-list",
        text: "List",
        link: "/client/doctor/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicine",
    text: "Medicine ",
    icon: <FaBriefcaseMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicine-list",
        text: "List",
        link: "/client/medicine/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "examinatedRecord",
    text: "Examined record",
    icon: <FaBook className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "examinatedRecord-list",
        text: "List",
        link: "/client/examinatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicalExaminatedRecord",
    text: "Medical Examinated Record ",
    icon: <FaBookMedical className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicalExaminatedRecord-list",
        text: "List",
        link: "/client/medicalExaminatedRecord/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "medicineCode",
    text: "Medicine Code ",
    icon: <FaPills className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "medicineCode-list",
        text: "List",
        link: "/client/medicineCode/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "feedback",
    text: "Feedback ",
    icon: <FaCommentAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "feedback-list",
        text: "List",
        link: "/client/feedback/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "feedback-create",
        text: "Create",
        link: "/client/feedback/create",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog ",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "client-blog-list",
        text: "List",
        link: "/client/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "sub",
    itemKey: "schedule",
    text: "Schedule ",
    icon: <FaCalendarAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "schedule-register",
        text: "Register",
        link: "/client/schedule/register",
        icon: <FaCalendarPlus className="text-xs mt-1 ml-1" />,
      },
      {
        type: "item",
        itemKey: "waitingPatient-list",
        text: "Waiting schedule",
        link: "/client/waitingPatient/list",
        icon: <FaPlus className="text-xs mt-1 ml-1" />,
      },
    ],
  },
  {
    type: "item",
    icon: <FaComment className="text-xl" />,
    itemKey: "chat",
    text: "Chat",
    link: "/client/chat",
  },
  {
    type: "item",
    icon: <BsRobot className="text-xl" />,
    itemKey: "heleperAI",
    text: "AI Assistant",
    link: "/client/helperWithAI",
  },
];

export const viewerNavigation = [
  {
    type: "item",
    icon: <IoHome className="text-xl" />,
    itemKey: "home",
    text: "Home",
    link: "/",
  },
  {
    type: "sub",
    itemKey: "blog",
    text: "Blog",
    icon: <FaPager className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "client-blog-list",
        text: "Published blog",
        link: "/client/blog/list",
        icon: <FaList className="text-xs mt-1 ml-1" />,
      },
    ],
  },
];
