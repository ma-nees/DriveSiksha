// ma-nees
export type StudentStatus = "active" | "completed" | "on_leave" | "archived";
export type PaymentStatus = "paid" | "partial" | "unpaid";
export type PaymentMethod = "cash" | "esewa" | "bank_transfer" | "other";

export interface Branch {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  totalStudents: number;
  totalInstructors: number;
  monthlyRevenue: number;
  status: "active" | "inactive";
}

export interface Instructor {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  branchId: string;
  branch: string;
  assignedStudents: number;
  todayLessons: number;
  licenseCategory: string;
  leaveStatus: "available" | "on_leave";
  accountStatus: "active" | "inactive";
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  photo?: string;
  branchId: string;
  branch: string;
  instructorId: string;
  instructor: string;
  course: string;
  completedLessons: number;
  totalLessons: number;
  courseFee: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  status: StudentStatus;
  registeredAt: string;
}

export interface Payment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  branch: string;
  receivedBy: string;
  status: "completed" | "pending" | "failed";
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  record: string;
  branch: string;
  date: string;
  ip: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  description: string;
}
