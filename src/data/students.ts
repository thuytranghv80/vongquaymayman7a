export interface Student {
  id: number;
  name: string;
  participated: boolean;
  correctAnswers: number;
  score: number;
  teacherGiftsCount?: number;
}

export const INITIAL_STUDENTS: { id: number; name: string }[] = [
  { id: 1, name: "Võ Công Bửu Ân" },
  { id: 2, name: "Nguyễn Minh Châu" },
  { id: 3, name: "Võ Thị Quỳnh Chi" },
  { id: 4, name: "Nguyễn Viết Đạt" },
  { id: 5, name: "Nguyễn Ngọc Gia Hân" },
  { id: 6, name: "Nguyễn Thị Ngọc Hân" },
  { id: 7, name: "Võ Thị Ngọc Hân" },
  { id: 8, name: "Trần Ngọc Hiệp" },
  { id: 9, name: "Nguyễn Đăng Huy" },
  { id: 10, name: "Võ Văn Phúc Khang" },
  { id: 11, name: "Nguyễn Thị Minh Khánh" },
  { id: 12, name: "Phan Ngọc Thiên Kim" },
  { id: 13, name: "Mai Thị Khánh Lê" },
  { id: 14, name: "Nguyễn Trần Mai Linh" },
  { id: 15, name: "Lê Văn Lợi" },
  { id: 16, name: "Nguyễn Võ Khánh Ly" },
  { id: 17, name: "Nguyễn Thanh Ngọc Minh" },
  { id: 18, name: "Võ Thị Bảo Ngân" },
  { id: 19, name: "Hồ Thị Vân Ngọc" },
  { id: 20, name: "Hoàng Lê Thảo Nguyên" },
  { id: 21, name: "Võ Nguyễn Nguyên Phong" },
  { id: 22, name: "Nguyễn Trí Bảo Phúc" },
  { id: 23, name: "Nguyễn Lý Anh Phương" },
  { id: 24, name: "Phan Võ Minh Quân" },
  { id: 25, name: "Võ Văn Quy" },
  { id: 26, name: "Nguyễn Viết Quyết" },
  { id: 27, name: "Võ Đình Tài" },
  { id: 28, name: "Nguyễn Đăng Tây" },
  { id: 29, name: "Nguyễn Thị Phương Thanh" },
  { id: 30, name: "Nguyễn Đăng Thắng" },
  { id: 31, name: "Tạ Đức Thịnh" },
  { id: 32, name: "Võ Văn Phúc Thịnh" },
  { id: 33, name: "Võ Văn Phước Thịnh" },
  { id: 34, name: "Võ Thị Kim Thư" },
  { id: 35, name: "Võ Nguyễn Thùy Trang" },
  { id: 36, name: "Nguyễn Hữu Nhật Trung" },
  { id: 37, name: "Võ Thị Minh Tuệ" },
  { id: 38, name: "Nguyễn Thị Thục Uyên" },
  { id: 39, name: "Hoàng Vũ Thảo Vy" }
];
