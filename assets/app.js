/* Park & Co Lawyers · Partner Visas (820/801 · 309/100 · 300) & Student/Graduate Visas (500 · 485) Navigator
   Embedded ParkCoDates Canonical Australian Date & Public Holiday Utility (2026–2027) */
(function (root) {
  "use strict";

  /* ==========================================================================
     1. CANONICAL AUSTRALIAN STATUTORY DATE & PUBLIC HOLIDAY UTILITY
     ========================================================================== */
  var NATIONAL_HOLIDAYS = {
    "2026-01-01": "New Year's Day",
    "2026-01-26": "Australia Day",
    "2026-04-03": "Good Friday",
    "2026-04-06": "Easter Monday",
    "2026-12-25": "Christmas Day",
    "2026-12-28": "Boxing Day (Additional Day)",
    "2027-01-01": "New Year's Day",
    "2027-01-26": "Australia Day",
    "2027-03-26": "Good Friday",
    "2027-03-29": "Easter Monday",
    "2027-04-26": "Anzac Day (Observed)",
    "2027-12-27": "Christmas Day (Additional Day)",
    "2027-12-28": "Boxing Day (Additional Day)"
  };

  var STATE_HOLIDAYS = {
    QLD: {
      "2026-04-04": "Easter Saturday",
      "2026-04-25": "Anzac Day",
      "2026-05-04": "Labour Day (QLD)",
      "2026-10-05": "King's Birthday (QLD)",
      "2027-05-03": "Labour Day (QLD)",
      "2027-10-04": "King's Birthday (QLD)"
    },
    NSW: {
      "2026-04-25": "Anzac Day",
      "2026-06-08": "King's Birthday (NSW)",
      "2026-10-05": "Labour Day (NSW)",
      "2027-06-14": "King's Birthday (NSW)",
      "2027-10-04": "Labour Day (NSW)"
    },
    VIC: {
      "2026-03-09": "Labour Day (VIC)",
      "2026-04-25": "Anzac Day",
      "2026-06-08": "King's Birthday (VIC)",
      "2026-11-03": "Melbourne Cup Day (VIC)",
      "2027-03-08": "Labour Day (VIC)",
      "2027-06-14": "King's Birthday (VIC)",
      "2027-11-02": "Melbourne Cup Day (VIC)"
    }
  };

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function parseIsoLocal(isoStr) {
    if (!isoStr || typeof isoStr !== "string") return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoStr.trim());
    if (!m) return null;
    var y = parseInt(m[1], 10);
    var mo = parseInt(m[2], 10) - 1;
    var dy = parseInt(m[3], 10);
    var d = new Date(y, mo, dy, 12, 0, 0, 0);
    if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== dy) return null;
    return d;
  }

  function formatIsoLocal(d) {
    if (!d || isNaN(d.getTime())) return "-";
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function todayBrisbaneIso() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Australia/Brisbane",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).formatToParts(new Date());
      var map = {};
      for (var i = 0; i < parts.length; i++) map[parts[i].type] = parts[i].value;
      if (map.year && map.month && map.day) return map.year + "-" + map.month + "-" + map.day;
    } catch (_) {}
    return formatIsoLocal(new Date());
  }

  function getHolidayName(isoStr, stateCode) {
    var st = (stateCode || "QLD").toUpperCase();
    if (NATIONAL_HOLIDAYS[isoStr]) return NATIONAL_HOLIDAYS[isoStr];
    if (STATE_HOLIDAYS[st] && STATE_HOLIDAYS[st][isoStr]) return STATE_HOLIDAYS[st][isoStr];
    return null;
  }

  function isBusinessDay(d, stateCode) {
    var dow = d.getDay();
    if (dow === 0 || dow === 6) return false;
    return !getHolidayName(formatIsoLocal(d), stateCode);
  }

  function addCalendarDays(d, days) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, 12, 0, 0, 0);
  }

  function addYearsMonthsClamped(isoStr, years, months, extraDays) {
    var start = parseIsoLocal(isoStr);
    if (!start) return null;
    var targetYear = start.getFullYear() + (years || 0);
    var rawMonth = start.getMonth() + (months || 0);
    targetYear += Math.floor(rawMonth / 12);
    var targetMonth = ((rawMonth % 12) + 12) % 12;
    var maxDay = new Date(targetYear, targetMonth + 1, 0, 12, 0, 0, 0).getDate();
    var clampedDay = Math.min(start.getDate(), maxDay);
    var base = new Date(targetYear, targetMonth, clampedDay, 12, 0, 0, 0);
    if (extraDays) base = addCalendarDays(base, extraDays);
    return base;
  }

  function computeSafePriorBusinessIso(statutoryIso, daysBefore, stateCode) {
    var stat = parseIsoLocal(statutoryIso);
    if (!stat) return "-";
    var safe = addCalendarDays(stat, -(daysBefore || 14));
    var guard = 0;
    while (!isBusinessDay(safe, stateCode || "QLD") && guard < 10) {
      safe = addCalendarDays(safe, -1);
      guard += 1;
    }
    return formatIsoLocal(safe);
  }

  function diffDaysBetweenIso(fromIso, toIso) {
    var a = parseIsoLocal(fromIso);
    var b = parseIsoLocal(toIso);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  var ParkCoDates = {
    parseIsoLocal: parseIsoLocal,
    formatIsoLocal: formatIsoLocal,
    todayBrisbaneIso: todayBrisbaneIso,
    getHolidayName: getHolidayName,
    isBusinessDay: isBusinessDay,
    addCalendarDays: addCalendarDays,
    addYearsMonthsClamped: addYearsMonthsClamped,
    computeSafePriorBusinessIso: computeSafePriorBusinessIso,
    diffDaysBetweenIso: diffDaysBetweenIso
  };
  root.ParkCoDates = ParkCoDates;

  /* ==========================================================================
     2. HUMAN-READABLE ENUM LABELS & TRANSLATIONS (KO / EN)
     ========================================================================== */
  var currentLang = "ko";
  var currentMode = "partner";

  var LABELS = {
    location: {
      onshore_substantive: {
        ko: "호주 내 체류 · 유효 본비자 보유 (820/801 트랙)",
        en: "Onshore in Australia · Valid Substantive Visa Held (820/801 Track)"
      },
      onshore_bva_within28: {
        ko: "호주 내 체류 · 브리징 비자 보유 또는 본비자 만료 28일 이내 (820/801 · Schedule 3 적용)",
        en: "Onshore in Australia · Bridging Visa or Within 28 Days of Expiry (820/801 · Schedule 3 Applies)"
      },
      onshore_expired_over28: {
        ko: "호주 내 체류 · 마지막 본비자 만료 28일 초과 경과 (820/801 · Schedule 3 3001·3004 적용)",
        en: "Onshore in Australia · Over 28 Days Past Substantive Expiry (820/801 · Schedule 3 3001 & 3004)"
      },
      offshore_married_defacto: {
        ko: "호주 외 체류 · 법률혼 또는 사실혼 (오프쇼어 309/100 트랙)",
        en: "Offshore Outside Australia · Married or De Facto (309/100 Track)"
      },
      offshore_fiance: {
        ko: "호주 외 체류 · 약혼자 비자 후 온쇼어 전환 (300 → 820/801 트랙)",
        en: "Offshore Fiancé(e) Visa Followed by Onshore Transition (300 → 820/801 Track)"
      },
      onshore_300_holder: {
        ko: "호주 내 체류 · 약혼자 비자(300) 보유 중 혼인 완료 (820/801 전환)",
        en: "Onshore Subclass 300 Holder Married to Sponsor (820/801 Transition)"
      }
    },
    relDuration: {
      under1: { ko: "1년 미만", en: "Under 12 months" },
      "1to2": { ko: "1년 이상 ~ 2년 미만", en: "1 to under 2 years" },
      "2to3": { ko: "2년 이상 ~ 3년 미만", en: "2 to under 3 years" },
      over3: { ko: "3년 이상 장기 관계 (reg 1.03)", en: "3+ years long-term relationship (reg 1.03)" }
    },
    sponsorHist: {
      clean: { ko: "과거 파트너 스폰서십 이력 없음 (초회 스폰서)", en: "No prior partner sponsorship history (First-time sponsor)" },
      within_5yrs_or_2x: { ko: "최근 5년 내 파트너 초청·피초청 또는 평생 2회 도달 (reg 1.20J 면제 필요)", en: "Partner sponsorship within 5 years or 2-lifetime cap reached (reg 1.20J waiver required)" },
      contrib_parent_5yr: { ko: "스폰서 본인 최근 5년 내 기여제 부모비자(143/864) 승인 (reg 1.20KA 제한)", en: "Sponsor granted Contributory Parent visa (143/864) within last 5 years (reg 1.20KA bar)" }
    },
    relLegal: {
      legally_married: { ko: "법적 혼인신고 완료 (s 5F 법률혼 배우자)", en: "Legally Married Spouse (s 5F)" },
      state_registered: { ko: "호주 주정부 시민 관계등록 완료/예정 (Relationship Register)", en: "Australian State/Territory Registered Relationship" },
      unregistered_defacto: { ko: "혼인·관계등록 없는 일반 사실혼 동거 (Unregistered De Facto)", en: "Unregistered De Facto Cohabitation" }
    },
    pillars: {
      strong4: { ko: "4대 증빙 기둥(재정·주거·사회·헌신) 충실", en: "All 4 Evidentiary Pillars Strong" },
      weak_fin_house: { ko: "일부 증빙 보완 필요 (공동 계좌 실사용·임대차 명의 등)", en: "Evidentiary Gaps Present (Joint finance / lease records)" }
    },
    gradStream: {
      "485_phew": { ko: "졸업생 비자 Subclass 485 · Post-Higher Education Work ($5,750)", en: "Subclass 485 · Post-Higher Education Work ($5,750)" },
      "485_pvew": { ko: "졸업생 비자 Subclass 485 · Post-Vocational Education Work ($5,750)", en: "Subclass 485 · Post-Vocational Education Work ($5,750)" },
      "485_second": { ko: "졸업생 비자 Subclass 485 · Second Post-Higher Education Work ($2,265)", en: "Subclass 485 · Second Post-Higher Education Work ($2,265)" },
      "500_student": { ko: "학생 비자 Subclass 500 (기본 신청비 $2,500)", en: "Student Visa Subclass 500 (Base VAC $2,500)" }
    },
    gradHeldVisa: {
      "500_current": { ko: "유효한 학생 비자(Subclass 500) 보유", en: "Valid Student Visa (Subclass 500) Held" },
      bva_after_500: { ko: "학생 비자(500) 만료 후 6개월 이내 브리징 비자(BVA/BVB) 보유", en: "Bridging Visa (BVA/BVB) Within 6 Months of Subclass 500 Expiry" },
      "485_current": { ko: "유효한 졸업생 비자(Subclass 485) 보유", en: "Current Temporary Graduate Visa (Subclass 485) Held" },
      "600_visitor": { ko: "방문·관광 비자(600 / 601 ETA / 651 eVisitor) 보유", en: "Visitor / ETA / eVisitor Visa (600 / 601 / 651) Held" },
      "417_462_whm": { ko: "워킹홀리데이 비자(417 / 462) 보유", en: "Working Holiday Visa (417 / 462) Held" },
      offshore_outside: { ko: "호주 외 해외 체류 중 (오프쇼어 신청)", en: "Outside Australia (Offshore Application)" }
    },
    gradQual: {
      bachelor_coursework: { ko: "학사 · 수업석사 · 디플로마 과정 (만 35세 상한)", en: "Bachelor / Coursework Masters / Diploma (Max Age 35)" },
      research_phd: { ko: "연구석사(Masters by Research) · 박사(PhD) · 홍콩/BNO 여권 (만 50세 미만)", en: "Masters by Research / PhD / HK-BNO Passport (Under Age 50)" }
    }
  };

  function getLabel(group, key, lang) {
    var l = lang === "en" ? "en" : "ko";
    if (LABELS[group] && LABELS[group][key]) return LABELS[group][key][l];
    return l === "en" ? "Not selected" : "미선택";
  }

  var KO_TRANSLATIONS = {
    brandTag: "파트너(820·309) & 졸업생(500·485) 내비게이터",
    navM1: "파트너 비자(820·309)",
    navM2: "혼인·관계등록·4대기둥",
    navGradTab: "학생(500)·졸업생(485)",
    navM4: "상담 브리프",
    ecoFaqLink: "이민 FAQ",
    ecoSvcConsult: "공식 문의 허브",
    heroTitle: "호주 파트너 비자(820·309·300) & 학생·졸업생 비자(500·485) 통합 진단기",
    heroLead: "파트너 비자 혼인·관계등록·Schedule 3 요건과 학생·졸업생 비자 연령·비자호핑·수료 후 6개월 마감일을 한 화면에서 점검합니다.",
    btnSampleFill: "예시 조건 채우기",
    btnResetAll: "초기화",
    tabPartnerTitle: "파트너 비자 (820·309 · 사실혼 · Schedule 3)",
    tabPartnerSub: "혼인·주정부 관계등록(reg 2.03A) · Schedule 3 웨이버 · 신청비 $11,710",
    tabGradTitle: "학생 비자(500) · 졸업생 비자(485)",
    tabGradSub: "온쇼어 전환 제한 · 만 35세(석박사 50세) 연령 상한 · 수료 후 6개월 법정 기한",
    m1Title: "1. 현재 체류·비자 상태 기반 파트너 비자 트랙 · Schedule 3 · 신청비 진단",
    m1Desc: "현재 비자 상태를 한 번만 선택하면 권고 서브클래스(820/309/300)와 직행 영주권(reg 1.03) 대상 여부 및 Schedule 3 적용 여부가 모순 없이 함께 계산됩니다.",
    m1FormHeading: "체류 위치·소지 비자 · 관계 기간 · 스폰서 이력 선택",
    lblPvLoc: "1. 현재 주신청자 체류 위치 및 소지 비자 상태 (단일 기준)",
    optLocPrompt: "-- 현재 체류 위치 및 소지 비자 선택 --",
    optLocOnshoreSub: "호주 내 체류 · 유효한 본비자(485, 500, 417, 600, 482 등 · 8503 없음) 보유",
    optLocOnshoreBva: "호주 내 체류 · 브리징 비자(BVA/BVB/BVC) 보유 또는 본비자 만료 후 28일 이내",
    optLocExpired28: "호주 내 체류 · 마지막 본비자 만료 후 28일 초과 경과 (BVE 또는 무비자)",
    optLocOffshore: "한국 등 호주 외 체류 · 법률혼 또는 사실혼 (Subclass 309/100 신청)",
    optLocFiance: "한국 등 호주 외 체류 · 약혼자 비자 신청 (Subclass 300 → 입국·혼인 후 820 전환)",
    optLoc300Holder: "호주 내 체류 · 유효한 약혼자 비자(Subclass 300) 보유 중 스폰서와 혼인 완료",
    lblPvRelYears: "2. 진실한 혼인·동거 관계 지속 기간",
    optDurU1: "1년 미만 (Under 12 months)",
    optDur1to2: "1년 이상 ~ 2년 미만 (1 to <2 years)",
    optDur2to3: "2년 이상 ~ 3년 미만 (2 to <3 years)",
    optDur3p: "3년 이상 장기 관계 (reg 1.03 Long-term relationship)",
    lblPvChildCount: "3. 스폰서와의 공동 자녀 유무",
    optChildNo: "공동 자녀 없음",
    optChildYes: "공동 자녀 있음 (2년 이상 관계 시 801/100 직행 영주권 대상 · reg 1.03(b))",
    lblSponsorHist: "4. 스폰서(배우자)의 과거 파트너 초청·피초청 이력 (reg 1.20J / 1.20KA)",
    optSpClean: "과거 파트너 스폰서십 이력 없음 (초회 스폰서)",
    optSpBarred: "최근 5년 내 파트너 초청·피초청 이력 있음 또는 평생 2회 초청 완료 (reg 1.20J 웨이버 필수)",
    optSpParent: "스폰서 본인이 최근 5년 내 기여제 부모비자(143/864) 승인 이력 있음 (reg 1.20KA 제한)",
    m1ResultHeading: "파트너 트랙 · 신청비(VAC) · Schedule 3 통합 판정",
    m2Title: "2. 법적 혼인 · 주정부 관계등록 · 사실혼 12개월 동거 및 4대 증빙 기둥 진단",
    m2Desc: "법적 혼인 부부(s 5F)와 지정 6개 주·준주 관계등록 커플(reg 2.03A(5))은 12개월 의무 동거 요건이 적용되지 않거나 면제됩니다(서호주 WA·노던준주 NT는 등록 면제 불가).",
    m2FormHeading: "혼인·관계등록 여부 · 거주 주 · 동거 기간 · 4대 기둥 점검",
    lblRelLegalStatus: "1. 법적 혼인신고 또는 호주 주정부 관계등록(Relationship Register) 여부",
    optRelLegalPrompt: "-- 혼인신고 · 관계등록 여부 선택 --",
    optRelMarried: "법적 혼인신고 완료 (호주 결혼증명서 또는 한국 혼인관계증명서 보유 · s 5F)",
    optRelStateReg: "호주 주정부 시민 관계등록 완료 또는 결정 전 등록 예정 (Relationship Register)",
    optRelUnregDefacto: "혼인신고 및 관계등록 없는 일반 사실혼 동거 (Unregistered De Facto)",
    lblDfState: "2. 커플 거주 주/준주 (주정부 관계등록 면제 가능 여부 확인)",
    optStQLD: "QLD (Queensland · Civil Partnership 등록 시 12개월 면제 가능)",
    optStNSW: "NSW (New South Wales · Relationship Register 등록 시 12개월 면제 가능)",
    optStVIC: "VIC (Victoria · Domestic Relationship 등록 시 12개월 면제 가능)",
    optStSA: "SA (South Australia · Registered Relationship 12개월 면제 가능)",
    optStACT: "ACT (Civil Union / Domestic Relationship 12개월 면제 가능)",
    optStTAS: "TAS (Significant Relationship Deed 12개월 면제 가능)",
    optStWA: "WA (Western Australia · 연방 이민법상 12개월 면제 효력 없음)",
    optStNT: "NT (Northern Territory · 주정부 관계등록 제도 없음 · 12개월 필수)",
    lblDfMonths: "3. 현재까지 실제 동거한 개월 수",
    lblDfPillars: "4. reg 1.15A / 1.09A 4대 증빙 기둥(재정·주거·사회·헌신) 준비 수준",
    optPillar4: "4대 기둥 모두 충실 (공동 계좌 실사용 + 공동 임대차/공과금 + Form 888 + 유언장/Super 수익자 지정)",
    optPillarWeak: "일부 보완 필요 (공동 계좌 미사용 또는 임대차계약서 단독 명의 등)",
    m2ResultHeading: "혼인·사실혼 요건 적격 판정 & 4대 기둥 보완 지침",
    gradTitle: "학생 비자(Subclass 500) 온쇼어 전환 & 졸업생 비자(Subclass 485) 적격·마감일 계산기",
    gradDesc: "2024년 7월 시행 온쇼어 비자호핑 금지 규정과 졸업생 비자 만 35세(연구석사·박사 50세 미만) 연령 제한 및 학업 수료일 기준 6개월 법정 마감일을 점검합니다.",
    gradFormHeading: "목표 비자 · 현재 보유 비자 · 연령 · 학업 수료일 입력",
    lblGradStream: "1. 점검하려는 학생·졸업생 비자 스트림",
    optGradPrompt: "-- 점검할 비자 스트림 선택 --",
    optGrad485Phew: "졸업생 비자 Subclass 485 · Post-Higher Education Work (학사·석사·박사 학위 · 신청비 $5,750)",
    optGrad485Pvew: "졸업생 비자 Subclass 485 · Post-Vocational Education Work (MLTSSL 직종 기술평가 · 신청비 $5,750)",
    optGrad485Second: "졸업생 비자 Subclass 485 · Second Post-Higher Education Work (지방 학업·거주 연장 · 신청비 $2,265)",
    optGrad500: "학생 비자 Subclass 500 (고등교육·직업교육 신규/연장 · 기본 신청비 $2,500)",
    lblGradCurrentVisa: "2. 현재 신청자가 보유 중인 비자",
    optHold500: "유효한 학생 비자 (Subclass 500)",
    optHoldBva500: "학생 비자(500) 만료 후 6개월 이내 브리징 비자(BVA/BVB) 보유",
    optHold485: "유효한 졸업생 비자 (Subclass 485 · 온쇼어 500 전환 금지 대상)",
    optHold600: "방문·관광 비자 (600 / 601 ETA / 651 eVisitor · 온쇼어 500 전환 금지 대상)",
    optHoldWhm: "워킹홀리데이 비자 (417 / 462 · 호주 학업요건 충족 여부 확인 필요)",
    optHoldOffshore: "호주 외 해외 체류 중 (오프쇼어 신청)",
    lblGradQual: "3. 호주 학위·과정 구분 (연령 상한 판정용)",
    optQualBach: "학사(Bachelor) · 수업석사(Masters by Coursework) · 준학사/디플로마 (만 35세 상한)",
    optQualPhd: "연구석사(Masters by Research) 또는 박사(PhD) · 또는 홍콩/BNO 여권 (만 50세 미만 상한)",
    lblGradAge: "4. 비자 접수 시점 만 나이 (Age at Lodgement)",
    lblGradCompDate: "5. 공식 학업 수료 완료일 (Completion Letter 명시 완료일 · 485 6개월 마감 계산)",
    gradResultHeading: "500·485 적격 여부 · 신청비(VAC) · 6개월 법정 마감일 병기",
    ctaHeading: "법무법인 박앤코 파트너 · 학생 · 졸업생 비자 상담 브리프",
    ctaSub: "공식 이메일 <code>enquiry@parkcolawyers.com</code> 또는 통합 문의 허브로 바로 전달하실 수 있습니다.",
    btnSendEmail: "브리프 복사 & 공식 상담 신청",
    btnCopyBrief: "브리프 복사",
    btnPrint: "진단서 인쇄",
    citTitle: "영주권 취득 후 호주 시민권 단계별 실제 소요기간(p25~p90) & 820·485·시민권 행정재심기구(ART) 통계",
    citDesc: "호주 시민권(Conferral · Descent · Evidence) 공식 4분위 심사 소요기간(Conferral 미결 재고 53,298건)과 파트너 820(본안 85.16% 인용) · 졸업생 485(본안 93.30% 인용) · 시민권 거절(본안 58.82% 인용) 행정재심기구(ART) 통계를 요약합니다.",
    thCitStream: "시민권 신청 유형 및 심사 단계",
    thCitP25: "25% 완료",
    thCitP50: "50% 완료 (중앙값)",
    thCitP75: "75% 완료",
    thCitP90: "90% 완료",
    citBtnArt: "행정재심기구(ART) 거절 재심 검토",
    citBtnEmergency: "비자응급실 (s 57 · Schedule 3 · PIC 4020 진단)",
    xBtnDiagnose: "485 이후 기술·스폰서·DAMA 6단계 진단",
    accSpecSummary: "공인 이민법 전문변호사 안내 및 핵심 법정 기준 요약",
    statLabelVac: "파트너 비자 기본 신청비",
    statSubVac: "300→820 전환 $1,955 · 미성년 자녀 $2,935",
    statLabelGradVac: "학생(500) · 졸업생(485) 신청비",
    statSubGradVac: "FY2026–27 공식 VAC (Second 485 $2,265)",
    statLabelDirectPr: "파트너 직행 영주권 요건",
    statValDirectPr: "3년 / 2년+자녀",
    statLabelSponsorCap: "스폰서 초청 한도 (reg 1.20J)",
    statValSponsorCap: "평생 2회 · 5년",
    statSubSponsorCap: "불가피한 사유 입증 시 면제 가능",
    specName: "박창민 대표변호사 (Chang Min Park · Legal Practitioner Director)",
    specMeta: "법무법인 박앤코 (Underwood QLD) · 이메일: <a href=\"mailto:enquiry@parkcolawyers.com\">enquiry@parkcolawyers.com</a> · 상담 허브: <a class=\"parkco-svc-link\" href=\"https://parklawyers.com.au/links/?lang=ko\" data-ko-href=\"https://parklawyers.com.au/links/?lang=ko\" data-en-href=\"https://parklawyers.com.au/links/?lang=en\" target=\"_blank\" rel=\"noopener\">parklawyers.com.au/links</a>",
    pollerTitle: "1차 이민법 시행령 · 연방 이민성 수수료 API(GetPriceList) · 행정재심기구(ART) 실시간 검증 (SHA-256)",
    pollerDesc: "연방 이민성 비자 수수료 실시간 JSON API(<code>GetPriceList</code>)와 이민법 시행령 원문(<code>F1996B03551</code>) 및 행정재심기구(ART) 공식 통계를 자동 폴링하여 SHA-256 해시와 최신 법정 수수료를 검증합니다.",
    thPollerSource: "1차 출처 및 검증 대상",
    thPollerCitation: "근거 조문 · 엔드포인트",
    thPollerFigures: "실시간 추출 핵심 수치",
    thPollerHash: "SHA-256 해시 · 용량",
    thPollerStatus: "폴링 검증 상태",
    footerFirmName: "법무법인 박앤코 (PNC Legal Pty Ltd t/a Park & Co Lawyers)",
    footerNotice: "이 내비게이터는 호주 이민법 시행령(Migration Regulations 1994) 1차 출처를 바탕으로 일반 법률 정보를 안내하며 정식 수임 계약 전 개별 법률 자문을 대신하지 않습니다. 파트너 비자($11,710 VAC)와 Schedule 3 웨이버 및 학생·졸업생 비자(500·485) 접수 전에 박창민 대표변호사(Legal Practitioner Director · QLS 공인 이민법 전문변호사 · <a href=\"mailto:enquiry@parkcolawyers.com\" style=\"color:#F4DC9C;font-weight:700;\">enquiry@parkcolawyers.com</a> · <a class=\"parkco-svc-link\" href=\"https://parklawyers.com.au/links/?lang=ko\" data-ko-href=\"https://parklawyers.com.au/links/?lang=ko\" data-en-href=\"https://parklawyers.com.au/links/?lang=en\" target=\"_blank\" rel=\"noopener\" style=\"color:#F4DC9C;font-weight:700;\">parklawyers.com.au/links</a>)와 상담하시기 바랍니다.",
    footerOfficialLabel: "공식 문의:",
    footerLinksHub: "공식 상담 신청 허브 (parklawyers.com.au/links)",
    footerHubLink: "← 박앤코 법률·비자 통합 허브",
    footerFaqLink: "호주이민 실무 FAQ (faq.immispecialist.com) →"
  };

  var EN_TRANSLATIONS = {
    brandTag: "Partner (820·309) & Graduate (500·485) Navigator",
    navM1: "Partner Visas (820·309)",
    navM2: "Marriage · Reg · 4 Pillars",
    navGradTab: "Student (500) · Graduate (485)",
    navM4: "Legal Brief",
    ecoFaqLink: "Immi FAQ",
    ecoSvcConsult: "Official Inquiry Hub",
    heroTitle: "Australia Partner Visas (820·309·300) & Student/Graduate Visas (500·485) Navigator",
    heroLead: "Evaluate Partner Visa marriage/registration exemptions & Schedule 3 triggers alongside Student/Graduate onshore bars, age limits, and 6-month completion deadlines.",
    btnSampleFill: "Load Sample Case",
    btnResetAll: "Reset",
    tabPartnerTitle: "Partner Visas (820·309 · De Facto · Schedule 3)",
    tabPartnerSub: "Marriage & State Registration (reg 2.03A) · Schedule 3 Waiver · Base VAC $11,710",
    tabGradTitle: "Student Visa (500) · Graduate Visa (485)",
    tabGradSub: "Onshore Hopping Bars · Age 35 (50 Research/PhD) Cap · 6-Month Completion Deadline",
    m1Title: "1. Single-Source Partner Visa Track, Schedule 3 & VAC Assessment",
    m1Desc: "Select your current visa status once to derive your recommended Partner subclass (820/309/300), Direct PR eligibility (reg 1.03), and Schedule 3 applicability without contradiction.",
    m1FormHeading: "Select Location/Visa Status, Relationship Duration & Sponsor History",
    lblPvLoc: "1. Primary Applicant Current Location & Visa Status (Single Source)",
    optLocPrompt: "-- Select current location & visa status --",
    optLocOnshoreSub: "Onshore in Australia · Valid Substantive Visa (e.g. 485, 500, 417, 600, 482 without 8503)",
    optLocOnshoreBva: "Onshore in Australia · Bridging Visa (BVA/BVB/BVC) or Within 28 Days of Substantive Expiry",
    optLocExpired28: "Onshore in Australia · Over 28 Days Past Last Substantive Visa Expiry (BVE or Unlawful)",
    optLocOffshore: "Offshore Outside Australia · Married or De Facto (Subclass 309/100)",
    optLocFiance: "Offshore Outside Australia · Fiancé(e) Visa (Subclass 300 → Onshore 820 after marriage)",
    optLoc300Holder: "Onshore in Australia · Valid Subclass 300 Holder Married to Sponsor",
    lblPvRelYears: "2. Duration of Genuine Spouse / De Facto Relationship",
    optDurU1: "Under 12 months",
    optDur1to2: "1 to under 2 years",
    optDur2to3: "2 to under 3 years",
    optDur3p: "3+ years (reg 1.03 Long-term relationship)",
    lblPvChildCount: "3. Dependent Child of the Relationship?",
    optChildNo: "No shared child",
    optChildYes: "Yes · Shared child (Direct 801/100 PR eligible at 2+ years · reg 1.03(b))",
    lblSponsorHist: "4. Sponsor's Prior Partner Sponsorship History (reg 1.20J / 1.20KA)",
    optSpClean: "First-time sponsor (No prior partner sponsorships)",
    optSpBarred: "Sponsored/was sponsored within last 5 years OR 2 lifetime sponsorships (reg 1.20J waiver required)",
    optSpParent: "Sponsor granted Contributory Parent visa (143/864) within last 5 years (reg 1.20KA bar)",
    m1ResultHeading: "Integrated Partner Track, VAC & Schedule 3 Verdict",
    m2Title: "2. Legal Marriage, State Relationship Registration, 12-Month Cohabitation & 4 Pillars",
    m2Desc: "Legally married couples (s 5F) and couples registered in the 6 prescribed states/territories (reg 2.03A(5)) are exempt from the 12-month cohabitation rule (WA and NT excluded).",
    m2FormHeading: "Check Legal Marriage / Registration, State, Cohabitation & 4 Pillars",
    lblRelLegalStatus: "1. Legal Marriage or Australian State Relationship Registration Status",
    optRelLegalPrompt: "-- Select marriage or relationship registration status --",
    optRelMarried: "Legally Married (Australian or overseas marriage certificate · s 5F)",
    optRelStateReg: "Australian State/Territory Relationship Registration Completed or Planned",
    optRelUnregDefacto: "Unregistered De Facto Cohabitation (Neither married nor state-registered)",
    lblDfState: "2. State / Territory of Residence (Prescribed Registration Check)",
    optStQLD: "QLD (Queensland · Civil Partnership waives 12-month rule)",
    optStNSW: "NSW (New South Wales · Relationship Register waives 12-month rule)",
    optStVIC: "VIC (Victoria · Domestic Relationship Register waives 12-month rule)",
    optStSA: "SA (South Australia · Registered Relationship waives 12-month rule)",
    optStACT: "ACT (Civil Union / Domestic Relationship waives 12-month rule)",
    optStTAS: "TAS (Significant Relationship Deed waives 12-month rule)",
    optStWA: "WA (Western Australia · Does NOT waive 12-month rule under reg 2.03A)",
    optStNT: "NT (Northern Territory · No state register; 12 months mandatory)",
    lblDfMonths: "3. Completed Months of Cohabitation",
    lblDfPillars: "4. reg 1.15A / 1.09A 4 Evidentiary Pillars Readiness",
    optPillar4: "All 4 Pillars Strong (Active joint account + joint lease/bills + Form 888s + Will/Super nomination)",
    optPillarWeak: "Evidentiary Gaps Present (Dormant joint account or single-name lease)",
    m2ResultHeading: "Marriage / De Facto Eligibility Verdict & 4 Pillars Action Plan",
    gradTitle: "Student Visa (Subclass 500) Onshore Bars & Graduate Visa (Subclass 485) Calculator",
    gradDesc: "Check the July 2024 onshore Student visa-hopping ban, Subclass 485 age caps (35 general / under 50 Research Masters & PhD), and the strict 6-month completion deadline.",
    gradFormHeading: "Enter Target Visa Stream, Current Visa, Age & Completion Date",
    lblGradStream: "1. Target Student or Graduate Visa Stream",
    optGradPrompt: "-- Select target visa stream --",
    optGrad485Phew: "Subclass 485 · Post-Higher Education Work (Bachelor / Masters / PhD · Base VAC $5,750)",
    optGrad485Pvew: "Subclass 485 · Post-Vocational Education Work (MLTSSL skills assessment · Base VAC $5,750)",
    optGrad485Second: "Subclass 485 · Second Post-Higher Education Work (Regional extension · Base VAC $2,265)",
    optGrad500: "Student Visa Subclass 500 (Higher Ed / VET · Base VAC $2,500)",
    lblGradCurrentVisa: "2. Current Visa Held by Applicant",
    optHold500: "Valid Student Visa (Subclass 500)",
    optHoldBva500: "Bridging Visa (BVA/BVB) Within 6 Months of Subclass 500 Expiry",
    optHold485: "Valid Graduate Visa (Subclass 485 · Barred from onshore 500)",
    optHold600: "Visitor / ETA / eVisitor Visa (600 / 601 / 651 · Barred from onshore 500)",
    optHoldWhm: "Working Holiday Visa (417 / 462 · Check recent 500 holding rule)",
    optHoldOffshore: "Outside Australia (Offshore Application)",
    lblGradQual: "3. Australian Qualification Level (Age Cap Rule)",
    optQualBach: "Bachelor · Masters by Coursework · Diploma/Trade (Max Age 35)",
    optQualPhd: "Masters by Research · PhD · Hong Kong / BNO Passport (Under Age 50)",
    lblGradAge: "4. Age at Visa Lodgement (Completed Years)",
    lblGradCompDate: "5. Official Course Completion Date (Completion Letter Date · 6-Month Rule)",
    gradResultHeading: "500 / 485 Eligibility, Official VAC & Dual Safe/Statutory Deadlines",
    ctaHeading: "Park & Co Lawyers Partner, Student & Graduate Consultation Brief",
    ctaSub: "Send directly via official email <code>enquiry@parkcolawyers.com</code> or the Park & Co Inquiry Hub.",
    btnSendEmail: "Copy Brief & Open Official Inquiry",
    btnCopyBrief: "Copy Brief",
    btnPrint: "Print Diagnostic",
    citTitle: "Post-PR Australian Citizenship Processing Times (p25–p90) & 820/485/Citizenship ART Statistics",
    citDesc: "Official Department of Home Affairs 4-percentile citizenship processing times (53,298 Conferral on-hand inventory) and ART substantive Set Aside rates for Partner 820 (85.16%), Graduate 485 (93.30%), and Citizenship refusals (58.82%).",
    thCitStream: "Citizenship Stream & Stage",
    thCitP25: "25% Processed",
    thCitP50: "50% (Median)",
    thCitP75: "75% Processed",
    thCitP90: "90% Processed",
    citBtnArt: "Administrative Review Tribunal (ART) Appeal Review",
    citBtnEmergency: "Visa Emergency Triage (s 57 · Schedule 3 · PIC 4020)",
    xBtnDiagnose: "Post-485 Skilled, Sponsored & DAMA 6-Step Diagnostic",
    accSpecSummary: "Accredited Specialist Profile & Statutory Benchmarks",
    statLabelVac: "Partner Visa Base VAC",
    statSubVac: "300→820 Transition $1,955 · Under-18 Child $2,935",
    statLabelGradVac: "Student (500) · Graduate (485) VAC",
    statSubGradVac: "FY2026–27 Base VAC (Second 485 $2,265)",
    statLabelDirectPr: "Partner Direct PR Threshold",
    statValDirectPr: "3 Yrs / 2 Yrs + Child",
    statLabelSponsorCap: "Sponsorship Cap (reg 1.20J)",
    statValSponsorCap: "Max 2 · 5-Yr Gap",
    statSubSponsorCap: "Waivable for compelling circumstances",
    specName: "Chang Min Park (Legal Practitioner Director)",
    specMeta: "Park & Co Lawyers (Underwood QLD) · Email: <a href=\"mailto:enquiry@parkcolawyers.com\">enquiry@parkcolawyers.com</a> · Hub: <a class=\"parkco-svc-link\" href=\"https://parklawyers.com.au/links/?lang=en\" data-ko-href=\"https://parklawyers.com.au/links/?lang=ko\" data-en-href=\"https://parklawyers.com.au/links/?lang=en\" target=\"_blank\" rel=\"noopener\">parklawyers.com.au/links</a>",
    pollerTitle: "Primary Migration Regulations, DHA Pricing API (GetPriceList) & Official ART Telemetry (SHA-256)",
    pollerDesc: "Automated verification of the Department of Home Affairs pricing API (<code>GetPriceList</code>), Migration Regulations 1994 (<code>F1996B03551</code>), and official ART statistics with SHA-256 hashes.",
    thPollerSource: "Primary Source & Target",
    thPollerCitation: "Provision / Endpoint",
    thPollerFigures: "Live Extracted Figures",
    thPollerHash: "SHA-256 Hash · Size",
    thPollerStatus: "Verification Status",
    footerFirmName: "PNC Legal Pty Ltd t/a Park & Co Lawyers",
    footerNotice: "This navigator provides general legal information based on the Migration Regulations 1994 (Cth) and does not constitute formal legal advice prior to a signed retainer. Contact Chang Min Park (Legal Practitioner Director · QLS Accredited Specialist in Immigration Law · <a href=\"mailto:enquiry@parkcolawyers.com\" style=\"color:#F4DC9C;font-weight:700;\">enquiry@parkcolawyers.com</a> · <a class=\"parkco-svc-link\" href=\"https://parklawyers.com.au/links/?lang=en\" data-ko-href=\"https://parklawyers.com.au/links/?lang=ko\" data-en-href=\"https://parklawyers.com.au/links/?lang=en\" target=\"_blank\" rel=\"noopener\" style=\"color:#F4DC9C;font-weight:700;\">parklawyers.com.au/links</a>) before lodging.",
    footerOfficialLabel: "Official Inquiry:",
    footerLinksHub: "Official Consultation Hub (parklawyers.com.au/links)",
    footerHubLink: "← Park & Co Legal & Visa Hub",
    footerFaqLink: "Australian Immigration FAQ (faq.immispecialist.com) →"
  };

  /* ==========================================================================
     3. PURE EVALUATION ENGINES (TESTABLE IN NODE VM & BROWSER)
     ========================================================================== */
  function evaluatePartnerPathway(opts) {
    var loc = (opts && opts.location) || "";
    var relYrs = (opts && opts.relYears) || "1to2";
    var hasChild = !!(opts && opts.hasSharedChild);
    var spHist = (opts && opts.sponsorHist) || "clean";

    if (!loc) {
      return { ready: false };
    }

    var directPr = relYrs === "over3" || (relYrs === "2to3" && hasChild);
    var subclassCode = "820_801";
    var trackTitleKo = "Subclass 820 / 801 (온쇼어 파트너 비자)";
    var trackTitleEn = "Subclass 820 / 801 (Onshore Partner Visa)";
    var baseVacAud = 11710;
    var vacDisplayKo = "$11,710 AUD (동반 18세 이상 +$5,860 · 18세 미만 +$2,935)";
    var vacDisplayEn = "$11,710 AUD (Add 18+ +$5,860 · Under 18 +$2,935)";
    var schedule3State = "not_triggered_substantive";
    var schedule3TitleKo = "Schedule 3 미적용 (유효 본비자 보유 중 안전 접수)";
    var schedule3TitleEn = "Schedule 3 Not Triggered (Valid Substantive Visa Held)";
    var schedule3DetailKo = "현재 유효한 본비자(Substantive Visa)를 보유한 상태에서 820 비자를 접수하므로 Schedule 3(3001·3004) 추가 요건이 적용되지 않습니다. 조건 8503(No Further Stay) 부착 여부만 사전 확인하십시오.";
    var schedule3DetailEn = "Lodging Subclass 820 while holding a valid substantive visa avoids Schedule 3 (Criteria 3001/3004). Confirm no Condition 8503 (No Further Stay) is attached.";
    var schedule3Severity = "ok";

    if (loc === "onshore_bva_within28") {
      schedule3State = "triggered_bva_within28";
      schedule3Severity = "danger";
      schedule3TitleKo = "Schedule 3 (Criterion 3004) 적용 — Compelling Reasons 웨이버 필수";
      schedule3TitleEn = "Schedule 3 (Criterion 3004) Triggered — Compelling Reasons Waiver Required";
      schedule3DetailKo = "유효 본비자 없이 브리징 비자 상태에서 온쇼어 820을 접수하면 Schedule 3 요건이 작동합니다. 단순한 혼인·동거 사실만으로는 면제되지 않으며 Waensila v MIBP [2016] FCAFC 32 판례 기준에 부합하는 불가피한 사유(호주 시민권 자녀 양육·스폰서의 중대한 의료 및 생계 의존성 등) 법률 의견서가 필수입니다.";
      schedule3DetailEn = "Lodging onshore 820 on a Bridging Visa triggers Schedule 3. Under Waensila v MIBP [2016] FCAFC 32, a genuine relationship alone is insufficient; a formal legal submission proving compelling reasons is essential.";
    } else if (loc === "onshore_expired_over28") {
      schedule3State = "triggered_over28_3001_3004";
      schedule3Severity = "danger";
      schedule3TitleKo = "Schedule 3 (Criteria 3001 & 3004) 중첩 적용 — 고난도 웨이버 필수";
      schedule3TitleEn = "Schedule 3 (Criteria 3001 & 3004) Triggered — High-Risk Waiver Required";
      schedule3DetailKo = "마지막 본비자 만료일로부터 28일이 초과 경과하여 Criterion 3001과 3004가 동시에 적용됩니다. 통지 없이 단독 접수할 경우 거절 위험이 매우 높으므로 Waensila [2016] FCAFC 32 기준의 종합 소명자료 또는 오프쇼어 309 전환 득실을 먼저 점검해야 합니다.";
      schedule3DetailEn = "More than 28 days have elapsed since the last substantive visa ceased, triggering both Criteria 3001 and 3004. Obtain specialist Schedule 3 waiver advice or assess offshore Subclass 309 options before lodging.";
    } else if (loc === "offshore_married_defacto") {
      subclassCode = "309_100";
      trackTitleKo = "Subclass 309 / 100 (오프쇼어 파트너 비자)";
      trackTitleEn = "Subclass 309 / 100 (Offshore Partner Visa)";
      schedule3State = "not_applicable_offshore";
      schedule3Severity = "ok";
      schedule3TitleKo = "오프쇼어 309/100 신청 — 온쇼어 Schedule 3 요건 해당 없음";
      schedule3TitleEn = "Offshore 309/100 Application — Onshore Schedule 3 Not Applicable";
      schedule3DetailKo = "호주 밖에서 접수하는 Subclass 309 비자에는 온쇼어 브리징 Schedule 3 규정이 적용되지 않습니다.";
      schedule3DetailEn = "Onshore Schedule 3 criteria do not apply to offshore Subclass 309 partner visa applications.";
    } else if (loc === "offshore_fiance") {
      subclassCode = "300_to_820";
      trackTitleKo = "Subclass 300 (약혼자) → 호주 입국·혼인 후 Subclass 820 / 801 전환";
      trackTitleEn = "Subclass 300 (Prospective Marriage) → Onshore Subclass 820 / 801";
      baseVacAud = 13665;
      vacDisplayKo = "1단계 300 ($11,710) + 2단계 820 전환 ($1,955) = 총 $13,665 AUD";
      vacDisplayEn = "Stage 1 Subclass 300 ($11,710) + Stage 2 820 Transition ($1,955) = $13,665 AUD";
      directPr = false;
      schedule3State = "not_applicable_offshore";
      schedule3Severity = "ok";
      schedule3TitleKo = "오프쇼어 300 승인 입국 후 유효기간 내 혼인·820 접수 시 Schedule 3 미적용";
      schedule3TitleEn = "Schedule 3 Not Triggered When Lodging 820 Before Subclass 300 Expiry";
      schedule3DetailKo = "Subclass 300 비자 유효기간(통상 9~15개월) 안에 호주 입국과 법적 혼인을 마치고 만료 전 820 비자를 접수하면 Schedule 3가 적용되지 않습니다.";
      schedule3DetailEn = "Marrying your sponsor and lodging Subclass 820 before Subclass 300 ceases avoids Schedule 3 and secures the $1,955 transition VAC.";
    } else if (loc === "onshore_300_holder") {
      subclassCode = "300_holder_820";
      trackTitleKo = "유효 Subclass 300 보유자 → 온쇼어 Subclass 820 / 801 전환";
      trackTitleEn = "Current Subclass 300 Holder → Onshore Subclass 820 / 801 Transition";
      baseVacAud = 1955;
      vacDisplayKo = "$1,955 AUD (만료 전 접수 기준 · 300 만료 후 접수 시 $2,475 AUD)";
      vacDisplayEn = "$1,955 AUD before 300 expiry ($2,475 AUD if Subclass 300 has ceased)";
      schedule3State = "not_triggered_substantive";
      schedule3Severity = "ok";
      schedule3TitleKo = "유효 Subclass 300 보유 중 접수 — Schedule 3 미적용";
      schedule3TitleEn = "Valid Subclass 300 Held — Schedule 3 Not Triggered";
      schedule3DetailKo = "Subclass 300 비자가 만료되기 전에 혼인신고 후 820/801 전환 신청을 접수하면 할인 수수료($1,955)가 적용되며 Schedule 3도 발생하지 않습니다.";
      schedule3DetailEn = "Lodging 820/801 after marriage while Subclass 300 remains in effect qualifies for the $1,955 transition VAC without triggering Schedule 3.";
    }

    var sponsorBar = spHist !== "clean";
    var sponsorNoteKo = "";
    var sponsorNoteEn = "";
    if (spHist === "within_5yrs_or_2x") {
      sponsorNoteKo = "스폰서 초청 한도 제한(reg 1.20J · 평생 2회 및 5년 간격)에 해당합니다. 호주 시민권 공동 자녀 출생 또는 장기 헌신 관계 등 스폰서에게 미치는 불가피한 사정(Compelling Circumstances) 면제 의견서를 함께 제출해야 합니다.";
      sponsorNoteEn = "Sponsor is subject to the reg 1.20J sponsorship limitation (max 2 lifetime sponsorships / 5-year gap). A formal compelling-circumstances waiver submission is required.";
    } else if (spHist === "contrib_parent_5yr") {
      sponsorNoteKo = "스폰서가 최근 5년 이내 기여제 부모비자(143/864)를 승인받은 경우 reg 1.20KA 파트너 초청 제한이 적용됩니다. 법정 예외 사유 충족 여부를 반드시 사전 검토하십시오.";
      sponsorNoteEn = "Sponsor was granted a Contributory Parent visa (143/864) within the past 5 years, triggering the reg 1.20KA bar unless compelling reasons are established.";
    } else {
      sponsorNoteKo = "스폰서의 과거 파트너 초청 제한(reg 1.20J / 1.20KA) 특이사항이 없습니다.";
      sponsorNoteEn = "No prior partner sponsorship limitation bars (reg 1.20J / 1.20KA) indicated.";
    }

    return {
      ready: true,
      subclassCode: subclassCode,
      trackTitleKo: trackTitleKo,
      trackTitleEn: trackTitleEn,
      baseVacAud: baseVacAud,
      vacDisplayKo: vacDisplayKo,
      vacDisplayEn: vacDisplayEn,
      directPr: directPr,
      schedule3State: schedule3State,
      schedule3Severity: schedule3Severity,
      schedule3TitleKo: schedule3TitleKo,
      schedule3TitleEn: schedule3TitleEn,
      schedule3DetailKo: schedule3DetailKo,
      schedule3DetailEn: schedule3DetailEn,
      sponsorBar: sponsorBar,
      sponsorNoteKo: sponsorNoteKo,
      sponsorNoteEn: sponsorNoteEn
    };
  }

  var PRESCRIBED_REG_STATES = ["QLD", "NSW", "VIC", "SA", "ACT", "TAS"];

  function evaluateRelationshipEligibility(opts) {
    var relLegal = (opts && opts.relLegalStatus) || "";
    var state = ((opts && opts.state) || "QLD").toUpperCase();
    var rawMonths = opts && opts.monthsRaw !== undefined ? String(opts.monthsRaw).trim() : "";
    var pillars = (opts && opts.pillars) || "strong4";

    if (!relLegal) {
      return { ready: false };
    }

    var months = null;
    if (rawMonths !== "") {
      var parsed = Number(rawMonths);
      if (!isFinite(parsed) || parsed < 0 || parsed > 360 || Math.floor(parsed) !== parsed) {
        return {
          ready: true,
          validationError: true,
          errorKo: "동거 개월 수는 0개월 이상 360개월 이하의 정수로 입력해 주십시오.",
          errorEn: "Please enter completed cohabitation months as a whole number between 0 and 360."
        };
      }
      months = parsed;
    }

    if (relLegal === "unregistered_defacto" && months === null) {
      return {
        ready: false,
        needsMonthsPrompt: true
      };
    }

    var canExemptState = PRESCRIBED_REG_STATES.indexOf(state) !== -1;
    var status = "ok";
    var badgeKo = "";
    var badgeEn = "";
    var detailKo = "";
    var detailEn = "";

    if (relLegal === "legally_married") {
      status = "married_exempt";
      badgeKo = "법률혼 배우자 요건 적용 (s 5F) — 12개월 의무 동거 요건 면제";
      badgeEn = "Legally Married Spouse (s 5F) — 12-Month De Facto Rule Does Not Apply";
      detailKo = "유효한 법적 혼인신고를 마친 부부는 이민법 s 5F 및 reg 1.15A 배우자 기준이 적용되므로 사실혼(reg 2.03A) 12개월 동거 기간 미달을 이유로 거절되지 않습니다" +
        (months !== null ? " (입력 동거 기간: " + months + "개월)." : ".") +
        " 다만 영구적 별거 상태가 아님(not living separately and apart on a permanent basis)과 4대 기둥 실사용 증거는 충실히 입증해야 합니다.";
      detailEn = "Legally married couples are assessed as spouses under s 5F and reg 1.15A rather than the reg 2.03A 12-month de facto rule" +
        (months !== null ? " (cohabitation entered: " + months + " months)." : ".") +
        " You must still prove a genuine continuing marriage and that you do not live separately and apart on a permanent basis.";
    } else if (relLegal === "state_registered") {
      if (canExemptState) {
        status = "registered_exempt";
        badgeKo = state + " 주정부 시민 관계등록 면제 적용 (reg 2.03A(5)) — 12개월 동거 면제 가능";
        badgeEn = state + " State Relationship Registration Exemption (reg 2.03A(5)) — 12-Month Rule Waived";
        detailKo = state + " 주정부는 연방 이민법상 인정 등록 주(Prescribed State/Territory)에 해당합니다" +
          (months !== null ? " (현재 동거 " + months + "개월)." : ".") +
          " 비자 심사 결정 전까지 공식 관계등록증(Civil Partnership / Relationship Certificate)이 발급되면 12개월 미만 동거라도 reg 2.03A 기간 요건이 면제됩니다.";
        detailEn = state + " is a prescribed jurisdiction under reg 2.03A(5)" +
          (months !== null ? " (current cohabitation: " + months + " months)." : ".") +
          " Providing the official state relationship certificate before decision waives the 12-month cohabitation threshold.";
      } else {
        if (months !== null && months >= 12) {
          status = "defacto_12m_met";
          badgeKo = state + " 관계등록 면제 비대상이나 실제 동거 " + months + "개월로 reg 2.03A(3) 충족";
          badgeEn = state + " Registration Not Prescribed, But " + months + " Months Cohabitation Meets reg 2.03A(3)";
          detailKo = state + "는 연방 이민법상 관계등록 면제 인정 주가 아니지만 이미 " + months + "개월 동거를 충족하셨으므로 12개월 동거 증빙으로 적격 요건을 만족합니다.";
          detailEn = "Although " + state + " is excluded from reg 2.03A(5) registration waivers, your " + months + " months of cohabitation independently satisfies reg 2.03A(3).";
        } else {
          status = "wa_nt_registration_invalid";
          badgeKo = "거절 위험 경고 (" + state + " 거주) — 주정부 관계등록으로 12개월 동거 면제 불가";
          badgeEn = "Refusal Risk Warning (" + state + ") — State Registration Does NOT Waive 12-Month Rule";
          detailKo = state + "는 연방 이민법 시행령(reg 2.03A(5))이 인정하는 관계등록 면제 주가 아닙니다" +
            (months !== null ? " (현재 동거 " + months + "개월)." : ".") +
            " 12개월 동거를 채우기 전에 사실혼으로 접수하면 거절될 위험이 높으므로 법적 혼인신고(s 5F)를 진행하거나 만 12개월 동거 완료 후 접수해야 합니다.";
          detailEn = state + " is NOT prescribed under reg 2.03A(5)" +
            (months !== null ? " (current cohabitation: " + months + " months)." : ".") +
            " Lodging a de facto claim under 12 months in " + state + " faces refusal unless you legally marry (s 5F) or complete 12 full months of cohabitation.";
        }
      }
    } else {
      /* unregistered_defacto */
      if (months >= 12) {
        status = "defacto_12m_met";
        badgeKo = "사실혼 12개월 동거 요건 충족 (" + months + "개월 · reg 2.03A(3))";
        badgeEn = "12-Month De Facto Cohabitation Met (" + months + " Months · reg 2.03A(3))";
        detailKo = "신청 직전 최소 12개월 이상 사실혼 동거 요건을 충족합니다. 임대차계약서·공동 공과금·동일 주소지 우편물로 12개월 연속성을 빈틈없이 증빙하십시오.";
        detailEn = "You satisfy the 12-month de facto cohabitation requirement prior to lodgement under reg 2.03A(3). Ensure continuous cohabitation evidence covers the entire 12-month period.";
      } else if (canExemptState) {
        status = "unregistered_under12_can_register";
        badgeKo = "현재 무등록 상태로 동거 " + months + "개월 미달 — " + state + " 주정부 관계등록 또는 혼인신고 필요";
        badgeEn = "Unregistered & Only " + months + " Months Cohabitation — Register in " + state + " or Marry";
        detailKo = "혼인신고와 관계등록 없이 동거 " + months + "개월 상태에서 그대로 접수하면 reg 2.03A 미충족으로 거절됩니다. 다행히 " + state + "는 관계등록 면제 인정 주이므로 접수 전후 " + state + " 출생사망혼인등록소(BDM) 관계등록을 완료하거나 법적 혼인신고를 진행하면 12개월 요건을 적법하게 면제받을 수 있습니다.";
        detailEn = "Lodging unregistered at " + months + " months risks refusal under reg 2.03A(3). Because " + state + " is a prescribed state, registering your relationship with " + state + " BDM or marrying waives the 12-month rule.";
      } else {
        status = "unregistered_under12_wa_nt";
        badgeKo = "거절 위험 경고 (" + state + " · 동거 " + months + "개월) — 12개월 동거 미달 및 관계등록 면제 불가";
        badgeEn = "High Refusal Risk (" + state + " · " + months + " Months) — Under 12 Months & No State Waiver";
        detailKo = state + "에서는 주정부 관계등록을 통한 12개월 면제가 인정되지 않습니다. 현재 " + months + "개월 동거 상태에서 사실혼 비자를 접수하면 거절 위험이 매우 높으므로 만 12개월 동거를 모두 채우거나 법적 혼인신고(s 5F) 후 접수하시기 바랍니다.";
        detailEn = state + " has no prescribed relationship register exemption under reg 2.03A(5). Do not lodge an unregistered de facto partner visa at " + months + " months; complete 12 months or legally marry first.";
      }
    }

    var pillarWarn = pillars === "weak_fin_house";
    var pillarKo = pillarWarn
      ? "4대 기둥 보완 권고(reg 1.15A / 1.09A): 개설만 하고 거래가 없는 공동 계좌나 단독 명의 임대차계약서는 인정 비중이 낮습니다. 급여·생활비 실사용 공동 계좌 내역과 공동 공과금 및 호주 시민·영주권자 지인의 Form 888 진술서(최소 2부), 유언장 또는 연금(Super) 수익자 지정을 보강하십시오."
      : "4대 증빙 기둥(재정 분담·공동 주거·사회적 인정·상호 헌신)이 고르게 준비된 상태입니다. 접수일 이후 심사 대기 중에도 분기별 최신 증빙을 ImmiAccount에 지속 업데이트하십시오.";
    var pillarEn = pillarWarn
      ? "4 Pillars Action Required (regs 1.15A / 1.09A): Dormant joint accounts or single-name leases carry low weight. Establish active joint household transactions, joint utility records, at least two Form 888 statutory declarations, and Superannuation/Will nominations."
      : "All 4 evidentiary pillars (financial, household, social, mutual commitment) are aligned. Continue uploading updated quarterly evidence to ImmiAccount until decision.";

    return {
      ready: true,
      validationError: false,
      status: status,
      months: months,
      canExemptState: canExemptState,
      badgeKo: badgeKo,
      badgeEn: badgeEn,
      detailKo: detailKo,
      detailEn: detailEn,
      pillarWarn: pillarWarn,
      pillarKo: pillarKo,
      pillarEn: pillarEn
    };
  }

  function evaluateGraduatePathway(opts) {
    var stream = (opts && opts.stream) || "";
    var currentVisa = (opts && opts.currentVisa) || "500_current";
    var qualType = (opts && opts.qualType) || "bachelor_coursework";
    var ageRaw = opts && opts.ageRaw !== undefined ? String(opts.ageRaw).trim() : "";
    var compDate = (opts && opts.completionDate) || "";
    var refTodayIso = (opts && opts.todayIso) || ParkCoDates.todayBrisbaneIso();

    if (!stream) {
      return { ready: false };
    }

    var is485 = stream.indexOf("485_") === 0;
    var age = null;
    if (ageRaw !== "") {
      var parsedAge = Number(ageRaw);
      if (!isFinite(parsedAge) || parsedAge < 15 || parsedAge > 80 || Math.floor(parsedAge) !== parsedAge) {
        return {
          ready: true,
          validationError: true,
          errorKo: "접수 시점 만 나이는 15세 이상 80세 이하의 정수로 입력해 주십시오.",
          errorEn: "Please enter age at lodgement as a whole number between 15 and 80."
        };
      }
      age = parsedAge;
    } else if (is485) {
      return {
        ready: true,
        validationError: true,
        errorKo: "졸업생 비자(Subclass 485) 적격 판정을 위해 접수 시점 만 나이를 입력해 주십시오.",
        errorEn: "Please enter your age at lodgement to check Subclass 485 age eligibility."
      };
    }

    var vacBaseAud = 5750;
    var vacTextKo = "주신청자 $5,750 AUD (동반 18세 이상 +$2,875 · 18세 미만 +$1,450)";
    var vacTextEn = "Main applicant $5,750 AUD (Add 18+ +$2,875 · Under 18 +$1,450)";
    if (stream === "485_second") {
      vacBaseAud = 2265;
      vacTextKo = "Second 485 주신청자 $2,265 AUD (동반 18세 이상 +$1,140 · 18세 미만 +$575)";
      vacTextEn = "Second 485 main applicant $2,265 AUD (Add 18+ +$1,140 · Under 18 +$575)";
    } else if (stream === "500_student") {
      vacBaseAud = 2500;
      vacTextKo = "학생 비자(500) 주신청자 $2,500 AUD (동반 18세 이상 +$1,530 · 18세 미만 +$500 · 온쇼어 연장 STAC +$700 해당 여부 확인)";
      vacTextEn = "Student Subclass 500 main applicant $2,500 AUD (Add 18+ +$1,530 · Under 18 +$500 · check $700 STAC if extending onshore)";
    }

    var issues = [];
    var passes = [];

    /* 1. Visa-hopping & holding checks */
    if (stream === "500_student") {
      if (currentVisa === "485_current" || currentVisa === "600_visitor") {
        issues.push({
          ko: "온쇼어 학생 비자(500) 비자호핑 금지 대상(2024년 7월 1일 시행): 현재 보유 중인 비자(485 또는 600/601/651) 상태에서는 호주 국내에서 Subclass 500 신청서를 유효하게 접수할 수 없습니다(Invalid Application). 출국 후 오프쇼어에서 신청하거나 고용주 스폰서(SID 482)·파트너 비자 등 다른 적격 경로를 검토해야 합니다.",
          en: "Onshore Subclass 500 Visa-Hopping Ban (in force since 1 Jul 2024): Holders of Subclass 485, 600, 601, or 651 cannot lodge a valid onshore Student visa application. You must apply offshore or assess employer-sponsored (SID 482) or Partner pathways."
        });
      } else {
        passes.push({
          ko: "현재 보유 비자 기준 온쇼어 학생 비자(500) 비자호핑 절대 금지 대상에 해당하지 않습니다(CoE · 재정능력 · Genuine Student 심사 철저 대비 필요).",
          en: "Not barred by the July 2024 onshore Subclass 500 visa-hopping prohibition (prepare CoE, financial capacity, and Genuine Student statement carefully)."
        });
      }
    } else {
      /* 485 checks */
      if (stream !== "485_second" && (currentVisa === "600_visitor" || currentVisa === "417_462_whm" || currentVisa === "offshore_outside")) {
        issues.push({
          ko: "최근 6개월 내 학생 비자(500) 보유 및 온쇼어 신청 요건 주의(cl 485.211): 최초 485 주신청자는 원칙적으로 호주 국내에 체류 중이어야 하며 신청 전 최근 6개월 이내에 적격 학생 비자(Subclass 500)를 보유했어야 합니다.",
          en: "Recent Student Visa & Onshore Requirement Warning (cl 485.211): Primary 485 applicants must generally be in Australia and have held an eligible Subclass 500 Student visa within the 6 months before lodgement."
        });
      } else if (stream === "485_second" && currentVisa !== "485_current") {
        issues.push({
          ko: "Second 485 신청 자격 주의: 지방 연장 Second Post-Higher Education Work 스트림은 현재 첫 번째 485(PHEW/Post-Study Work) 비자를 보유 중인 상태에서 신청해야 합니다.",
          en: "Second 485 Holding Requirement: Second Post-Higher Education Work applicants must hold an eligible first Subclass 485 visa at lodgement."
        });
      } else {
        passes.push({
          ko: "현재 보유 비자 기준 졸업생 비자(485) 기본 신청 자격 흐름에 부합합니다.",
          en: "Current visa status aligns with Subclass 485 lodgement prerequisites."
        });
      }

      /* 2. Age Cap Check */
      var maxAge = qualType === "research_phd" ? 49 : 35;
      if (age > maxAge) {
        issues.push({
          ko: "연령 상한 초과(cl 485.212): 선택한 학위 기준 만 " + maxAge + "세 이하만 485 신청이 가능하나 입력 연령이 만 " + age + "세입니다. 고용주 스폰서(SID 482 · 만 45세 미만 186 전환) 또는 DAMA(만 55세 미만 연령 특례) 및 파트너 비자 경로를 즉시 검토하십시오.",
          en: "Age Cap Exceeded (cl 485.212): Maximum eligible age for this qualification is " + maxAge + ", whereas entered age is " + age + ". Assess SID 482 employer sponsorship, DAMA age concessions, or Partner visa options immediately."
        });
      } else {
        passes.push({
          ko: "연령 요건 충족(만 " + age + "세 ≤ 상한 만 " + maxAge + "세 · cl 485.212).",
          en: "Age requirement met (Age " + age + " ≤ cap of " + maxAge + " · cl 485.212)."
        });
      }
    }

    /* 3. 6-Month Completion Deadline Calculation (ParkCoDates) */
    var deadlineInfo = null;
    if (compDate) {
      var parsedComp = ParkCoDates.parseIsoLocal(compDate);
      if (!parsedComp) {
        return {
          ready: true,
          validationError: true,
          errorKo: "학업 수료 완료일 형식이 올바르지 않습니다(YYYY-MM-DD).",
          errorEn: "Invalid course completion date format (YYYY-MM-DD)."
        };
      }
      var statDateObj = ParkCoDates.addYearsMonthsClamped(compDate, 0, 6, 0);
      var statIso = ParkCoDates.formatIsoLocal(statDateObj);
      var safeIso = ParkCoDates.computeSafePriorBusinessIso(statIso, 14, "QLD");
      var diffDays = ParkCoDates.diffDaysBetweenIso(refTodayIso, statIso);
      var compToToday = ParkCoDates.diffDaysBetweenIso(compDate, refTodayIso);

      deadlineInfo = {
        completionIso: compDate,
        statutoryIso: statIso,
        safeIso: safeIso,
        diffDays: diffDays,
        overdue: diffDays < 0,
        futureCompletion: compToToday < 0
      };

      if (is485 && stream !== "485_second") {
        if (deadlineInfo.overdue) {
          issues.push({
            ko: "학업 수료 후 6개월 법정 기한 경과(cl 485.221): 공식 수료일(" + compDate + ")로부터 6개월 마감일(" + statIso + ")이 이미 " + Math.abs(diffDays) + "일 지났습니다. 졸업식 날짜가 아닌 Completion Letter 상 수료 완료일이 기준이므로 대안 비자를 즉시 점검해야 합니다.",
            en: "6-Month Post-Completion Deadline Expired (cl 485.221): Statutory deadline (" + statIso + ") passed " + Math.abs(diffDays) + " days ago based on completion date " + compDate + "."
          });
        } else {
          passes.push({
            ko: "수료 후 6개월 기한 내 진행 가능: 법정 마감일 " + statIso + " (잔여 " + diffDays + "일) · 보수적 안전 접수 권고일 " + safeIso + " 이전까지 영어 성적·AFP 범죄경력조회서를 구비해 접수하십시오.",
            en: "Within 6-Month Completion Window: Statutory deadline " + statIso + " (" + diffDays + " days left) · Recommended safe lodgement by " + safeIso + " with English test & AFP check ready."
          });
        }
      }
    }

    return {
      ready: true,
      validationError: false,
      stream: stream,
      is485: is485,
      age: age,
      vacBaseAud: vacBaseAud,
      vacTextKo: vacTextKo,
      vacTextEn: vacTextEn,
      eligible: issues.length === 0,
      issues: issues,
      passes: passes,
      deadlineInfo: deadlineInfo
    };
  }

  root.PartnerGraduateEngine = {
    evaluatePartnerPathway: evaluatePartnerPathway,
    evaluateRelationshipEligibility: evaluateRelationshipEligibility,
    evaluateGraduatePathway: evaluateGraduatePathway,
    getLabel: getLabel,
    LABELS: LABELS
  };

  /* ==========================================================================
     4. UI RENDERING & INTERACTION CONTROLLERS
     ========================================================================== */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderNeutralPrompt(titleKo, titleEn, descKo, descEn) {
    var isKo = currentLang === "ko";
    return (
      '<div class="neutral-prompt">' +
        '<strong>' + escapeHtml(isKo ? titleKo : titleEn) + '</strong>' +
        '<p>' + escapeHtml(isKo ? descKo : descEn) + '</p>' +
        '<button type="button" class="btn-sample js-trigger-sample">' +
          escapeHtml(isKo ? "예시 조건 채우기" : "Load Sample Case") +
        '</button>' +
      '</div>'
    );
  }

  function setMode(mode, updateHistory) {
    currentMode = mode === "graduate" ? "graduate" : "partner";
    var btnP = document.getElementById("tab-btn-partner");
    var btnG = document.getElementById("tab-btn-graduate");
    var panP = document.getElementById("mode-panel-partner");
    var panG = document.getElementById("mode-panel-graduate");

    if (btnP) {
      btnP.classList.toggle("active", currentMode === "partner");
      btnP.setAttribute("aria-selected", currentMode === "partner" ? "true" : "false");
    }
    if (btnG) {
      btnG.classList.toggle("active", currentMode === "graduate");
      btnG.setAttribute("aria-selected", currentMode === "graduate" ? "true" : "false");
    }
    if (panP) panP.hidden = currentMode !== "partner";
    if (panG) panG.hidden = currentMode !== "graduate";

    if (updateHistory && typeof window !== "undefined" && window.history && window.history.replaceState) {
      try {
        var u = new URL(window.location.href);
        u.searchParams.set("mode", currentMode);
        window.history.replaceState(null, "", u.toString());
      } catch (_) {}
    }
    updateAll();
  }

  function updateAll() {
    var isKo = currentLang === "ko";

    /* --- Partner Step 1 --- */
    var locVal = (document.getElementById("pv-location") || {}).value || "";
    var relYrsVal = (document.getElementById("pv-rel-years") || {}).value || "1to2";
    var childVal = (document.getElementById("pv-shared-child") || {}).value || "no";
    var spHistVal = (document.getElementById("s3-sponsor-hist") || {}).value || "clean";

    var pRes = evaluatePartnerPathway({
      location: locVal,
      relYears: relYrsVal,
      hasSharedChild: childVal === "yes",
      sponsorHist: spHistVal
    });

    var pOut = document.getElementById("pv-pathway-output");
    if (pOut) {
      if (!pRes.ready) {
        pOut.innerHTML = renderNeutralPrompt(
          "체류 위치 및 현재 비자 상태를 선택해 주십시오",
          "Select Your Current Location & Visa Status",
          "왼쪽 1번 항목을 선택하시면 권고 파트너 비자 서브클래스(820/309/300)와 신청비($11,710 / $1,955) 및 Schedule 3 웨이버 필요 여부가 즉시 표시됩니다.",
          "Choose item 1 on the left to view your recommended Partner subclass, FY2026–27 VAC, Direct PR status, and Schedule 3 assessment."
        );
      } else {
        var s3BoxClass = pRes.schedule3Severity === "danger" ? "alert-box alert-danger" : "alert-box alert-ok";
        var spBoxClass = pRes.sponsorBar ? "alert-box alert-warn" : "alert-box alert-info";
        var prMsg = pRes.directPr
          ? (isKo
              ? "직행 영주권(reg 1.03 Long-Term Relationship) 대상: 820/309 2년 대기 없이 심사 완료 시 Subclass 801/100 영주권 동시 승인을 요청할 수 있습니다."
              : "Direct PR Eligible (reg 1.03 Long-Term Relationship): Eligible for simultaneous Subclass 801/100 permanent grant without waiting 24 months.")
          : (isKo
              ? "2단계 파트너 심사 적용: 1차 임시비자(820/309) 승인 후 최초 접수일로부터 만 2년 경과 시 2차 영주권(801/100) 심사가 진행됩니다(추가 신청비 $0)."
              : "Two-Stage Partner Assessment: Temporary stage (820/309) granted first; Permanent stage (801/100) assessed 24 months from lodgement ($0 extra VAC).");

        pOut.innerHTML =
          '<div class="alert-box alert-info" style="margin-bottom:10px;">' +
            '<div style="font-size:14.5px;font-weight:800;color:#0E3A3E;margin-bottom:4px;">' +
              escapeHtml(isKo ? pRes.trackTitleKo : pRes.trackTitleEn) +
            '</div>' +
            '<div style="font-size:13px;"><strong>' + (isKo ? "FY2026–27 공식 신청비(VAC): " : "FY2026–27 Official VAC: ") + '</strong>' +
              escapeHtml(isKo ? pRes.vacDisplayKo : pRes.vacDisplayEn) +
            '</div>' +
          '</div>' +
          '<div class="' + s3BoxClass + '" style="margin-bottom:10px;">' +
            '<div style="font-weight:800;margin-bottom:4px;">' + escapeHtml(isKo ? pRes.schedule3TitleKo : pRes.schedule3TitleEn) + '</div>' +
            '<div style="font-size:13px;">' + escapeHtml(isKo ? pRes.schedule3DetailKo : pRes.schedule3DetailEn) + '</div>' +
          '</div>' +
          '<div class="' + spBoxClass + '" style="margin-bottom:10px;">' +
            '<div style="font-size:13px;">' + escapeHtml(isKo ? pRes.sponsorNoteKo : pRes.sponsorNoteEn) + '</div>' +
          '</div>' +
          '<div style="font-size:13px;color:#14282A;padding:8px 10px;background:#FBF9F5;border:1px solid #E5DFD3;border-radius:8px;">' +
            escapeHtml(prMsg) +
          '</div>';
      }
    }

    /* --- Partner Step 2 --- */
    var relLegalVal = (document.getElementById("rel-legal-status") || {}).value || "";
    var stateVal = (document.getElementById("df-state") || {}).value || "QLD";
    var monthsRawVal = (document.getElementById("df-months") || {}).value;
    var pillarsVal = (document.getElementById("df-pillars") || {}).value || "strong4";

    var stateGroup = document.getElementById("df-state-group");
    if (stateGroup) {
      stateGroup.style.opacity = relLegalVal === "legally_married" ? "0.65" : "1";
    }

    var rRes = evaluateRelationshipEligibility({
      relLegalStatus: relLegalVal,
      state: stateVal,
      monthsRaw: monthsRawVal,
      pillars: pillarsVal
    });

    var dfOut = document.getElementById("pv-defacto-output");
    if (dfOut) {
      if (!rRes.ready) {
        dfOut.innerHTML = renderNeutralPrompt(
          rRes.needsMonthsPrompt ? "실제 동거 개월 수를 입력해 주십시오" : "법적 혼인 또는 주정부 관계등록 여부를 선택해 주십시오",
          rRes.needsMonthsPrompt ? "Enter Completed Months of Cohabitation" : "Select Marriage or Relationship Registration Status",
          rRes.needsMonthsPrompt
            ? "일반 사실혼 동거 커플은 실제 동거 개월 수(0~360개월)를 입력하시면 reg 2.03A 충족 여부와 주정부 관계등록 면제 가능성을 계산합니다."
            : "법률혼 부부(s 5F)인지 주정부 관계등록 커플(reg 2.03A(5))인지 먼저 선택하시면 잘못된 12개월 미달 경고 없이 정확한 법리가 안내됩니다.",
          rRes.needsMonthsPrompt
            ? "Enter your completed months of cohabitation (0–360) to check reg 2.03A compliance and state registration options."
            : "Select whether you are legally married, state-registered, or in an unregistered de facto relationship."
        );
      } else if (rRes.validationError) {
        dfOut.innerHTML = '<div class="alert-box alert-danger"><strong>' + escapeHtml(isKo ? rRes.errorKo : rRes.errorEn) + '</strong></div>';
      } else {
        var rBoxClass = "alert-box alert-ok";
        if (rRes.status === "wa_nt_registration_invalid" || rRes.status === "unregistered_under12_wa_nt") {
          rBoxClass = "alert-box alert-danger";
        } else if (rRes.status === "unregistered_under12_can_register") {
          rBoxClass = "alert-box alert-warn";
        }
        var pBoxClass = rRes.pillarWarn ? "alert-box alert-warn" : "alert-box alert-info";
        dfOut.innerHTML =
          '<div class="' + rBoxClass + '" style="margin-bottom:10px;">' +
            '<div style="font-weight:800;margin-bottom:4px;">' + escapeHtml(isKo ? rRes.badgeKo : rRes.badgeEn) + '</div>' +
            '<div style="font-size:13px;">' + escapeHtml(isKo ? rRes.detailKo : rRes.detailEn) + '</div>' +
          '</div>' +
          '<div class="' + pBoxClass + '">' +
            '<div style="font-size:13px;">' + escapeHtml(isKo ? rRes.pillarKo : rRes.pillarEn) + '</div>' +
          '</div>';
      }
    }

    /* --- Mode 2: Student 500 & Graduate 485 --- */
    var gStream = (document.getElementById("grad-target-stream") || {}).value || "";
    var gHeld = (document.getElementById("grad-current-visa") || {}).value || "500_current";
    var gQual = (document.getElementById("grad-qual-type") || {}).value || "bachelor_coursework";
    var gAge = (document.getElementById("grad-age") || {}).value;
    var gComp = (document.getElementById("grad-completion-date") || {}).value || "";

    var gRes = evaluateGraduatePathway({
      stream: gStream,
      currentVisa: gHeld,
      qualType: gQual,
      ageRaw: gAge,
      completionDate: gComp
    });

    var gOut = document.getElementById("grad-calc-output");
    if (gOut) {
      if (!gRes.ready) {
        gOut.innerHTML = renderNeutralPrompt(
          "점검할 학생(500) 또는 졸업생(485) 비자 스트림을 선택해 주십시오",
          "Select Target Student (500) or Graduate (485) Stream",
          "왼쪽에서 목표 비자 스트림과 만 나이 및 학업 수료 완료일을 입력하시면 비자호핑 금지 해당 여부와 연령 적격성 및 6개월 마감일이 병기됩니다.",
          "Select your target stream, age, and official course completion date to view onshore eligibility, FY2026–27 VAC, and dual deadlines."
        );
      } else if (gRes.validationError) {
        gOut.innerHTML = '<div class="alert-box alert-danger"><strong>' + escapeHtml(isKo ? gRes.errorKo : gRes.errorEn) + '</strong></div>';
      } else {
        var verdictClass = gRes.eligible ? "alert-box alert-ok" : "alert-box alert-danger";
        var verdictHeading = gRes.eligible
          ? (isKo ? "핵심 법정 자격 요건 부합 (세부 서류 점검 권장)" : "Core Statutory Criteria Aligned (Verify Supporting Evidence)")
          : (isKo ? "법정 자격 제한 항목 발견 — 단독 접수 전 대안 검토 필수" : "Statutory Bar / Ineligibility Detected — Review Alternatives");

        var listHtml = "";
        gRes.issues.forEach(function (it) {
          listHtml += '<li style="margin-bottom:6px;color:#991B1B;font-weight:600;">' + escapeHtml(isKo ? it.ko : it.en) + '</li>';
        });
        gRes.passes.forEach(function (it) {
          listHtml += '<li style="margin-bottom:6px;color:#14282A;">' + escapeHtml(isKo ? it.ko : it.en) + '</li>';
        });

        var dualHtml = "";
        if (gRes.deadlineInfo) {
          var di = gRes.deadlineInfo;
          var statRemainBadge = di.overdue
            ? (isKo
                ? '<span style="color:#991B1B;font-weight:800;">법정 접수 기한 ' + Math.abs(di.diffDays) + '일 경과 (신규 485 접수 불가)</span>'
                : '<span style="color:#991B1B;font-weight:800;">Statutory deadline expired by ' + Math.abs(di.diffDays) + ' days</span>')
            : (isKo
                ? '<span style="color:#065F46;font-weight:700;">오늘(브리즈번 기준)로부터 잔여 ' + di.diffDays + '일</span>'
                : '<span style="color:#065F46;font-weight:700;">' + di.diffDays + ' days remaining from Brisbane today</span>');

          dualHtml =
            '<div class="dual-date-grid" style="margin-top:12px;">' +
              '<div class="dual-date-box safe">' +
                '<span class="dual-date-label">' + (isKo ? "보수적 안전 접수 권고일 (마감 14일 전 영업일)" : "Recommended Safe Lodgement Date (14d Prior Business Day)") + '</span>' +
                '<strong class="dual-date-val">' + escapeHtml(di.safeIso) + '</strong>' +
                '<small>' + (isKo ? "영어 성적·AFP 범죄경력조회서·건강검진 사전 확보 기준" : "Buffer for English test, AFP police check & ImmiAccount upload") + '</small>' +
              '</div>' +
              '<div class="dual-date-box ' + (di.overdue ? "overdue" : "statutory") + '">' +
                '<span class="dual-date-label">' + (isKo ? "법정 접수 마감일 (수료 완료일 후 6개월 · cl 485.221)" : "Statutory Lodgement Deadline (6 Months Post-Completion · cl 485.221)") + '</span>' +
                '<strong class="dual-date-val">' + escapeHtml(di.statutoryIso) + '</strong>' +
                '<small>' + statRemainBadge + '</small>' +
              '</div>' +
            '</div>';
        } else if (gRes.is485 && gRes.stream !== "485_second") {
          dualHtml =
            '<div class="alert-box alert-info" style="margin-top:10px;font-size:12.5px;">' +
              (isKo
                ? "공식 학업 수료 완료일(Completion Letter 명시 날짜)을 입력하시면 보수적 안전 접수 권고일과 수료 후 6개월 법정 마감일이 나란히 계산됩니다."
                : "Enter your official Completion Letter date to calculate both your safe lodgement date and strict 6-month statutory deadline.") +
            '</div>';
        }

        gOut.innerHTML =
          '<div class="' + verdictClass + '" style="margin-bottom:10px;">' +
            '<div style="font-weight:800;font-size:14px;margin-bottom:6px;">' + escapeHtml(verdictHeading) + '</div>' +
            '<div style="font-size:12.5px;margin-bottom:8px;"><strong>' + (isKo ? "공식 비자 신청비(VAC): " : "Official VAC: ") + '</strong>' +
              escapeHtml(isKo ? gRes.vacTextKo : gRes.vacTextEn) +
            '</div>' +
            '<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.55;">' + listHtml + '</ul>' +
          '</div>' +
          dualHtml;
      }
    }

    /* --- Shared Smart Brief (Human-Readable Labels Only — Zero Raw Enum Codes) --- */
    var briefLines = [];
    if (isKo) {
      briefLines.push("[법무법인 박앤코 파트너 비자(820·309·300) · 학생·졸업생 비자(500·485) 진단 브리프]");
      briefLines.push("• 수신: 법무법인 박앤코 박창민 대표변호사 (enquiry@parkcolawyers.com | https://parklawyers.com.au/links/?lang=ko)");
      briefLines.push("• 현재 점검 탭: " + (currentMode === "graduate" ? "학생 비자(500) · 졸업생 비자(485)" : "파트너 비자(820·309·300 · Schedule 3)"));
      if (pRes.ready) {
        briefLines.push("• [파트너 트랙] 체류·비자 상태: " + getLabel("location", locVal, "ko"));
        briefLines.push("  - 권고 트랙/수수료: " + pRes.trackTitleKo + " / " + pRes.vacDisplayKo);
        briefLines.push("  - 관계 기간: " + getLabel("relDuration", relYrsVal, "ko") + " / 직행 영주권(reg 1.03): " + (pRes.directPr ? "대상 해당" : "2단계 심사 적용"));
        briefLines.push("  - Schedule 3 판정: " + pRes.schedule3TitleKo);
        briefLines.push("  - 스폰서 이력: " + getLabel("sponsorHist", spHistVal, "ko"));
      }
      if (rRes.ready && !rRes.validationError) {
        briefLines.push("• [혼인·사실혼] 법적 지위: " + getLabel("relLegal", relLegalVal, "ko") + " / 거주 주: " + stateVal + (rRes.months !== null ? " / 동거: " + rRes.months + "개월" : ""));
        briefLines.push("  - 적격 판정: " + rRes.badgeKo + " / 4대 기둥: " + getLabel("pillars", pillarsVal, "ko"));
      }
      if (gRes.ready && !gRes.validationError) {
        briefLines.push("• [학생·졸업생] 목표 스트림: " + getLabel("gradStream", gStream, "ko"));
        briefLines.push("  - 현재 비자: " + getLabel("gradHeldVisa", gHeld, "ko") + " / 과정 구분: " + getLabel("gradQual", gQual, "ko") + (gRes.age !== null ? " / 만 " + gRes.age + "세" : ""));
        if (gRes.deadlineInfo) {
          briefLines.push("  - 학업 수료 완료일: " + gRes.deadlineInfo.completionIso + " → 안전 권고일: " + gRes.deadlineInfo.safeIso + " | 법정 마감일(6개월): " + gRes.deadlineInfo.statutoryIso);
        }
      }
      if (!pRes.ready && !rRes.ready && !gRes.ready) {
        briefLines.push("• 아직 선택된 진단 항목이 없습니다. 위 진단기에서 조건을 선택하거나 [예시 조건 채우기]를 눌러 주십시오.");
      }
    } else {
      briefLines.push("[Park & Co Lawyers · Partner (820/309/300) & Student/Graduate (500/485) Diagnostic Brief]");
      briefLines.push("• To: Chang Min Park, Legal Practitioner Director (enquiry@parkcolawyers.com | https://parklawyers.com.au/links/?lang=en)");
      briefLines.push("• Active Mode: " + (currentMode === "graduate" ? "Student (500) & Graduate (485) Visas" : "Partner Visas (820/309/300 & Schedule 3)"));
      if (pRes.ready) {
        briefLines.push("• [Partner Track] Current Status: " + getLabel("location", locVal, "en"));
        briefLines.push("  - Recommended Track / VAC: " + pRes.trackTitleEn + " / " + pRes.vacDisplayEn);
        briefLines.push("  - Relationship Duration: " + getLabel("relDuration", relYrsVal, "en") + " / Direct PR (reg 1.03): " + (pRes.directPr ? "Eligible" : "Two-stage process"));
        briefLines.push("  - Schedule 3 Status: " + pRes.schedule3TitleEn);
        briefLines.push("  - Sponsor History: " + getLabel("sponsorHist", spHistVal, "en"));
      }
      if (rRes.ready && !rRes.validationError) {
        briefLines.push("• [Marriage / De Facto] Legal Status: " + getLabel("relLegal", relLegalVal, "en") + " / State: " + stateVal + (rRes.months !== null ? " / Cohabitation: " + rRes.months + " months" : ""));
        briefLines.push("  - Verdict: " + rRes.badgeEn + " / 4 Pillars: " + getLabel("pillars", pillarsVal, "en"));
      }
      if (gRes.ready && !gRes.validationError) {
        briefLines.push("• [Student / Graduate] Target Stream: " + getLabel("gradStream", gStream, "en"));
        briefLines.push("  - Current Visa: " + getLabel("gradHeldVisa", gHeld, "en") + " / Qualification: " + getLabel("gradQual", gQual, "en") + (gRes.age !== null ? " / Age " + gRes.age : ""));
        if (gRes.deadlineInfo) {
          briefLines.push("  - Completion Date: " + gRes.deadlineInfo.completionIso + " → Safe Date: " + gRes.deadlineInfo.safeIso + " | Statutory 6m Deadline: " + gRes.deadlineInfo.statutoryIso);
        }
      }
      if (!pRes.ready && !rRes.ready && !gRes.ready) {
        briefLines.push("• No diagnostic inputs selected yet. Choose your parameters above or click [Load Sample Case].");
      }
    }

    var brief = briefLines.join("\n");
    var pre = document.getElementById("pv-diagnostic-brief-text");
    if (pre) pre.textContent = brief;

    var mailBtn = document.getElementById("btn-pv-mailto");
    if (mailBtn) {
      mailBtn.href = isKo ? "https://parklawyers.com.au/links/?lang=ko" : "https://parklawyers.com.au/links/?lang=en";
      mailBtn.onclick = function () {
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(brief).catch(function () {});
        }
      };
    }
  }

  function fillSampleInputs() {
    var todayIso = ParkCoDates.todayBrisbaneIso();
    var twoMonthsAgo = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, 0, -2, 0));

    var map = {
      "pv-location": "onshore_substantive",
      "pv-rel-years": "1to2",
      "pv-shared-child": "no",
      "s3-sponsor-hist": "clean",
      "rel-legal-status": "state_registered",
      "df-state": "QLD",
      "df-months": "7",
      "df-pillars": "strong4",
      "grad-target-stream": "485_phew",
      "grad-current-visa": "500_current",
      "grad-qual-type": "bachelor_coursework",
      "grad-age": "29",
      "grad-completion-date": twoMonthsAgo
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = map[id];
    });
    updateAll();
  }

  function resetAllInputs() {
    var defaults = {
      "pv-location": "",
      "pv-rel-years": "under1",
      "pv-shared-child": "no",
      "s3-sponsor-hist": "clean",
      "rel-legal-status": "",
      "df-state": "QLD",
      "df-months": "",
      "df-pillars": "strong4",
      "grad-target-stream": "",
      "grad-current-visa": "500_current",
      "grad-qual-type": "bachelor_coursework",
      "grad-age": "",
      "grad-completion-date": ""
    };
    Object.keys(defaults).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = defaults[id];
    });
    updateAll();
  }

  /* ==========================================================================
     5. CITIZENSHIP & LIVE POLLER ACCORDION RENDERERS
     ========================================================================== */
  var cachedPvPollingStatus = null;
  var cachedCitizenshipData = {
    citizenship: {
      conferral_monthly_lodged: 16690,
      conferral_on_hand: 53298,
      duration_rows: [
        {
          id: "conferral_lodgement_to_decision",
          label_ko: "수여 시민권 (Conferral) · 1단계: 신청 접수 ~ 승인 결정",
          label_en: "Citizenship by Conferral · Stage 1: Application to Decision",
          p25_ko: "84일", p25_en: "84 days",
          p50_ko: "5개월", p50_en: "5 months",
          p75_ko: "8개월", p75_en: "8 months",
          p90_ko: "11개월", p90_en: "11 months"
        },
        {
          id: "conferral_approval_to_ceremony",
          label_ko: "수여 시민권 (Conferral) · 2단계: 승인 후 ~ 시민권 수여식 (Ceremony)",
          label_en: "Citizenship by Conferral · Stage 2: Approval to Ceremony",
          p25_ko: "66일", p25_en: "66 days",
          p50_ko: "4개월", p50_en: "4 months",
          p75_ko: "5개월", p75_en: "5 months",
          p90_ko: "7개월", p90_en: "7 months"
        },
        {
          id: "conferral_lodgement_to_ceremony",
          label_ko: "수여 시민권 (Conferral) · 전체: 신청 접수 ~ 수여식 최종 완료",
          label_en: "Citizenship by Conferral · Overall: Application to Ceremony",
          p25_ko: "6개월", p25_en: "6 months",
          p50_ko: "8개월", p50_en: "8 months",
          p75_ko: "10개월", p75_en: "10 months",
          p90_ko: "13개월", p90_en: "13 months"
        },
        {
          id: "descent_lodgement_to_decision",
          label_ko: "혈통 시민권 (Citizenship by Descent) · 신청 ~ 결정",
          label_en: "Citizenship by Descent · Application to Decision",
          p25_ko: "47일", p25_en: "47 days",
          p50_ko: "74일", p50_en: "74 days",
          p75_ko: "3개월", p75_en: "3 months",
          p90_ko: "4개월", p90_en: "4 months"
        },
        {
          id: "evidence_lodgement_to_decision",
          label_ko: "시민권 증서 발급 (Evidence of Australian Citizenship) · 신청 ~ 결정",
          label_en: "Evidence of Australian Citizenship · Application to Decision",
          p25_ko: "3일", p25_en: "3 days",
          p50_ko: "10일", p50_en: "10 days",
          p75_ko: "18일", p75_en: "18 days",
          p90_ko: "28일", p90_en: "28 days"
        }
      ]
    }
  };

  function renderCitizenshipIntelligence() {
    if (typeof document === "undefined") return;
    var kpiGrid = document.getElementById("cit-art-kpi-grid");
    var tbody = document.getElementById("cit-processing-tbody");
    if (!kpiGrid || !tbody || !cachedCitizenshipData) return;

    var isKo = currentLang === "ko";
    var cit = cachedCitizenshipData.citizenship || {};
    var kpis = [
      {
        label: isKo ? "수여 시민권(Conferral) 전체 완료" : "Conferral Overall to Ceremony",
        val: isKo ? "8개월 (p50) / 13개월 (p90)" : "8 mos (p50) / 13 mos (p90)",
        sub: isKo ? "미결 재고 53,298건 (월 신규 16,690건)" : "On-hand 53,298 (Monthly lodged 16,690)"
      },
      {
        label: isKo ? "파트너 비자(820) 1차 & ART 인용률" : "Partner 820 Primary & ART Set Aside",
        val: isKo ? "93.9% (1차) · 85.16% (ART 본안)" : "93.9% (Primary) · 85.16% (ART Substantive)",
        sub: isKo ? "이민성 미결 96,839건 · ART 중위 3년 2개월" : "DHA On-Hand 96,839 · ART p50 3y 2m"
      },
      {
        label: isKo ? "졸업생 비자(485) 거절 ART 인용률" : "Graduate 485 ART Set Aside Rate",
        val: isKo ? "93.30% (본안) · 83.99% (전체)" : "93.30% (Substantive) · 83.99% (All)",
        sub: isKo ? "본안 결정 388건 중 362건 취소·환송" : "362 of 388 substantive decisions Set Aside"
      },
      {
        label: isKo ? "시민권 거절 ART 재심 인용률" : "Citizenship Refusal ART Set Aside",
        val: isKo ? "58.82% (본안) · 31.91% (전체)" : "58.82% (Substantive) · 31.91% (All)",
        sub: isKo ? "본안 결정 51건 중 30건 취소·환송" : "30 of 51 substantive decisions Set Aside"
      }
    ];

    kpiGrid.innerHTML = kpis.map(function (k) {
      return (
        '<div class="mini-kpi">' +
          '<span>' + escapeHtml(k.label) + '</span>' +
          '<strong>' + escapeHtml(k.val) + '</strong>' +
          '<small>' + escapeHtml(k.sub) + '</small>' +
        '</div>'
      );
    }).join("");

    var rows = cit.duration_rows || [];
    tbody.innerHTML = rows.map(function (r) {
      var label = isKo
        ? (r.label_ko || ((r.stream_ko || "") + " · " + (r.stage_ko || "")))
        : (r.label_en || ((r.stream_en || "") + " · " + (r.stage_en || "")));
      var p25 = (isKo ? r.p25_ko : r.p25_en) || r.p25 || "";
      var p50 = (isKo ? r.p50_ko : r.p50_en) || r.p50 || "";
      var p75 = (isKo ? r.p75_ko : r.p75_en) || r.p75 || "";
      var p90 = (isKo ? r.p90_ko : r.p90_en) || r.p90 || "";
      return (
        '<tr>' +
          '<td><strong>' + escapeHtml(label) + '</strong></td>' +
          '<td>' + escapeHtml(p25) + '</td>' +
          '<td><strong>' + escapeHtml(p50) + '</strong></td>' +
          '<td>' + escapeHtml(p75) + '</td>' +
          '<td>' + escapeHtml(p90) + '</td>' +
        '</tr>'
      );
    }).join("");
  }

  function renderPvPollerMatrix() {
    if (typeof document === "undefined") return;
    var kpiGrid = document.getElementById("pv-poller-kpis");
    var tbody = document.getElementById("pv-poller-tbody");
    if (!kpiGrid || !tbody || !cachedPvPollingStatus) return;

    var isKo = currentLang === "ko";
    var kpis = [
      {
        label: isKo ? "파트너 비자 기본 VAC (820/309/300)" : "Partner Visa Base VAC (820/309/300)",
        val: "$11,710 AUD",
        sub: isKo ? "동반 18+ $5,860 · <18 $2,935" : "Add 18+ $5,860 · <18 $2,935"
      },
      {
        label: isKo ? "학생(500) · 졸업생(485) 기본 VAC" : "Student (500) · Graduate (485) VAC",
        val: "$2,500 / $5,750",
        sub: isKo ? "Second 485 $2,265 · 300→820 $1,955" : "Second 485 $2,265 · 300→820 $1,955"
      },
      {
        label: isKo ? "사실혼 12개월 면제 등록 주" : "Prescribed Registration States",
        val: isKo ? "6개 주/준주" : "6 Jurisdictions",
        sub: isKo ? "NSW · VIC · QLD · SA · TAS · ACT (WA/NT 제외)" : "NSW · VIC · QLD · SA · TAS · ACT (WA/NT excluded)"
      },
      {
        label: isKo ? "행정재심기구(ART) 본안 인용률" : "Official ART Set Aside Rate",
        val: "85.16% / 93.30%",
        sub: isKo ? "파트너 820 (85.16%) · 졸업생 485 (93.30%)" : "Partner 820 (85.16%) · Graduate 485 (93.30%)"
      }
    ];

    kpiGrid.innerHTML = kpis.map(function (k) {
      return (
        '<div class="mini-kpi">' +
          '<span>' + escapeHtml(k.label) + '</span>' +
          '<strong>' + escapeHtml(k.val) + '</strong>' +
          '<small>' + escapeHtml(k.sub) + '</small>' +
        '</div>'
      );
    }).join("");

    var sources = cachedPvPollingStatus.sources || [];
    tbody.innerHTML = sources.map(function (s) {
      var title = isKo ? (s.title_ko || s.title_en) : (s.title_en || s.title_ko);
      var figs = (s.extracted_figures || []).join(" · ") || "-";
      var kb = s.bytes ? Math.round(s.bytes / 1024).toLocaleString() + " KB" : "Live API";
      var method = s.method || "https-direct-live";
      return (
        '<tr>' +
          '<td><div><strong>' + escapeHtml(title) + '</strong></div>' +
            '<a href="' + escapeHtml(s.url || "#") + '" target="_blank" rel="noopener" style="font-size:11.5px;">' + escapeHtml(s.url || "") + ' &nearr;</a></td>' +
          '<td>' + escapeHtml(s.citation || "") + '</td>' +
          '<td><strong>' + escapeHtml(figs) + '</strong></td>' +
          '<td style="font-family:monospace;font-size:11.5px;"><code>' + escapeHtml(s.sha256_prefix || "") + '</code><br/><span>' + escapeHtml(kb + " (" + method + ")") + '</span></td>' +
          '<td><span class="badge badge-teal">✓ ' + escapeHtml((s.status || "verified_ok") + " (" + (s.http_status || 200) + ")") + '</span></td>' +
        '</tr>'
      );
    }).join("");
  }

  function applyLanguage(lang, updateUrl) {
    currentLang = lang === "en" ? "en" : "ko";
    if (typeof document === "undefined") return;
    document.documentElement.lang = currentLang;
    if (document.body) document.body.setAttribute("data-ui-lang", currentLang);

    var dict = currentLang === "en" ? EN_TRANSLATIONS : KO_TRANSLATIONS;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
    });
    document.querySelectorAll(".parkco-svc-link").forEach(function (lnk) {
      var h = currentLang === "en" ? lnk.getAttribute("data-en-href") : lnk.getAttribute("data-ko-href");
      if (h) lnk.setAttribute("href", h);
    });

    if (updateUrl && typeof window !== "undefined" && window.history && window.history.replaceState) {
      try {
        var u = new URL(window.location.href);
        u.searchParams.set("lang", currentLang);
        window.history.replaceState(null, "", u.toString());
      } catch (_) {}
    }

    renderPvPollerMatrix();
    renderCitizenshipIntelligence();
    updateAll();
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
      [
        "pv-location", "pv-rel-years", "pv-shared-child", "s3-sponsor-hist",
        "rel-legal-status", "df-state", "df-months", "df-pillars",
        "grad-target-stream", "grad-current-visa", "grad-qual-type", "grad-age", "grad-completion-date"
      ].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", updateAll);
          el.addEventListener("change", updateAll);
        }
      });

      var tabP = document.getElementById("tab-btn-partner");
      var tabG = document.getElementById("tab-btn-graduate");
      if (tabP) tabP.addEventListener("click", function () { setMode("partner", true); });
      if (tabG) tabG.addEventListener("click", function () { setMode("graduate", true); });

      var jumpP = document.getElementById("nav-jump-partner");
      var jumpDf = document.getElementById("nav-jump-defacto");
      var jumpG = document.getElementById("nav-jump-grad");
      if (jumpP) jumpP.addEventListener("click", function () { setMode("partner", true); });
      if (jumpDf) jumpDf.addEventListener("click", function () { setMode("partner", true); });
      if (jumpG) jumpG.addEventListener("click", function () { setMode("graduate", true); });

      var btnSample = document.getElementById("btn-fill-sample");
      if (btnSample) btnSample.addEventListener("click", fillSampleInputs);

      var btnReset = document.getElementById("btn-reset-all");
      if (btnReset) btnReset.addEventListener("click", resetAllInputs);

      document.addEventListener("click", function (ev) {
        var trg = ev.target && ev.target.closest ? ev.target.closest(".js-trigger-sample") : null;
        if (trg) {
          ev.preventDefault();
          fillSampleInputs();
        }
      });

      var btnKo = document.getElementById("btn-lang-ko");
      var btnEn = document.getElementById("btn-lang-en");
      if (btnKo) btnKo.addEventListener("click", function () { applyLanguage("ko", true); });
      if (btnEn) btnEn.addEventListener("click", function () { applyLanguage("en", true); });

      var copyBtn = document.getElementById("btn-pv-copy");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          var pre = document.getElementById("pv-diagnostic-brief-text");
          if (pre && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(pre.textContent || "").then(function () {
              copyBtn.textContent = currentLang === "ko" ? "복사 완료" : "Copied";
              setTimeout(function () {
                copyBtn.textContent = currentLang === "ko" ? KO_TRANSLATIONS.btnCopyBrief : EN_TRANSLATIONS.btnCopyBrief;
              }, 1800);
            }).catch(function () {});
          }
        });
      }

      var printBtn = document.getElementById("btn-print-doc");
      if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

      var params = new URLSearchParams(window.location.search || "");
      if (params.get("mode") === "graduate") {
        setMode("graduate", false);
      } else {
        setMode("partner", false);
      }
      if (params.get("lang") === "en") {
        applyLanguage("en", false);
      } else {
        applyLanguage("ko", false);
      }

      if (typeof fetch === "function") {
        fetch("data/polling_status.json", { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            if (!data) return;
            cachedPvPollingStatus = data;
            renderPvPollerMatrix();
          })
          .catch(function () {});

        fetch("data/citizenship_processing_data.json", { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            if (!data || !data.citizenship) return;
            cachedCitizenshipData = data;
            renderCitizenshipIntelligence();
          })
          .catch(function () {});
      }
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
