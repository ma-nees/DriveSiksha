// ma-nees
import type { Branch, Instructor, Student, Payment, AuditLog, SupportTicket } from "./types";

export const currentSchool = {
  name: "DriveSiksha Kathmandu",
  address: "Baneshwor, Kathmandu, Nepal",
  phone: "+977 01-4567890",
  email: "info@drivesiksha.com.np",
  pan: "301245678",
  registration: "REG-2078-4521",
  website: "www.drivesiksha.com.np",
};

export const currentUser = {
  name: "Suman Shrestha",
  role: "Driving School Admin",
  email: "admin@drivesiksha.com.np",
  avatar: "",
};

export const branches: Branch[] = [
  { id: "b1", name: "Baneshwor Main", address: "New Baneshwor, Kathmandu", manager: "Rajesh Karki", phone: "+977 9841234567", totalStudents: 128, totalInstructors: 8, monthlyRevenue: 685000, status: "active" },
  { id: "b2", name: "Lalitpur Branch", address: "Kupondole, Lalitpur", manager: "Sita Maharjan", phone: "+977 9807654321", totalStudents: 84, totalInstructors: 5, monthlyRevenue: 425000, status: "active" },
  { id: "b3", name: "Bhaktapur Branch", address: "Suryabinayak, Bhaktapur", manager: "Bikash Thapa", phone: "+977 9812345678", totalStudents: 62, totalInstructors: 4, monthlyRevenue: 310000, status: "active" },
];

export const instructors: Instructor[] = [
  { id: "i1", name: "Ram Bahadur Gurung", phone: "+977 9841112233", branchId: "b1", branch: "Baneshwor Main", assignedStudents: 18, todayLessons: 6, licenseCategory: "B, C", leaveStatus: "available", accountStatus: "active" },
  { id: "i2", name: "Krishna KC", phone: "+977 9842223344", branchId: "b1", branch: "Baneshwor Main", assignedStudents: 22, todayLessons: 7, licenseCategory: "B", leaveStatus: "available", accountStatus: "active" },
  { id: "i3", name: "Sunita Rai", phone: "+977 9843334455", branchId: "b2", branch: "Lalitpur Branch", assignedStudents: 14, todayLessons: 4, licenseCategory: "B, A", leaveStatus: "on_leave", accountStatus: "active" },
  { id: "i4", name: "Prakash Tamang", phone: "+977 9844445566", branchId: "b2", branch: "Lalitpur Branch", assignedStudents: 20, todayLessons: 5, licenseCategory: "B, C, D", leaveStatus: "available", accountStatus: "active" },
  { id: "i5", name: "Manoj Adhikari", phone: "+977 9845556677", branchId: "b3", branch: "Bhaktapur Branch", assignedStudents: 16, todayLessons: 5, licenseCategory: "B", leaveStatus: "available", accountStatus: "active" },
  { id: "i6", name: "Deepa Shrestha", phone: "+977 9846667788", branchId: "b3", branch: "Bhaktapur Branch", assignedStudents: 12, todayLessons: 3, licenseCategory: "A, B", leaveStatus: "available", accountStatus: "active" },
];

const BASE_DATE_TIME = new Date("2026-07-17T12:00:00Z").getTime();

const firstNames = ["Anish", "Bibek", "Sushmita", "Pratik", "Sabina", "Rohit", "Nisha", "Ashish", "Puja", "Sagar", "Kritika", "Bishal", "Sarita", "Nabin", "Mamata", "Dipesh", "Anjali", "Prabin", "Rekha", "Suresh"];
const lastNames = ["Sharma", "Shrestha", "Karki", "Thapa", "Rai", "Gurung", "Tamang", "Magar", "Bhandari", "Poudel", "Adhikari", "Basnet", "KC", "Maharjan"];
const courses = ["Car (B)", "Motorbike (A)", "Heavy Vehicle (C)", "Scooter (A)"];

