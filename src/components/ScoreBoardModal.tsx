import React, { useState } from 'react';
import { Student } from '../data/students';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  Search,
  CheckCircle,
  Clock,
  Plus,
  Minus,
  RotateCcw,
  X,
  Award,
  Users,
  Edit2,
  Check,
  UserPlus,
  Volume2,
  Gift,
} from 'lucide-react';

interface ScoreBoardModalProps {
  students: Student[];
  onUpdateScore: (studentId: number, delta: number) => void;
  onResetScores: () => void;
  onToggleParticipated: (studentId: number) => void;
  onRenameStudent?: (studentId: number, newName: string) => void;
  onAddStudent?: (name: string) => void;
  onUpdateGifts?: (studentId: number, delta: number) => void;
  onClose: () => void;
}

export const ScoreBoardModal: React.FC<ScoreBoardModalProps> = ({
  students,
  onUpdateScore,
  onResetScores,
  onToggleParticipated,
  onRenameStudent,
  onAddStudent,
  onUpdateGifts,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'participated' | 'waiting'>('all');

  // Editing student name state
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Add new student state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'participated') return s.participated;
    if (filterMode === 'waiting') return !s.participated;
    return true;
  });

  const totalParticipated = students.filter(s => s.participated).length;
  const totalCorrect = students.reduce((acc, s) => acc + s.correctAnswers, 0);
  const totalPoints = students.reduce((acc, s) => acc + s.score, 0);
  const totalGifts = students.reduce((acc, s) => acc + (s.teacherGiftsCount || 0), 0);
  const highestScore = Math.max(...students.map(s => s.score), 0);

  const startEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setEditingName(student.name);
  };

  const saveEdit = (studentId: number) => {
    if (editingName.trim() && onRenameStudent) {
      onRenameStudent(studentId, editingName.trim());
    }
    setEditingStudentId(null);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && onAddStudent) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                BẢNG THÀNH TÍCH – LỚP 7A1
              </h3>
              <p className="text-xs text-indigo-300">
                Trường TH&THCS Lê Thị Tuyết • Môn GDCD • Sĩ số: {students.length} học sinh
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800">
          <div className="p-3 sm:p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-center">
            <div className="text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5" /> Sĩ số lớp
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{students.length} HS</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-center">
            <div className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Đã tham gia
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              {totalParticipated}/{students.length}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-center">
            <div className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5" /> Trả lời đúng
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {totalCorrect} câu
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-center">
            <div className="text-xs font-semibold text-rose-300 flex items-center justify-center gap-1 mb-1">
              <Gift className="w-3.5 h-3.5 text-rose-400" /> Quà GV trao
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400">
              {totalGifts} quà
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-yellow-950/50 border border-yellow-500/30 text-center col-span-2 sm:col-span-1">
            <div className="text-xs font-semibold text-yellow-300 flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-3.5 h-3.5" /> Điểm cao nhất
            </div>
            <div className="text-2xl sm:text-3xl font-black text-yellow-400">
              {highestScore} đ
            </div>
          </div>
        </div>

        {/* Search, Add Student & Filter Bar */}
        <div className="px-6 py-3 bg-slate-900 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên học sinh..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Tất cả ({students.length})
            </button>
            <button
              onClick={() => setFilterMode('participated')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'participated'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Đã tham gia ({totalParticipated})
            </button>
            <button
              onClick={() => setFilterMode('waiting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'waiting'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Chờ quay ({students.length - totalParticipated})
            </button>
            
            {onAddStudent && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 flex items-center gap-1 cursor-pointer"
                title="Thêm học sinh vào danh sách"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Thêm HS</span>
              </button>
            )}
          </div>
        </div>

        {/* Add Student Form */}
        {showAddForm && onAddStudent && (
          <form onSubmit={handleCreateStudent} className="px-6 py-3 bg-indigo-950/40 border-b border-indigo-500/30 flex items-center gap-3">
            <input
              type="text"
              placeholder="Nhập họ và tên học sinh mới..."
              value={newStudentName}
              onChange={e => setNewStudentName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Hủy
            </button>
          </form>
        )}

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và Tên Học Sinh</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-3 text-center">Câu Đúng</th>
                <th className="py-3 px-3 text-center">Tổng Điểm</th>
                <th className="py-3 px-3 text-center">Quà GV</th>
                <th className="py-3 px-3 text-center">Điểm Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStudents.map(student => (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    student.participated ? 'bg-slate-900/40' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                    {student.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {editingStudentId === student.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-amber-400 text-white text-sm"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(student.id);
                            if (e.key === 'Escape') setEditingStudentId(null);
                          }}
                        />
                        <button
                          onClick={() => saveEdit(student.id)}
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStudentId(null)}
                          className="p-1 rounded bg-slate-700 text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group flex-wrap">
                        <span>{student.name}</span>
                        <button
                          type="button"
                          onClick={() => soundManager.speakStudentName(student.name, student.id)}
                          title={`Nghe đọc tên ${student.name}`}
                          className="opacity-40 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-300 transition-opacity cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        {student.score > 0 && student.score === highestScore && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                            ⭐ Dẫn đầu
                          </span>
                        )}
                        {student.teacherGiftsCount && student.teacherGiftsCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 font-semibold flex items-center gap-1 shadow-sm">
                            <Gift className="w-3 h-3 text-rose-400" />
                            <span>{student.teacherGiftsCount} Quà GV</span>
                          </span>
                        )}
                        {onRenameStudent && (
                          <button
                            onClick={() => startEdit(student)}
                            title="Sửa tên học sinh"
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-300 transition-opacity cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onToggleParticipated(student.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        student.participated
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                      }`}
                      title="Nhấn để đổi trạng thái"
                    >
                      {student.participated ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Đã tham gia</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Chưa tham gia</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-200">
                    {student.correctAnswers} câu
                  </td>
                  <td className="py-3 px-3 text-center font-black text-base text-amber-400 font-mono">
                    {student.score} đ
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {student.teacherGiftsCount && student.teacherGiftsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Gift className="w-3 h-3 text-rose-400" />
                          <span>x{student.teacherGiftsCount}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs font-mono">-</span>
                      )}
                      {onUpdateGifts && (
                        <div className="flex items-center gap-0.5 ml-1">
                          <button
                            onClick={() => onUpdateGifts(student.id, 1)}
                            title="Tặng thêm 1 phần quà"
                            className="w-5 h-5 rounded bg-rose-950/70 hover:bg-rose-800 text-rose-300 border border-rose-600/40 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          >
                            +
                          </button>
                          {Boolean(student.teacherGiftsCount && student.teacherGiftsCount > 0) && (
                            <button
                              onClick={() => onUpdateGifts(student.id, -1)}
                              title="Bớt 1 phần quà"
                              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/40 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              -
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onUpdateScore(student.id, 10)}
                        title="Thưởng +10 điểm"
                        className="w-7 h-7 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-600/50 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onUpdateScore(student.id, -10)}
                        title="Trừ -10 điểm"
                        className="w-7 h-7 rounded-lg bg-rose-950/60 hover:bg-rose-800 text-rose-300 border border-rose-600/50 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả điểm và trạng thái tham gia của lớp 7A1?')) {
                onResetScores();
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bảng điểm</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase transition-colors cursor-pointer"
          >
            Đóng bảng điểm
          </button>
        </div>
      </div>
    </div>
  );
};
