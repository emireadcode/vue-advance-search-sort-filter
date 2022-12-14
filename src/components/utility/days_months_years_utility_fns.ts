import { nextTick, triggerRef, } from "vue";
import type { YearRangeFirstSelectionType, YearSelectionType, MonthSelectionType, DaySelectionType, } from '../types/days_months_years_types';
import { type ShallowRef, type Ref, shallowRef, ref, } from "vue";

const 
  monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  isodayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
;

export function getOffset(el: HTMLLabelElement) {
  if (el) {
    const rect = el.getBoundingClientRect();
    return {
      x1: rect.left + window.scrollX,
      y1: rect.top + window.scrollY,
      x2: rect.left + window.scrollX + rect.width,
      y2: rect.top + window.scrollY + rect.height,
    };
  }
}

export function getMonthDimensions(months: ShallowRef<MonthSelectionType>) {
  nextTick(() => {
    for(let row in months.value) {
      for(let col in months.value[row]) {
        if((months.value[row][col] as MonthSelectionType[number][number][number][number]).ref) {
          let offset = getOffset((months.value[row][col] as MonthSelectionType[number][number][number][number]).ref);
          if (offset) {
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).x1 = offset.x1;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).y1 = offset.y1;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).x2 = offset.x2;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(months);
  });
}

export function getDayDimensions(days: ShallowRef<DaySelectionType>) {
  nextTick(() => {
    for(let day in days.value) {
      if((days.value[day] as unknown as DaySelectionType[number][number]).ref) {
        let offset = getOffset((days.value[day] as unknown as DaySelectionType[number][number]).ref);
        if (offset) {
          (days.value[day] as unknown as DaySelectionType[number][number]).x1 = offset.x1;
          (days.value[day] as unknown as DaySelectionType[number][number]).y1 = offset.y1;
          (days.value[day] as unknown as DaySelectionType[number][number]).x2 = offset.x2;
          (days.value[day] as unknown as DaySelectionType[number][number]).y2 = offset.y2;
        }
      }
    }
    triggerRef(days);
  });
}

export function getYearDimensions(years: ShallowRef<YearSelectionType>, page: Ref<number>) {
  nextTick(() => {
    for(let row in years.value[page.value]) {
      for(let col in years.value[page.value][row]) {
        if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number]).ref) {
          let offset = getOffset((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).ref);
          if (offset) {
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1 = offset.x1;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1 = offset.y1;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2 = offset.x2;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(years);
  });
}

export function calculateRemainder(max: number, min: number) {
  let diff = max - min, quotient = parseInt(""+(diff/15));
  return (((quotient + 1)*15) - diff) - 1;
}

export function whereisMouse(pointx: number, pointy: number, page: Ref<number>, years: ShallowRef<YearSelectionType>) {
  let result = {page: -1, year: -1, status: "DISABLE"}, found = false;
  for(let row in years.value[page.value]) {
    for(let col in years.value[page.value][row]) {
      if(
        (
          parseInt(row) === 0
          && (
            pointy <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1
            &&
            pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
          )
        )
        ||
        (
          parseInt(row) === Object.keys(years.value[page.value]).length - 1
          &&
          pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
          &&
          pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
        )
        ||
        (
          parseInt(row) !== Object.keys(years.value[page.value]).length - 1
          && (
            pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
            &&
            pointy >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1
            &&
            pointy <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y2
          )
        )
      ) {
        result = {
          page: page.value,
          year: (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year,
          status: (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status,
        };
        found = true;
        break;
      }
    }
    if(found) break;
  }
  return result;
}

export function mouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, event: { pageX: any; pageY: any; }, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (format.value === "RANGE") {
        if (rangefirstselection.value.year > -1) {
          let mousePointed = whereisMouse(event.pageX, event.pageY, page, years);
          if(mousePointed.status === "ENABLE" && mousePointed.year > -1 && mousePointed.page > -1) {
            for(let p in years.value) {
              for(let row in years.value[p]) {
                for(let col in years.value[p][row]) {
                  if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year > rangefirstselection.value.year) {
                    if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year <= mousePointed.year) {
                      (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'HIGHLIGHTED';
                    }
                    else {
                      if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                        (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                      }
                    }
                  }
                  else {
                    if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year < rangefirstselection.value.year) {
                      if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year >= mousePointed.year) {
                        (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'HIGHLIGHTED';
                      }
                      else {
                        if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                          (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false;
    }
    triggerRef(years);
  });
}

export function unTrackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  if (document.getElementById("yearbox")) {
    (document
      .getElementById("yearbox") as HTMLDivElement)
      .removeEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function trackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  if (document.getElementById("yearbox")) {
    (document.getElementById("yearbox") as HTMLDivElement).addEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function deselectAll(years: ShallowRef<YearSelectionType>) {
  for(let p in years.value) {
    for(let row in years.value[p]) {
      for(let col in years.value[p][row]) {
        (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
      }
    }
  }
  triggerRef(years);
}

export function addYear(page: Ref<number>, rangefirstselection: Ref<YearRangeFirstSelectionType> | undefined, loadingMovement: Ref<boolean> | undefined, rangecount: Ref<number> | undefined, multipleselectcount: Ref<number> | undefined, year: number, clickedorpasted: boolean, years: ShallowRef<YearSelectionType>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  let found = false;
  for(let p in years.value) {
    for(let row in years.value[p]) {
      for(let col in years.value[p][row]) {
        if(year === (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year) {
          if(format.value === 'RANGE') {
            if(rangecount && rangefirstselection && loadingMovement) {
              if(rangecount.value < 2) {
                if((years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'DESELECTED' || (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                  (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                  rangecount.value++;
                  if(rangecount.value === 1) {
                    rangefirstselection.value = { page: parseInt(p), year };
                    trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                  }
                  else {
                    unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                    rangefirstselection.value = { page: -1, year: -1 };
                  }
                }
                else {
                  (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                  rangefirstselection.value = { page: -1, year: -1 };
                  rangecount.value = 0;
                  unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                }
              }
              else {
                deselectAll(years);
                rangecount.value = 1;
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                rangefirstselection.value = { page: parseInt(p), year };
                trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
              }
            }
          }
          else {
            if(clickedorpasted) {
              if((years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'DESELECTED') {
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value++;
                }
              }
              else {
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value--;
                }
              }
            }
            else {
              (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
              page.value = parseInt(p);
            }
          }
          found = true;
          break;
        }
      }
      if(found) break;
    }
    if(found) break;
  }
  
  triggerRef(years);
}

export function fillYearArray(
  _maxyear: number, 
  minyear: number, 
  yearselectionformat: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN",
  page: Ref<number>
) {
  let index = 0, row = 0, col = 0, counter = 0, years = shallowRef<YearSelectionType>();

  //let remainder = calculateRemainder(2022, 2000), maxyear = 2022 + remainder;
  //for(let year=2000; year<=maxyear; year++) {

  let 
    remainder = calculateRemainder(
      _maxyear, 
      minyear
    ), 
    maxyear = _maxyear + remainder
  ;
  
  for(let year=minyear; year<=maxyear; year++) {
    if(years.value) {
      if(index in years.value) {
        if(row in years.value[index]) {
          years.value[index][row] = {
            ...years.value[index][row],
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          } as YearSelectionType[number][number];
        }
        else {
          years.value[index] = {
            ...years.value[index],
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          } as YearSelectionType[number];
        }
        col++;
      }
      else {
        years.value = {
          ...years.value,
          [index]: {
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          }
        } as YearSelectionType;
        col++;
      }
    }
    else {
      years.value = {
        [index]: {
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          }
        }
      } as unknown as YearSelectionType;
      col++;
    }
    if(col === 5) {
      row++;
      col = 0;
      counter++;
    }
    if(counter === 3) {
      index++;
      counter = 0;
      row = 0;
    }
  }

  page.value = Object.keys(years.value as YearSelectionType).length-1;

  if(yearselectionformat === 'RANGE') {
    nextTick(() => {
      getYearDimensions(years as ShallowRef<YearSelectionType>, page as Ref<number>);
    });
  }
  
  triggerRef(years);

  return years;
}

export function fillMonthArray(monthselectionformat: Ref<"RANGE" | "MULTIPLE-OR-SINGLE">) {
  let row = 0, col = 0, months = shallowRef<MonthSelectionType>();
  for(let index=0; index<monthNames.length; index++) {
    if(months.value) {
      if(row in months.value) {
        (months as ShallowRef<MonthSelectionType>).value[row] = {
          ...months.value[row],
          [col]: {
            monthnumber: index,
            monthname: monthNames[index],
            selected: "DESELECTED",
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          },
        } as MonthSelectionType[number];
        col++;
      }
      else {
        months.value = {
          ...months.value,
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              monthname: monthNames[index],
              monthnumber: index,
              selected: "DESELECTED",
            }
          },
        } as MonthSelectionType;
        col++;
      }
    }
    else {
      months.value = {
        [row]: {
          [col]: {
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            monthname: monthNames[index],
            monthnumber: index,
            selected: "DESELECTED",
          }
        },
      } as unknown as MonthSelectionType;
      col++
    }
    if(col === 4) {
      row++;
      col = 0;
    }
  }
  if(monthselectionformat.value === "RANGE") {
    nextTick(() => {
      getMonthDimensions(months as ShallowRef<MonthSelectionType>);
    });
  }
  triggerRef(months);

  return months;
}

export function fillDayArray(isoweek: boolean, dayselectionformat: Ref<"RANGE" | "MULTIPLE-OR-SINGLE">) {
  let days = shallowRef<DaySelectionType>();
  for(let index=0; index< ((isoweek)? isodayNames.length: dayNames.length); index++) {
    days.value = {
      ...days.value,
      [index]: {
        ref: null,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        name: (isoweek)? isodayNames[index] : dayNames[index],
        selected: "DESELECTED",
      },
    } as DaySelectionType;
  }

  if(dayselectionformat.value === "RANGE") {
    nextTick(() => getDayDimensions(days as ShallowRef<DaySelectionType>));
  }
  triggerRef(days);

  return days;
}