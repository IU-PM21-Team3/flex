export function formatDate(date: Date, format: string) {
  format = format.replace(/yyyy/g, date.getFullYear().toString());
  format = format.replace(/MM/g, (date.getMonth() + 1).toString()); 
  format = format.replace(/dd/g, date.getDate().toString());
  format = format.replace(/HH/g, date.getHours().toString());
  format = format.replace(/mm/g, date.getMinutes().toString());
  format = format.replace(/ss/g, date.getSeconds().toString());
  format = format.replace(/SSS/g, date.getMilliseconds().toString());
  return format;
};