export const students: Student[] = Array.from({ length: 40 }).map((_, i) => {
  const branch = branches[i % branches.length];
  const inst = instructors.find((x) => x.branchId === branch.id) || instructors[0];
  const total = 20;
  const completed = (i * 7) % (total + 1);
  const fee = [18000, 22000, 25000, 32000, 45000][i % 5];
  const paid = i % 4 === 0 ? 0 : i % 3 === 0 ? Math.floor(fee / 2) : fee;
  const pStatus = paid === 0 ? "unpaid" : paid < fee ? "partial" : "paid";
  const sStatus = completed === total ? "completed" : i % 11 === 0 ? "on_leave" : "active";
  return {
    id: `s${i + 1}`,
    studentId: `DS-${2081}-${(1000 + i).toString()}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    phone: `+977 98${(10000000 + i * 13579).toString().slice(0, 8)}`,
    branchId: branch.id,
    branch: branch.name,
    instructorId: inst.id,
    instructor: inst.name,
    course: courses[i % courses.length],
    completedLessons: completed,
    totalLessons: total,
    courseFee: fee,
    amountPaid: paid,
    paymentStatus: pStatus,
    status: sStatus,
    registeredAt: new Date(BASE_DATE_TIME - i * 3 * 86400000).toISOString(),
  };
});

export const payments: Payment[] = Array.from({ length: 25 }).map((_, i) => {
  const st = students[i % students.length];
  const methods: Payment["method"][] = ["cash", "esewa", "bank_transfer", "other"];
  return {
    id: `p${i + 1}`,
    receiptNo: `RCP-${2081}-${(5000 + i).toString()}`,
    studentId: st.id,
    studentName: st.name,
    amount: [5000, 8000, 12000, 15000, 22000, 25000][i % 6],
    method: methods[i % 4],
    date: new Date(BASE_DATE_TIME - i * 86400000).toISOString(),
    branch: st.branch,
    receivedBy: currentUser.name,
    status: "completed",
  };
});

export const auditLogs: AuditLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `a${i + 1}`,
  user: [currentUser.name, "Rajesh Karki", "Sita Maharjan"][i % 3],
  role: ["Admin", "Branch Manager", "Receptionist"][i % 3],
  action: ["Created Student", "Recorded Payment", "Updated Instructor", "Approved Leave", "Deleted Record", "Modified Branch"][i % 6],
  module: ["Students", "Payments", "Instructors", "Leave", "Students", "Branches"][i % 6],
  record: `#REC-${1000 + i}`,
  branch: branches[i % branches.length].name,
  date: new Date(BASE_DATE_TIME - i * 3600000).toISOString(),
  ip: `192.168.1.${20 + i}`,
}));

export const supportTickets: SupportTicket[] = [
  { id: "t1", subject: "Cannot print receipt in 4-up layout", category: "Bug", priority: "high", status: "in_progress", createdAt: new Date(BASE_DATE_TIME - 86400000).toISOString(), description: "The 4-up A4 print layout cuts off the footer." },
  { id: "t2", subject: "How to add a new branch?", category: "Question", priority: "low", status: "resolved", createdAt: new Date(BASE_DATE_TIME - 3 * 86400000).toISOString(), description: "Need help adding a new branch under my current plan." },
  { id: "t3", subject: "eSewa payment not reflecting", category: "Payment", priority: "high", status: "open", createdAt: new Date(BASE_DATE_TIME - 6 * 3600000).toISOString(), description: "Renewal payment via eSewa completed but not showing." },
];

// Charts
export const revenueMonthly = [
  { month: "Baishakh", revenue: 850000 },
  { month: "Jestha", revenue: 920000 },
  { month: "Ashadh", revenue: 1050000 },
  { month: "Shrawan", revenue: 980000 },
  { month: "Bhadra", revenue: 1120000 },
  { month: "Ashwin", revenue: 1250000 },
  { month: "Kartik", revenue: 1180000 },
  { month: "Mangsir", revenue: 1420000 },
];

export const registrationsMonthly = [
  { month: "Baishakh", students: 24 },
  { month: "Jestha", students: 32 },
  { month: "Ashadh", students: 28 },
  { month: "Shrawan", students: 35 },
  { month: "Bhadra", students: 41 },
  { month: "Ashwin", students: 48 },
  { month: "Kartik", students: 39 },
  { month: "Mangsir", students: 52 },
];

export const lessonCompletion = [
  { day: "Sun", completed: 42, scheduled: 48 },
  { day: "Mon", completed: 51, scheduled: 55 },
  { day: "Tue", completed: 47, scheduled: 52 },
  { day: "Wed", completed: 54, scheduled: 58 },
  { day: "Thu", completed: 49, scheduled: 54 },
  { day: "Fri", completed: 58, scheduled: 62 },
  { day: "Sat", completed: 62, scheduled: 65 },
];

export const paymentMethodDist = [
  { name: "Cash", value: 45 },
  { name: "eSewa", value: 32 },
  { name: "Bank Transfer", value: 18 },
  { name: "Other", value: 5 },
];

export const subscription = {
  plan: "Growth",
  billing: "Yearly",
  startDate: "2081-04-01",
  expiryDate: "2082-03-31",
  branchLimit: 4,
  branchesUsed: 3,
  studentLimit: 500,
  studentsUsed: 274,
  instructorLimit: 25,
  instructorsUsed: 17,
  storageLimit: 20,
  storageUsed: 6.4,
  status: "active" as const,
};

export const plans = [
  { name: "Starter", price: 4999, features: ["1 Branch", "Up to 100 students", "5 Instructors", "Basic reports", "Email support"] },
  { name: "Growth", price: 9999, features: ["4 Branches", "Up to 500 students", "25 Instructors", "Advanced analytics", "Priority support"], popular: true },
  { name: "Professional", price: 19999, features: ["10 Branches", "Up to 2000 students", "100 Instructors", "Full analytics", "Phone + email support"] },
  { name: "Enterprise", price: 39999, features: ["Unlimited branches", "Unlimited students", "Unlimited instructors", "Custom integrations", "Dedicated manager"] },
];

