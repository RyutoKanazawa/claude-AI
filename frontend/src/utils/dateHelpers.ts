import { format, isBefore, isToday, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '期限なし';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy年M月d日');
  } catch {
    return '無効な日付';
  }
};

export const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

export const isOverdue = (dueDate: string | Date | undefined): boolean => {
  if (!dueDate) return false;
  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(dateObj, today);
  } catch {
    return false;
  }
};

export const isDueToday = (dueDate: string | Date | undefined): boolean => {
  if (!dueDate) return false;
  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return isToday(dateObj);
  } catch {
    return false;
  }
};

export const getDaysUntilDue = (dueDate: string | Date | undefined): number | null => {
  if (!dueDate) return null;
  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(dateObj, today);
  } catch {
    return null;
  }
};
