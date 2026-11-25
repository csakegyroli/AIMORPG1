export const WORLD_CLOCK = {
  kingdomYear: 327,
  season: "Nyár",
  // Canonical server rule: 12 real-world hours = 1 in-world day.
  realHoursPerKingdomDay: 12,
  realMsPerKingdomDay: 12 * 60 * 60 * 1000,
  anchorUtcMs: Date.UTC(2026, 7, 13, 0, 0, 0),
  anchorDay: 14,
  anchorMonth: 6,
  daysPerYear: 365,
  monthLengths: [31,28,31,30,31,30,31,31,30,31,30,31] as const,
} as const;

export type WorldTime = {
  year: number;
  season: string;
  month: number;
  day: number;
  hour: number;
  minute: number;
  phase: "hajnal" | "délelőtt" | "délután" | "alkonyat" | "éjszaka";
  label: string;
  shortLabel: string;
};

const PHASES = [
  [0, "éjszaka"],
  [2, "hajnal"],
  [5, "délelőtt"],
  [8, "délután"],
  [10, "alkonyat"],
] as const;

function seasonForMonth(month: number) {
  if (month <= 3) return "Tavasz";
  if (month <= 6) return "Nyár";
  if (month <= 9) return "Ősz";
  return "Tél";
}

export function dayOfYearFromMonthDay(month:number, day:number){ let total=0; for(let i=0;i<Math.max(1,month-1);i++) total+=WORLD_CLOCK.monthLengths[i] ?? 30; return total+Math.max(1,day); }
export function monthDayFromDayOfYear(dayOfYear:number){ let r=Math.max(1,Math.min(WORLD_CLOCK.daysPerYear,dayOfYear)); for(let month=1;month<=WORLD_CLOCK.monthLengths.length;month++){ const len=WORLD_CLOCK.monthLengths[month-1]??30; if(r<=len) return {month,day:r}; r-=len; } return {month:12,day:31}; }
export function getWorldTime(nowMs=Date.now()): WorldTime & {dayOfYear:number}{ const elapsed=Math.max(0,nowMs-WORLD_CLOCK.anchorUtcMs); const dayIndex=Math.floor(elapsed/WORLD_CLOCK.realMsPerKingdomDay); const dayProgress=(elapsed%WORLD_CLOCK.realMsPerKingdomDay)/WORLD_CLOCK.realMsPerKingdomDay; const totalMinutes=Math.floor(dayProgress*24*60); const hour=Math.floor(totalMinutes/60); const minute=totalMinutes%60; const anchor=dayOfYearFromMonthDay(WORLD_CLOCK.anchorMonth,WORLD_CLOCK.anchorDay); const absoluteIndex=anchor-1+dayIndex; const year=WORLD_CLOCK.kingdomYear+Math.floor(absoluteIndex/WORLD_CLOCK.daysPerYear); const dayOfYear=(absoluteIndex%WORLD_CLOCK.daysPerYear)+1; const {month,day}=monthDayFromDayOfYear(dayOfYear); let phase:WorldTime['phase']='éjszaka'; for(const [threshold,label] of PHASES){if(hour>=threshold) phase=label as WorldTime['phase'];} const season=seasonForMonth(month); const time=`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`; return {year,season,month,day,dayOfYear,hour,minute,phase,label:`${year}. év · ${season} · ${day}. nap · ${time}`,shortLabel:`${day}. nap · ${time}`}; }
