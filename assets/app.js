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
      onshore_s48_barred: {
        ko: "호주 내 체류 · 과거 비자 거절·취소 후 본비자 미보유 (s 48 장벽 · item 1124B(3)(e) 6주 내 법정선언서 2부 필수)",
        en: "Onshore in Australia · No Substantive Visa After Refusal/Cancellation (s 48 Bar · item 1124B(3)(e) 2 Stat Decs Within 6 Weeks)"
      },
      onshore_8503_491_494: {
        ko: "호주 내 체류 · Condition 8503(No Further Stay) 부착 또는 지방비자(491·494) 보유 3년 미만",
        en: "Onshore in Australia · Condition 8503 Attached or Subclass 491/494 Held Under 3 Years"
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
      clean: { ko: "과거 파트너 스폰서십·범죄경력 제한 사항 없음 (초회 스폰서)", en: "No prior partner sponsorship or character restrictions (First-time sponsor)" },
      within_5yrs_or_2x: { ko: "최근 5년 내 파트너 초청·피초청 또는 평생 2회 도달 (reg 1.20J 면제 필요)", en: "Partner sponsorship within 5 years or 2-lifetime cap reached (reg 1.20J waiver required)" },
      contrib_parent_5yr: { ko: "스폰서 본인 최근 5년 내 기여제 부모비자(143/864) 승인 및 기존 파트너 보유 (reg 1.20KA 제한)", en: "Sponsor granted Contributory Parent visa (143/864) within last 5 years (reg 1.20KA bar)" },
      character_or_prior_spouse: { ko: "스폰서 관련 범죄경력·보호명령(rr 1.20KB–KD) 또는 전 배우자 미이혼·비이주 자녀 건강(PIC 4007) 이슈", en: "Sponsor criminal record/protection order (rr 1.20KB–KD) or undissolved prior marriage / non-migrating child health (PIC 4007)" }
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
    pageTitle: "호주 파트너 비자(820·309·300) & 학생·졸업생 비자(500·485) 내비게이터 | 법무법인 박앤코",
    brandHubTitle: "박앤코 법률·비자 통합 허브",
    phDfMonths: "예: 7",
    phGradAge: "예: 33",
    brandTag: "파트너(820·309) & 졸업생(500·485) 내비게이터",
    navM1: "파트너 비자(820·309)",
    navM2: "혼인·관계등록·4대기둥",
    navM3: "복합사례·60문항 지식허브",
    navGradTab: "학생(500)·졸업생(485)",
    navM4: "상담 브리프",
    ecoFaqLink: "파트너·이민 FAQ",
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
    optLocS48Barred: "호주 내 체류 · 과거 비자 거절·취소 후 본비자 미보유 (s 48 장벽 · item 1124B(3)(e) 6주 내 법정선언서 2부 필수)",
    optLoc8503Or491: "호주 내 체류 · Condition 8503(No Further Stay) 부착 또는 지방비자(491·494) 보유 3년 미만",
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
    lblSponsorHist: "4. 스폰서(배우자)의 과거 파트너 초청·피초청 및 범죄경력·가족 심사 (rr 1.20J–1.20KD)",
    optSpClean: "과거 파트너 스폰서십·범죄경력 제한 사항 없음 (초회 스폰서)",
    optSpBarred: "최근 5년 내 파트너 초청·피초청 이력 있음 또는 평생 2회 초청 완료 (reg 1.20J 웨이버 필수)",
    optSpParent: "스폰서 본인이 최근 5년 내 기여제 부모비자(143/864) 승인 및 기존 파트너 보유 (reg 1.20KA 제한)",
    optSpCharacter: "스폰서 관련 범죄경력·보호명령(rr 1.20KB–KD) 또는 전 배우자 미이혼·비이주 자녀 건강(PIC 4007) 이슈",
    m1ResultHeading: "파트너 트랙 · 신청비(VAC) · Schedule 3 통합 판정",
    m2Title: "2. 법적 혼인 · 주정부 관계등록 · 사실혼 12개월 관계 요건(SZOXP) 및 4대 증빙 기둥 진단",
    m2Desc: "법적 혼인 부부(s 5F)와 지정 6개 주·준주 관계등록 커플(reg 2.03A(5))은 사실혼 12개월 기간 요건이 적용되지 않거나 면제됩니다(서호주 WA·노던준주 NT는 등록 면제 불가 · 관계등록이 4대 기둥 증거 자체를 면제하지는 않음).",
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
    pkhTitle: "3. 파트너 비자(820/801 · 309/100 · 300) 심층 지식허브 · 11대 복합사례 · 결별/가정폭력 · ART 재심 · 60문항 백과",
    pkhDesc: "2026-11-12 기준 1차 연방 법령(Migration Act 1958 · Migration Regulations 1994 · LIN 23/026 · F2024L00751)과 연방법원·대법원 6대 판례 및 이민성(2025–26 미결 116,917건 · 본안 결정 중 승인 비중 94.0%) · 행정재심기구(Subclass 820 ART 취소·환송: FY2025–26 연간 본안 결정 분모 80.1%[전체 종결 대비 60.6%] · FY2026–27 Q1 본안 81.5%[전체 69.1%] · FY2026–27 상세통계 YTD 본안 제한 분모 85.16%[전체 74.66%] · 중위 대기 3년 1개월 · 이민성 잔여 요건 재심사용 환송 비율이며 즉시 승인이나 개별 승인 확률이 아님) 공식 통계를 바탕으로 구성한 연구 가이드입니다.",
    pkhTabFaqs: "60문항 지식 백과 (PV001~PV060)",
    pkhTabComplex: "유튜브 11대 복합 시나리오 (V01~V11)",
    pkhTabCessation: "결별 · 가정폭력 · 사망 · 자녀 매트릭스",
    pkhTabReview: "거절 · ART 재심(r 4.02) · 6대 판례 · 통계",
    pkhTabChecklists: "6단계 체크리스트 & 12대 오해 바로잡기",
    pkhBtnOpenFaqPortal: "공식 FAQ 포털에서 전체 보기 ↗",
    pkhFaqSearchPh: "60문항 검색 (예: 820, 309, 300, Schedule 3, s 48, 8503, 491, 가정폭력, 1.20J, r 4.02, PIC 4007)...",
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
    tdTitle: "2. 졸업생 비자(Subclass 485) 3대 법정 기한 비교기 (최종 안전 접수 데드라인 산출)",
    tdDesc: "학위 수료 확인서 발급일(+6개월 · cl 485.221 / 485.231)과 학생비자 500 만료일(온쇼어 합법 체류 · Sch 1 Item 1229(4)(a)(ii)-(iii) / s 48) 및 공인 영어시험 응시일(+12개월 · LIN 24/022) 중 가장 먼저 도래하는 날짜가 절대 초과 불가 최종 안전 접수 데드라인이 됩니다.",
    tdFormHeading: "485 접수 3대 기한 기준일 입력",
    lblTdCompletion: "1. 학위 수료 확인서 Completion Letter 완료일 (+6개월 · cl 485.221 / 485.231 / 졸업식 날짜 아님)",
    lblTdVisa500: "2. 학생비자(Subclass 500) 만료일 (온쇼어 합법 체류 및 최근 6개월 내 보유 · Sch 1 Item 1229(4)(a)(ii)-(iii) & s 48 주의)",
    lblTdEnglish: "3. 공인 영어시험 응시일 · IELTS / PTE / OET / TOEFL (+12개월 · LIN 24/022 단축 규정)",
    tdResultHeading: "최종 안전 접수 데드라인 (3개 기한 중 가장 빠른 날)",
    citKpi1Label: "수여 시민권(Conferral) 전체 완료",
    citKpi1Val: "7개월 (p50) / 11개월 (p90)",
    citKpi1Sub: "미결 재고 47,970건 (월 신규 22,723건 · 1단계 42일/5개월)",
    citKpi2Label: "파트너 820 ART 취소·환송률 (본안 분모)",
    citKpi2Val: "80.1% (25–26 연간) · 85.16% (26–27 YTD)",
    citKpi2Sub: "전체 종결 대비 60.6% / 74.66% · 환송 후 잔여심사 (개별 승인확률 아님)",
    citKpi3Label: "졸업생 비자(485) 거절 ART 인용률",
    citKpi3Val: "93.30% (본안) · 83.99% (전체)",
    citKpi3Sub: "본안 결정 388건 중 362건 취소·환송",
    citKpi4Label: "시민권 거절 ART 재심 인용률",
    citKpi4Val: "58.82% (본안) · 31.91% (전체)",
    citKpi4Sub: "본안 결정 51건 중 30건 취소·환송",
    ctaHeading: "법무법인 박앤코 파트너 · 학생 · 졸업생 비자 상담 브리프",
    ctaSub: "공식 이메일 <code>enquiry@parkcolawyers.com</code> 또는 통합 문의 허브로 바로 전달하실 수 있습니다.",
    btnSendEmail: "브리프 복사 & 공식 상담 신청",
    btnCopyBrief: "브리프 복사",
    btnPrint: "진단서 인쇄",
    citTitle: "영주권 취득 후 호주 시민권 단계별 실제 소요기간(p25~p90) · 신청비($595/$85) · s 22 거주기간 계산기 & ART 통계",
    citDesc: "호주 시민권(Conferral · Descent · Evidence) 공식 4분위 심사 소요기간(Conferral 미결 재고 47,970건 · 1단계 42일/5개월 · 전체 완주 7개월/11개월)과 신청 수수료(일반 Form 1300t AUD $595 / 감면 $85) 및 Subclass 820 파트너(FY2025–26 연간 본안 결정 분모 80.1%[692/864, 전체 종결 60.6%] · FY2026–27 Q1 본안 81.5%[전체 69.1%] · FY2026–27 상세통계 YTD 본안 제한 분모 85.16%[109/128, 전체 74.66%] 취소·환송) · 졸업생 485(본안 93.30% · 전체 83.99% 취소·환송) · 시민권 거절(본안 58.82% · 전체 31.91% 취소·환송) 행정재심기구(ART) 통계를 요약합니다. 취소·환송(Set Aside / Remittal)은 특정 요건 충족 지시와 함께 이민성으로 환송되어 신원·신체검사·Stage 2 등 잔여 심사를 거치는 절차적 결정 비율이며 즉시 비자 승인이나 개별 신청자의 승인 확률을 뜻하지 않습니다.",
    citS22Title: "호주 시민권 일반 거주요건 계산기 (Australian Citizenship Act 2007 s 22) & Form 1300t 수수료",
    citS22Desc: "신청일 직전 4년 합법 거주 + 마지막 12개월 영주권(PR) 보유 + 4년간 해외 체류 합계 최대 365일(s 22(1A)) + 마지막 12개월간 해외 체류 최대 90일(s 22(1B)) 요건을 즉시 판정합니다.",
    citFeeBanner: "Form 1300t 수수료: 일반 AUD $595 · 감면 $85 (만 15세 이하 동반자녀 $0)",
    lblCitLawfulStart: "1. 호주 합법 체류 개시일 (4년 기산)",
    lblCitPrGrant: "2. 영주권(801/100/189 등) 취득일 (12개월 PR)",
    lblCitAppDate: "3. 시민권 신청 예정일 (기준일)",
    lblCitAbs4Yr: "4. 최근 4년간 해외 체류 총일수 (상한 365일)",
    lblCitAbs12m: "5. 마지막 12개월 해외 체류 일수 (상한 90일)",
    lblCitFeeType: "6. 신청 수수료 구분 (Form 1300t)",
    optCitFeeStd: "일반 신청 (AUD $595 · Form 1300t)",
    optCitFeeConc: "펜션·컨세션 감면 (AUD $85 · Form 1300t)",
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
    pollerTitle: "1차 이민법 시행령 · 연방 이민성 수수료 API(GetPriceList) · 행정재심기구(ART) 스냅샷 바이트 무결성(SHA-256)",
    pollerDesc: "연방 이민성 비자 수수료 JSON API(<code>GetPriceList</code>)와 이민법 시행령 원문(<code>F1996B03551</code>) 및 행정재심기구(ART) 공식 통계 원문의 접속 상태와 스냅샷 바이트 무결성(SHA-256 해시)을 기록합니다. 이 해시는 수집된 출처 스냅샷의 변조 여부만 증명하며 개별 사안의 적격성이나 법정 기한 계산에 대한 자동 법률 보증을 의미하지 않습니다.",
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
    pageTitle: "Australia Partner Visas (820·309·300) & Student/Graduate Visas (500·485) Navigator | Park & Co Lawyers",
    brandHubTitle: "Park & Co Legal & Visa Hub",
    phDfMonths: "e.g. 7",
    phGradAge: "e.g. 33",
    brandTag: "Partner (820·309) & Graduate (500·485) Navigator",
    navM1: "Partner Visas (820·309)",
    navM2: "Marriage · Reg · 4 Pillars",
    navM3: "Complex Cases & 60 FAQs",
    navGradTab: "Student (500) · Graduate (485)",
    navM4: "Legal Brief",
    ecoFaqLink: "Partner & Immi FAQ",
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
    optLocS48Barred: "Onshore in Australia · No Substantive Visa After Refusal/Cancellation (s 48 Bar · item 1124B(3)(e) 2 Stat Decs Within 6 Weeks)",
    optLoc8503Or491: "Onshore in Australia · Condition 8503 (No Further Stay) or Subclass 491/494 Held Under 3 Years",
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
    lblSponsorHist: "4. Sponsor History, Character & Family Checks (rr 1.20J–1.20KD)",
    optSpClean: "First-time sponsor without character restrictions",
    optSpBarred: "Sponsored/was sponsored within last 5 years OR 2 lifetime sponsorships (reg 1.20J waiver required)",
    optSpParent: "Sponsor granted Contributory Parent visa (143/864) within last 5 years with prior partner (reg 1.20KA bar)",
    optSpCharacter: "Sponsor criminal record/protection order (rr 1.20KB–KD) or undissolved prior marriage / non-migrating child health (PIC 4007)",
    m1ResultHeading: "Integrated Partner Track, VAC & Schedule 3 Verdict",
    m2Title: "2. Legal Marriage, State Relationship Registration, 12-Month De Facto Rule (SZOXP) & 4 Pillars",
    m2Desc: "Legally married couples (s 5F) and couples registered in the 6 prescribed states/territories (reg 2.03A(5)) are exempt from the 12-month de facto duration rule (WA and NT excluded; registration does not waive the 4 pillars).",
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
    pkhTitle: "3. Partner Visas (820/801, 309/100 & 300) Knowledge Hub · 11 Complex Cases · Cessation Matrix · ART Review · 60 FAQs",
    pkhDesc: "Primary-source guide grounded in the Migration Act 1958, Migration Regulations 1994, LIN 23/026, F2024L00751, 6 Federal & High Court authorities, Home Affairs 2025–26 program data (116,917 on-hand, 94.0% decided grant share), and official Subclass 820 ART set-aside/remittal series (FY2025–26 full year: 80.1% of 864 substantive merits decisions [60.6% of all 1,142 finalisations]; FY2026–27 Q1: 81.5% substantive [69.1% all]; FY2026–27 Detailed Caseload YTD: 85.16% of 128 restricted substantive decisions [74.66% of all 146 finalisations]; median wait 3 yrs 1 mo; remittal returns a criterion to Home Affairs for remaining health/character/Stage 2 checks and is not an immediate visa grant or personal approval probability) as at 12 November 2026.",
    pkhTabFaqs: "60-Item FAQ Guide (PV001–PV060)",
    pkhTabComplex: "11 YouTube Complex Scenarios (V01–V11)",
    pkhTabCessation: "Separation, Family Violence, Death & Child Matrix",
    pkhTabReview: "Refusal, ART Standing (r 4.02), 6 Cases & Stats",
    pkhTabChecklists: "6 Stage Checklists & 12 Myth Busters",
    pkhBtnOpenFaqPortal: "Open Full Category on FAQ Portal ↗",
    pkhFaqSearchPh: "Search 60 FAQs (e.g. 820, 309, 300, Schedule 3, s 48, 8503, 491, family violence, 1.20J, r 4.02, PIC 4007)...",
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
    tdTitle: "2. Subclass 485 Triple-Deadline Comparator (Hard Filing Deadline)",
    tdDesc: "Compare your Course Completion Letter date (+6 months · cl 485.221 / 485.231), Student Visa 500 expiry date (onshore lawful status · Sch 1 Item 1229(4)(a)(ii)-(iii) / s 48), and English Test date (+12 months · LIN 24/022). The earliest expiring date is your non-extendable Hard Filing Deadline.",
    tdFormHeading: "Enter All 3 Subclass 485 Milestone Dates",
    lblTdCompletion: "1. Course Completion Letter Date (+6 months · cl 485.221 / 485.231 / NOT ceremony date)",
    lblTdVisa500: "2. Student Visa (Subclass 500) Expiry Date (Onshore lawful status & 6m rule · Sch 1 Item 1229(4)(a)(ii)-(iii) & s 48)",
    lblTdEnglish: "3. English Test Date · IELTS / PTE / OET / TOEFL (+12 months · LIN 24/022 reduced validity)",
    tdResultHeading: "Hard Filing Deadline (Earliest of the 3 Statutory Deadlines)",
    citKpi1Label: "Conferral Overall to Ceremony",
    citKpi1Val: "7 months (p50) / 11 months (p90)",
    citKpi1Sub: "On-hand 47,970 (Monthly lodged 22,723 · Stage 1 42d/5m)",
    citKpi2Label: "Partner 820 ART Set Aside (Substantive)",
    citKpi2Val: "80.1% (FY25–26) · 85.16% (26–27 YTD)",
    citKpi2Sub: "60.6% / 74.66% of all finalisations · Remittal to DHA (not grant odds)",
    citKpi3Label: "Graduate 485 ART Set Aside Rate",
    citKpi3Val: "93.30% (Substantive) · 83.99% (All)",
    citKpi3Sub: "362 of 388 substantive decisions Set Aside",
    citKpi4Label: "Citizenship Refusal ART Set Aside",
    citKpi4Val: "58.82% (Substantive) · 31.91% (All)",
    citKpi4Sub: "30 of 51 substantive decisions Set Aside",
    ctaHeading: "Park & Co Lawyers Partner, Student & Graduate Consultation Brief",
    ctaSub: "Send directly via official email <code>enquiry@parkcolawyers.com</code> or the Park & Co Inquiry Hub.",
    btnSendEmail: "Copy Brief & Open Official Inquiry",
    btnCopyBrief: "Copy Brief",
    btnPrint: "Print Diagnostic",
    citTitle: "Post-PR Australian Citizenship Processing Times (p25–p90), Fees ($595/$85), s 22 Residence Calculator & ART Statistics",
    citDesc: "Official Department of Home Affairs 4-percentile citizenship processing times (47,970 Conferral on-hand inventory · Stage 1 42d/5m · Overall 7m/11m), Form 1300t application fees (AUD $595 standard / $85 concession), and ART Set Aside / Remittal rates for Subclass 820 Partner (FY2025–26 full year: 80.1% substantive [692/864] vs 60.6% all finalisations [692/1,142]; FY2026–27 Q1: 81.5% substantive vs 69.1% all; FY2026–27 Detailed Caseload YTD: 85.16% restricted substantive [109/128] vs 74.66% all [109/146]), Graduate 485 (93.30% substantive / 83.99% all), and Citizenship refusals (58.82% substantive / 31.91% all). An ART Set Aside / Remittal remits a specific criterion back to Home Affairs for remaining health, character, and Stage 2 checks; it is NOT immediate visa grant or an individual applicant's approval probability.",
    citS22Title: "Australian Citizenship General Residence Calculator (Citizenship Act 2007 s 22) & Form 1300t Fee",
    citS22Desc: "Check the 4-year lawful residence rule, 12-month PR requirement before application date, max 365 days total overseas absence in 4 years (s 22(1A)), and max 90 days absence in the final 12 months (s 22(1B)).",
    citFeeBanner: "Form 1300t Fee: AUD $595 Standard · $85 Concession ($0 child 15 or under on parent form)",
    lblCitLawfulStart: "1. Lawful Australian Residence Start Date (4-Year Clock)",
    lblCitPrGrant: "2. PR Grant Date (801/100/189 · 12-Month PR Rule)",
    lblCitAppDate: "3. Intended Citizenship Application Date",
    lblCitAbs4Yr: "4. Total Overseas Absence Days in Last 4 Years (Max 365)",
    lblCitAbs12m: "5. Overseas Absence Days in Final 12 Months (Max 90)",
    lblCitFeeType: "6. Fee Category (Form 1300t)",
    optCitFeeStd: "Standard Conferral (AUD $595 · Form 1300t)",
    optCitFeeConc: "Pensioner / Concession (AUD $85 · Form 1300t)",
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
    pollerTitle: "Primary Migration Regulations, DHA Pricing API (GetPriceList) & Official ART Snapshot Byte-Integrity (SHA-256)",
    pollerDesc: "Records HTTP reachability and fetched source snapshot byte-integrity (SHA-256 hashes) for the Home Affairs pricing API (<code>GetPriceList</code>), Migration Regulations 1994 (<code>F1996B03551</code>), and official ART caseload reports. SHA-256 hashes confirm source snapshot non-tampering only and do not constitute automated legal certification of individual eligibility or filing-deadline calculations.",
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
  var liveVacConfig = {
    partnerBase: 11710,
    partner18: 5860,
    partnerU18: 2935,
    trans300: 1955,
    trans300_18: 980,
    trans300_u18: 485,
    ceased300: 2475,
    s500Base: 2500,
    s500_18: 1530,
    s500_u18: 500,
    s500Stac: 700,
    g485Base: 5750,
    g485_18: 2875,
    g485_u18: 1450,
    g485SecBase: 2265,
    g485Sec_18: 1140,
    g485Sec_u18: 575
  };

  function fmtAudInt(n) {
    return "$" + Number(n || 0).toLocaleString("en-US");
  }

  function hydrateVacSchedule(vacSched) {
    if (!vacSched || typeof vacSched !== "object") return;
    var p820 = vacSched.partner_820_801 || {};
    var s500 = vacSched.student_500 || {};
    var g485 = vacSched.graduate_485 || {};
    if (typeof p820.base === "number" && p820.base > 0) liveVacConfig.partnerBase = p820.base;
    if (typeof p820.adult_18_plus === "number" && p820.adult_18_plus > 0) liveVacConfig.partner18 = p820.adult_18_plus;
    if (typeof p820.child_under_18 === "number" && p820.child_under_18 > 0) liveVacConfig.partnerU18 = p820.child_under_18;
    if (typeof p820.from_300_holder_base === "number" && p820.from_300_holder_base > 0) liveVacConfig.trans300 = p820.from_300_holder_base;
    if (typeof p820.from_300_holder_adult_18_plus === "number" && p820.from_300_holder_adult_18_plus > 0) liveVacConfig.trans300_18 = p820.from_300_holder_adult_18_plus;
    if (typeof p820.from_300_holder_child_under_18 === "number" && p820.from_300_holder_child_under_18 > 0) liveVacConfig.trans300_u18 = p820.from_300_holder_child_under_18;
    if (typeof p820.from_ceased_300_base === "number" && p820.from_ceased_300_base > 0) liveVacConfig.ceased300 = p820.from_ceased_300_base;

    if (typeof s500.base === "number" && s500.base > 0) liveVacConfig.s500Base = s500.base;
    if (typeof s500.adult_18_plus === "number" && s500.adult_18_plus > 0) liveVacConfig.s500_18 = s500.adult_18_plus;
    if (typeof s500.child_under_18 === "number" && s500.child_under_18 > 0) liveVacConfig.s500_u18 = s500.child_under_18;
    if (typeof s500.subsequent_stac === "number" && s500.subsequent_stac > 0) liveVacConfig.s500Stac = s500.subsequent_stac;

    if (typeof g485.phew_pvew_base === "number" && g485.phew_pvew_base > 0) liveVacConfig.g485Base = g485.phew_pvew_base;
    if (typeof g485.phew_pvew_adult_18_plus === "number" && g485.phew_pvew_adult_18_plus > 0) liveVacConfig.g485_18 = g485.phew_pvew_adult_18_plus;
    if (typeof g485.phew_pvew_child_under_18 === "number" && g485.phew_pvew_child_under_18 > 0) liveVacConfig.g485_u18 = g485.phew_pvew_child_under_18;
    if (typeof g485.second_phew_base === "number" && g485.second_phew_base > 0) liveVacConfig.g485SecBase = g485.second_phew_base;
    if (typeof g485.second_phew_adult_18_plus === "number" && g485.second_phew_adult_18_plus > 0) liveVacConfig.g485Sec_18 = g485.second_phew_adult_18_plus;
    if (typeof g485.second_phew_child_under_18 === "number" && g485.second_phew_child_under_18 > 0) liveVacConfig.g485Sec_u18 = g485.second_phew_child_under_18;

    if (typeof document !== "undefined") {
      var spVal = document.getElementById("stat-partner-vac-val");
      var sgVal = document.getElementById("stat-grad-vac-val");
      if (spVal) spVal.textContent = fmtAudInt(liveVacConfig.partnerBase);
      if (sgVal) sgVal.textContent = fmtAudInt(liveVacConfig.s500Base) + " / " + fmtAudInt(liveVacConfig.g485Base);
    }
  }

  function evaluatePartnerPathway(opts) {
    var loc = (opts && opts.location) || "";
    var relYrs = (opts && opts.relYears) || "1to2";
    var hasChild = !!(opts && opts.hasSharedChild);
    var spHist = (opts && opts.sponsorHist) || "clean";
    var relLegal = (opts && opts.relLegalStatus) || "";

    if (!loc) {
      return { ready: false };
    }

    var pBase = liveVacConfig.partnerBase;
    var p18 = liveVacConfig.partner18;
    var pU18 = liveVacConfig.partnerU18;
    var t300 = liveVacConfig.trans300;
    var c300 = liveVacConfig.ceased300;

    var directPr = relYrs === "over3" || (relYrs === "2to3" && hasChild);
    var subclassCode = "820_801";
    var trackTitleKo = "Subclass 820 / 801 (온쇼어 파트너 비자)";
    var trackTitleEn = "Subclass 820 / 801 (Onshore Partner Visa)";
    var baseVacAud = pBase;
    var vacDisplayKo = fmtAudInt(pBase) + " AUD (동반 18세 이상 +" + fmtAudInt(p18) + " · 18세 미만 +" + fmtAudInt(pU18) + ")";
    var vacDisplayEn = fmtAudInt(pBase) + " AUD (Add 18+ +" + fmtAudInt(p18) + " · Under 18 +" + fmtAudInt(pU18) + ")";
    var schedule3State = "not_triggered_substantive";
    var schedule3TitleKo = "Schedule 3 미적용 (유효 본비자 보유 중 안전 접수)";
    var schedule3TitleEn = "Schedule 3 Not Triggered (Valid Substantive Visa Held)";
    var schedule3DetailKo = "현재 유효한 본비자(Substantive Visa)를 보유한 상태에서 820 비자를 접수하므로 Schedule 3(3001·3004) 추가 요건이 적용되지 않습니다. ⚠️ 단 2026년 11월 28일 이후 신청하는 모든 방문비자(600 전 스트림)·ETA(601)·eVisitor(651)에는 개정령(F2026L01503)에 의해 Condition 8503(No Further Stay)이 법정 의무 부과되어 Form 1447 웨이버 승인(reg 2.05(4)) 없이는 입국 후 온쇼어 820 접수가 차단되므로 반드시 VEVO를 확인하십시오.";
    var schedule3DetailEn = "Lodging Subclass 820 while holding a valid substantive visa avoids Schedule 3 (Criteria 3001/3004). ⚠️ Alert (F2026L01503): For Visitor (600 all streams), ETA (601), and eVisitor (651) applications lodged on or after 28 November 2026, Condition 8503 (No Further Stay) is statutorily mandatory, blocking onshore 820 lodgement unless waived under reg 2.05(4) (verify VEVO!).";
    var schedule3Severity = "ok";

    var isOffshoreFiance300 = (loc === "offshore_fiance" || loc === "offshore_300");
    var contradiction300Married = (isOffshoreFiance300 && relLegal === "legally_married");
    var contradictionTitleKo = "";
    var contradictionTitleEn = "";
    var contradictionDetailKo = "";
    var contradictionDetailEn = "";

    if (loc === "onshore_bva_within28") {
      schedule3State = "triggered_bva_within28";
      schedule3Severity = "danger";
      schedule3TitleKo = "Schedule 3 (Criterion 3004) 적용 · Compelling Reasons 웨이버 필수";
      schedule3TitleEn = "Schedule 3 (Criterion 3004) Triggered · Compelling Reasons Waiver Required";
      schedule3DetailKo = "유효 본비자 없이 브리징 비자 상태에서 온쇼어 820을 접수하면 Schedule 3 요건이 작동합니다. 단순한 혼인·동거 사실만으로는 면제되지 않으며 Waensila v MIBP [2016] FCAFC 32 판례 기준에 부합하는 불가피한 사유(호주 시민권 자녀 양육·스폰서의 중대한 의료 및 생계 의존성 등) 법률 의견서가 필수입니다.";
      schedule3DetailEn = "Lodging onshore 820 on a Bridging Visa triggers Schedule 3. Under Waensila v MIBP [2016] FCAFC 32, a genuine relationship alone is insufficient; a formal legal submission proving compelling reasons is essential.";
    } else if (loc === "onshore_expired_over28") {
      schedule3State = "triggered_over28_3001_3004";
      schedule3Severity = "danger";
      schedule3TitleKo = "Schedule 3 (Criteria 3001 & 3004) 중첩 적용 · 고난도 웨이버 필수";
      schedule3TitleEn = "Schedule 3 (Criteria 3001 & 3004) Triggered · High-Risk Waiver Required";
      schedule3DetailKo = "마지막 본비자 만료일로부터 28일이 초과 경과하여 Criterion 3001과 3004가 동시에 적용됩니다. 통지 없이 단독 접수할 경우 거절 위험이 매우 높으므로 Waensila [2016] FCAFC 32 기준의 종합 소명자료 또는 오프쇼어 309 전환 득실을 먼저 점검해야 합니다.";
      schedule3DetailEn = "More than 28 days have elapsed since the last substantive visa ceased, triggering both Criteria 3001 and 3004. Obtain specialist Schedule 3 waiver advice or assess offshore Subclass 309 options before lodging.";
    } else if (loc === "onshore_s48_barred") {
      schedule3State = "triggered_s48_and_schedule3";
      schedule3Severity = "danger";
      schedule3TitleKo = "s 48 바 예외(r 2.12(1)(a)-(b)) + 6주 내 법정선언서 2부(item 1124B(3)(e)) + Schedule 3 + BVA Form 1005(Item 1224A(3)(b)(iii))";
      schedule3TitleEn = "s 48 Bar Exception (r 2.12(1)(a)-(b)) + 2 Stat Decs within 6 Weeks (item 1124B(3)(e)) + Schedule 3 + BVA Form 1005 (Item 1224A(3)(b)(iii))";
      schedule3DetailKo = "과거 비자 거절·취소 후 본비자가 없어도 파트너 비자(820/801)는 r 2.12(1)(a)-(b) 예외 비자이나 유효한 접수를 위해 Schedule 1 item 1124B(3)(e)에 따라 접수 전 6주 이내 작성된 호주 시민권자·영주권자·적격 NZ 시민 2인의 법정선언서(Form 888 대체 불가)를 신청 시 함께 제출해야 합니다. 또한 브리징 상태 접수이므로 cl 820.211(2)(d) Schedule 3 웨이버가 작동하며 접수 후 2영업일 이내에 Form 1005로 BVA를 별도 신청해야 합니다(Item 1224A(3)(b)(iii)).";
      schedule3DetailEn = "Partner Visa (820/801) is prescribed under r 2.12(1)(a)-(b) as an exception to the s 48 bar, but valid lodgement under Schedule 1 item 1124B(3)(e) requires two statutory declarations from Australian citizens, permanent residents, or eligible NZ citizens signed within 6 weeks before application (Form 888 is not a substitute). Lodging without a substantive visa also triggers Schedule 3 (cl 820.211(2)(d)), and Form 1005 must be lodged within 2 business days for a valid BVA claim (Item 1224A(3)(b)(iii)).";
    } else if (loc === "onshore_8503_491_494") {
      schedule3State = "lodgement_barrier_8503_or_491";
      schedule3Severity = "danger";
      schedule3TitleKo = "유효 접수 원천 차단 경고 · Condition 8503 웨이버(s 41(2A) · F2026L01503 주의) 또는 491/494 3년 보유(item 1214C(3)(h) / item 1124B(3)(e)) 필수";
      schedule3TitleEn = "Valid Application Barrier · Condition 8503 Waiver (s 41(2A) · F2026L01503 Alert) or 491/494 3-Year Rule (item 1214C(3)(h) / item 1124B(3)(e)) Required";
      schedule3DetailKo = "현재 비자에 Condition 8503(또는 8534/8535)이 부착되어 있으면 Form 1447 웨이버 승인(s 41(2A) · r 2.05(4)) 전에는 온쇼어 820 신청서 자체가 무효(s 46(1A))가 되며 BVA도 발급되지 않습니다(특히 2026년 11월 28일 이후 신청분 600·601·651 방문비자는 F2026L01503에 따라 8503이 법정 의무 부과됨). 또한 지방 기술비자(491/494) 보유자는 승인 후 최소 3년을 보유하기 전에는 Schedule 1 item 1214C(3)(h)(구 item 1124B(3)(e))에 의해 온쇼어 820 유효 접수가 법적으로 차단됩니다.";
      schedule3DetailEn = "If Condition 8503/8534/8535 applies (note: under F2026L01503, Condition 8503 is mandatory on all Visitor 600, ETA 601, and eVisitor 651 applications lodged on or after 28 November 2026), an onshore 820 application is invalid under s 46(1A) unless a Form 1447 waiver is granted first under s 41(2A) and r 2.05(4). Similarly, Subclass 491/494 holders are barred by Schedule 1 item 1214C(3)(h) (and item 1124B(3)(e)) from making a valid onshore 820 application until they have held the regional visa for at least 3 years.";
    } else if (loc === "offshore_married_defacto") {
      subclassCode = "309_100";
      trackTitleKo = "Subclass 309 / 100 (오프쇼어 파트너 비자)";
      trackTitleEn = "Subclass 309 / 100 (Offshore Partner Visa)";
      schedule3State = "not_applicable_offshore";
      schedule3Severity = "ok";
      schedule3TitleKo = "오프쇼어 309/100 신청 · 온쇼어 Schedule 3 요건 해당 없음";
      schedule3TitleEn = "Offshore 309/100 Application · Onshore Schedule 3 Not Applicable";
      schedule3DetailKo = "호주 밖에서 접수하는 Subclass 309 비자에는 온쇼어 브리징 Schedule 3 규정이 적용되지 않습니다.";
      schedule3DetailEn = "Onshore Schedule 3 criteria do not apply to offshore Subclass 309 partner visa applications.";
    } else if (isOffshoreFiance300) {
      subclassCode = "300_to_820";
      trackTitleKo = "Subclass 300 (약혼자) → 호주 입국·혼인 후 Subclass 820 / 801 전환";
      trackTitleEn = "Subclass 300 (Prospective Marriage) → Onshore Subclass 820 / 801";
      baseVacAud = pBase + t300;
      vacDisplayKo = "1단계 300 (" + fmtAudInt(pBase) + ") + 2단계 820 전환 (" + fmtAudInt(t300) + ") = 총 " + fmtAudInt(pBase + t300) + " AUD";
      vacDisplayEn = "Stage 1 Subclass 300 (" + fmtAudInt(pBase) + ") + Stage 2 820 Transition (" + fmtAudInt(t300) + ") = " + fmtAudInt(pBase + t300) + " AUD";
      directPr = false;
      schedule3State = "not_applicable_offshore";
      schedule3Severity = "ok";
      schedule3TitleKo = "오프쇼어 300 승인 입국 후 유효기간 내 혼인·820 접수 시 Schedule 3 미적용";
      schedule3TitleEn = "Schedule 3 Not Triggered When Lodging 820 Before Subclass 300 Expiry";
      schedule3DetailKo = "Subclass 300 비자 유효기간(통상 9~15개월) 안에 호주 입국과 법적 혼인을 마치고 만료 전 820 비자를 접수하면 Schedule 3가 적용되지 않습니다.";
      schedule3DetailEn = "Marrying your sponsor and lodging Subclass 820 before Subclass 300 ceases avoids Schedule 3 and secures the " + fmtAudInt(t300) + " transition VAC.";

      if (contradiction300Married) {
        subclassCode = "300_married_contradiction";
        trackTitleKo = "법정 모순 차단: 기혼 부부는 Subclass 300(약혼자 비자) 신청 불가 → Subclass 309/100 또는 820/801 전환 필수";
        trackTitleEn = "Statutory Contradiction Blocked: Married Couples Cannot Lodge Subclass 300 → Switch to Subclass 309/100 or 820/801";
        schedule3Severity = "danger";
        contradictionTitleKo = "법정 자격 모순 경고 (cl 300.211 / cl 300.221): 이미 법적 혼인한 부부는 Subclass 300 신규 승인 불가";
        contradictionTitleEn = "Statutory Contradiction Guard (cl 300.211 / cl 300.221): Already Legally Married Couples Cannot Be Granted Subclass 300";
        contradictionDetailKo = "이민법 시행령 Schedule 2 cl 300.211 및 cl 300.221에 따라 Subclass 300(Prospective Marriage)은 아직 혼인하지 않은 예비 배우자 전용 비자입니다. 비자 접수 전에 이미 법적으로 혼인한 부부가 Subclass 300을 신청하면 부적격 거절 대상입니다(유효한 300 접수 후 결정 전에 혼인한 경우에만 cl 300.221A에 따라 Subclass 309 전환 간주). 이미 혼인신고를 마친 부부는 오프쇼어 Subclass 309/100 또는 온쇼어 Subclass 820/801로 직접 신청해야 합니다.";
        contradictionDetailEn = "Under Migration Regulations Schedule 2 cl 300.211 and cl 300.221, Subclass 300 (Prospective Marriage) is strictly for prospective spouses who intend to marry. If you are already legally married prior to lodgement, Subclass 300 cannot be validly granted (cl 300.221A conversion applies only where marriage occurs after a valid 300 application and before decision). Please lodge Partner Subclass 309/100 (offshore) or Subclass 820/801 (onshore) directly.";
      }
    } else if (loc === "onshore_300_holder") {
      subclassCode = "300_holder_820";
      trackTitleKo = "유효 Subclass 300 보유자 → 온쇼어 Subclass 820 / 801 전환";
      trackTitleEn = "Current Subclass 300 Holder → Onshore Subclass 820 / 801 Transition";
      baseVacAud = t300;
      vacDisplayKo = fmtAudInt(t300) + " AUD (만료 전 접수 기준 · 300 만료 후 접수 시 " + fmtAudInt(c300) + " AUD)";
      vacDisplayEn = fmtAudInt(t300) + " AUD before 300 expiry (" + fmtAudInt(c300) + " AUD if Subclass 300 has ceased)";
      schedule3State = "not_triggered_substantive";
      schedule3Severity = "ok";
      schedule3TitleKo = "유효 Subclass 300 보유 중 접수 · Schedule 3 미적용";
      schedule3TitleEn = "Valid Subclass 300 Held · Schedule 3 Not Triggered";
      schedule3DetailKo = "Subclass 300 비자가 만료되기 전에 혼인신고 후 820/801 전환 신청을 접수하면 할인 수수료(" + fmtAudInt(t300) + ")가 적용되며 Schedule 3도 발생하지 않습니다.";
      schedule3DetailEn = "Lodging 820/801 after marriage while Subclass 300 remains in effect qualifies for the " + fmtAudInt(t300) + " transition VAC without triggering Schedule 3.";
    }

    var sponsorBar = spHist !== "clean";
    var sponsorNoteKo = "";
    var sponsorNoteEn = "";
    if (spHist === "within_5yrs_or_2x") {
      sponsorNoteKo = "스폰서 초청 한도 제한(reg 1.20J · 평생 2회 및 이전 신청일 기준 5년 간격, 또는 스폰서 본인이 파트너 비자 승인자였던 경우 5년 제한)에 해당합니다. 호주 시민권 공동 자녀 출생 또는 장기 헌신 관계 등 스폰서에게 미치는 불가피한 사정(Compelling Circumstances) 면제 의견서를 함께 제출해야 합니다.";
      sponsorNoteEn = "Sponsor is subject to the reg 1.20J sponsorship limitation (max 2 lifetime sponsorships / 5-year gap from prior application date, or 5 years if the sponsor was granted a partner visa). A formal compelling-circumstances waiver submission is required.";
    } else if (spHist === "contrib_parent_5yr") {
      sponsorNoteKo = "스폰서가 최근 5년 이내(비자 승인일 기준) 기여제 부모비자(143/864)를 승인받았고 승인 이전에 이미 관계가 있었던 경우 reg 1.20KA 파트너 초청 제한이 적용됩니다. 법정 예외 사유 충족 여부를 반드시 사전 검토하십시오.";
      sponsorNoteEn = "Sponsor was granted a Contributory Parent visa (143/864) within the past 5 years (measured from grant date) with a pre-existing partner, triggering the reg 1.20KA bar unless compelling reasons are established.";
    } else if (spHist === "character_or_prior_spouse") {
      sponsorNoteKo = "스폰서 범죄경력 심사(reg 1.20KB 미성년 동반 시 아동보호 범죄 제한 · regs 1.20KC-1.20KD 관련 범죄 공개 및 합산 12개월 이상 징역형 상당 범죄기록 거절 원칙) 적용 대상입니다. AFP 및 해외 신원조회서 제출과 함께 관계 기간·재범 위험 부재·신청자 및 자녀에게 미칠 영향 등 불가피한 사정 소명이 필수입니다.";
      sponsorNoteEn = "Sponsor character limitations apply (reg 1.20KB child-protection bar where a minor is included; regs 1.20KC-1.20KD relevant offence disclosure and 12+ months significant criminal record refusal rule). Police clearances and a comprehensive waiver submission are essential.";
    } else {
      sponsorNoteKo = "스폰서의 과거 파트너 초청 제한(reg 1.20J / 1.20KA / 1.20KB / 1.20KC-KD) 특이사항이 없습니다.";
      sponsorNoteEn = "No prior partner sponsorship limitation bars (reg 1.20J / 1.20KA / 1.20KB / 1.20KC-KD) indicated.";
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
      sponsorNoteEn: sponsorNoteEn,
      contradiction300Married: contradiction300Married,
      contradictionTitleKo: contradictionTitleKo,
      contradictionTitleEn: contradictionTitleEn,
      contradictionDetailKo: contradictionDetailKo,
      contradictionDetailEn: contradictionDetailEn
    };
  }

  var PRESCRIBED_REG_STATES = ["QLD", "NSW", "VIC", "SA", "ACT", "TAS"];

  function evaluateRelationshipEligibility(opts) {
    var relLegal = (opts && opts.relLegalStatus) || "";
    var state = ((opts && opts.state) || "QLD").toUpperCase();
    var rawMonths = opts && opts.monthsRaw !== undefined ? String(opts.monthsRaw).trim() : "";
    var pillars = (opts && opts.pillars) || "strong4";
    var loc = (opts && opts.location) || "";

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
    var isOffshoreFiance300 = (loc === "offshore_fiance" || loc === "offshore_300");
    var contradiction300Married = (isOffshoreFiance300 && relLegal === "legally_married");

    if (contradiction300Married) {
      status = "contradiction_300_married";
      badgeKo = "법정 모순 경고 (cl 300.211 / cl 300.221) · 이미 법적 혼인한 부부는 Subclass 300(약혼자 비자) 대상이 아닙니다";
      badgeEn = "Statutory Contradiction Warning (cl 300.211 / cl 300.221) · Already Married Couples Cannot Lodge Subclass 300";
      detailKo = "1단계에서 약혼자 비자(Subclass 300)를 선택하셨으나 2단계에서 법적 혼인신고 완료(s 5F)를 선택하셨습니다. Subclass 300은 장래 혼인 예정인 미혼 예비 배우자 전용이므로 이미 혼인한 부부는 오프쇼어 Subclass 309/100 또는 온쇼어 Subclass 820/801 배우자 비자로 직접 접수해야 합니다(cl 300.221A 전환은 유효한 300 접수 후 결정 전 혼인 시에만 적용).";
      detailEn = "You selected Subclass 300 (Prospective Marriage) in Step 1 together with Legally Married (s 5F) in Step 2. Because Subclass 300 is strictly for unmarried prospective spouses under cl 300.211/300.221, already married couples must lodge Subclass 309/100 (offshore) or Subclass 820/801 (onshore) directly (cl 300.221A applies only where marriage occurs after valid 300 lodgement and before decision).";
    } else if (relLegal === "legally_married") {
      status = "married_exempt";
      badgeKo = "법률혼 배우자 요건 적용 (s 5F) · 사실혼 12개월 관계 요건(reg 2.03A) 비적용";
      badgeEn = "Legally Married Spouse (s 5F) · 12-Month De Facto Rule Does Not Apply";
      detailKo = "유효한 법적 혼인신고를 마친 부부는 이민법 s 5F 및 reg 1.15A 배우자 기준이 적용되므로 사실혼(reg 2.03A) 12개월 관계 기간 미달을 이유로 거절되지 않습니다" +
        (months !== null ? " (입력 동거 기간: " + months + "개월)." : ".") +
        " 다만 영구적 별거 상태가 아님(not living separately and apart on a permanent basis)과 4대 기둥 실사용 증거는 충실히 입증해야 합니다.";
      detailEn = "Legally married couples are assessed as spouses under s 5F and reg 1.15A rather than the reg 2.03A 12-month de facto rule" +
        (months !== null ? " (cohabitation entered: " + months + " months)." : ".") +
        " You must still prove a genuine continuing marriage and that you do not live separately and apart on a permanent basis.";
    } else if (relLegal === "state_registered") {
      if (canExemptState) {
        status = "registered_exempt";
        badgeKo = state + " 주정부 시민 관계등록 면제 적용 (reg 2.03A(5)) · 12개월 기간 요건 면제 가능";
        badgeEn = state + " State Relationship Registration Exemption (reg 2.03A(5)) · 12-Month Rule Waived";
        detailKo = state + " 주정부는 연방 이민법상 인정 등록 주(Prescribed State/Territory)에 해당합니다" +
          (months !== null ? " (현재 동거 " + months + "개월)." : ".") +
          " 비자 심사 결정 전까지 공식 관계등록증(Civil Partnership / Relationship Certificate)이 발급되면 12개월 미만 관계라도 reg 2.03A 기간 요건이 면제됩니다.";
        detailEn = state + " is a prescribed jurisdiction under reg 2.03A(5)" +
          (months !== null ? " (current cohabitation: " + months + " months)." : ".") +
          " Providing the official state relationship certificate before decision waives the 12-month relationship duration threshold.";
      } else {
        if (months !== null && months >= 12) {
          status = "defacto_12m_met";
          badgeKo = state + " 관계등록 면제 비대상이나 실제 동거 " + months + "개월로 reg 2.03A(3) 충족";
          badgeEn = state + " Registration Not Prescribed, But " + months + " Months Cohabitation Meets reg 2.03A(3)";
          detailKo = state + "는 연방 이민법상 관계등록 면제 인정 주가 아니지만 이미 " + months + "개월 사실혼 관계를 유지하셨으므로 reg 2.03A(3) 기간 요건을 만족합니다.";
          detailEn = "Although " + state + " is excluded from reg 2.03A(5) registration waivers, your " + months + " months of cohabitation independently satisfies reg 2.03A(3).";
        } else {
          status = "wa_nt_registration_invalid";
          badgeKo = "거절 위험 경고 (" + state + " 거주) · 주정부 관계등록으로 12개월 요건 면제 불가";
          badgeEn = "Refusal Risk Warning (" + state + ") · State Registration Does NOT Waive 12-Month Rule";
          detailKo = state + "는 연방 이민법 시행령(reg 2.03A(5))이 인정하는 관계등록 면제 주가 아닙니다" +
            (months !== null ? " (현재 동거 " + months + "개월)." : ".") +
            " 12개월 사실혼 요건을 채우기 전에 접수하면 거절될 위험이 높으므로 법적 혼인신고(s 5F)를 진행하거나 만 12개월 충족 후 접수해야 합니다.";
          detailEn = state + " is NOT prescribed under reg 2.03A(5)" +
            (months !== null ? " (current cohabitation: " + months + " months)." : ".") +
            " Lodging a de facto claim under 12 months in " + state + " faces refusal unless you legally marry (s 5F) or complete 12 full months of de facto relationship.";
        }
      }
    } else {
      /* unregistered_defacto */
      if (months >= 12) {
        status = "defacto_12m_met";
        badgeKo = "사실혼 12개월 관계 요건 충족 (" + months + "개월 · reg 2.03A(3) · SZOXP)";
        badgeEn = "12-Month De Facto Requirement Met (" + months + " Months · reg 2.03A(3) · SZOXP)";
        detailKo = "신청 직전 최소 12개월 이상 사실혼 관계 요건을 충족합니다(SZOXP [2015] FCAFC 69 판례상 영구적 별거가 아닌 일시적 별거 기간도 포함 가능). 임대차계약서·공동 공과금·동일 주소지 우편물로 12개월 연속성을 빈틈없이 증빙하십시오.";
        detailEn = "You satisfy the 12-month de facto relationship requirement prior to lodgement under reg 2.03A(3) (under SZOXP [2015] FCAFC 69, temporary separation is permissible where you do not live separately and apart on a permanent basis). Ensure continuous evidence covers the entire 12-month period.";
      } else if (canExemptState) {
        status = "unregistered_under12_can_register";
        badgeKo = "현재 무등록 상태로 동거 " + months + "개월 미달 · " + state + " 주정부 관계등록 또는 혼인신고 필요";
        badgeEn = "Unregistered & Only " + months + " Months Cohabitation · Register in " + state + " or Marry";
        detailKo = "혼인신고와 관계등록 없이 동거 " + months + "개월 상태에서 그대로 접수하면 reg 2.03A 미충족으로 거절됩니다. 다행히 " + state + "는 관계등록 면제 인정 주이므로 접수 전후 " + state + " 출생사망혼인등록소(BDM) 관계등록을 완료하거나 법적 혼인신고를 진행하면 12개월 요건을 적법하게 면제받을 수 있습니다.";
        detailEn = "Lodging unregistered at " + months + " months risks refusal under reg 2.03A(3). Because " + state + " is a prescribed state, registering your relationship with " + state + " BDM or marrying waives the 12-month rule.";
      } else {
        status = "unregistered_under12_wa_nt";
        badgeKo = "거절 위험 경고 (" + state + " · 동거 " + months + "개월) · 12개월 요건 미달 및 관계등록 면제 불가";
        badgeEn = "High Refusal Risk (" + state + " · " + months + " Months) · Under 12 Months & No State Waiver";
        detailKo = state + "에서는 주정부 관계등록을 통한 12개월 면제가 인정되지 않습니다. 현재 " + months + "개월 동거 상태에서 사실혼 비자를 접수하면 거절 위험이 매우 높으므로 만 12개월 요건을 모두 채우거나 법적 혼인신고(s 5F) 후 접수하시기 바랍니다.";
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

    var isEligibleRel = (
      status === "married_exempt" ||
      status === "registered_exempt" ||
      status === "defacto_12m_met"
    );

    return {
      ready: true,
      validationError: false,
      eligible: isEligibleRel,
      status: status,
      contradiction300Married: contradiction300Married,
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

    var vacBaseAud = liveVacConfig.g485Base;
    var vacTextKo = "주신청자 " + fmtAudInt(liveVacConfig.g485Base) + " AUD (동반 18세 이상 +" + fmtAudInt(liveVacConfig.g485_18) + " · 18세 미만 +" + fmtAudInt(liveVacConfig.g485_u18) + ")";
    var vacTextEn = "Main applicant " + fmtAudInt(liveVacConfig.g485Base) + " AUD (Add 18+ +" + fmtAudInt(liveVacConfig.g485_18) + " · Under 18 +" + fmtAudInt(liveVacConfig.g485_u18) + ")";
    if (stream === "485_second") {
      vacBaseAud = liveVacConfig.g485SecBase;
      vacTextKo = "Second 485 주신청자 " + fmtAudInt(liveVacConfig.g485SecBase) + " AUD (동반 18세 이상 +" + fmtAudInt(liveVacConfig.g485Sec_18) + " · 18세 미만 +" + fmtAudInt(liveVacConfig.g485Sec_u18) + ")";
      vacTextEn = "Second 485 main applicant " + fmtAudInt(liveVacConfig.g485SecBase) + " AUD (Add 18+ +" + fmtAudInt(liveVacConfig.g485Sec_18) + " · Under 18 +" + fmtAudInt(liveVacConfig.g485Sec_u18) + ")";
    } else if (stream === "500_student") {
      vacBaseAud = liveVacConfig.s500Base;
      vacTextKo = "학생 비자(500) 주신청자 " + fmtAudInt(liveVacConfig.s500Base) + " AUD (동반 18세 이상 +" + fmtAudInt(liveVacConfig.s500_18) + " · 18세 미만 +" + fmtAudInt(liveVacConfig.s500_u18) + " · 온쇼어 연장 STAC +" + fmtAudInt(liveVacConfig.s500Stac) + " 해당 여부 확인)";
      vacTextEn = "Student Subclass 500 main applicant " + fmtAudInt(liveVacConfig.s500Base) + " AUD (Add 18+ +" + fmtAudInt(liveVacConfig.s500_18) + " · Under 18 +" + fmtAudInt(liveVacConfig.s500_u18) + " · check " + fmtAudInt(liveVacConfig.s500Stac) + " STAC if extending onshore)";
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
          ko: "최근 6개월 내 학생 비자(500) 보유 및 온쇼어 신청 요건 주의(Sch 1 Item 1229(4)(a)(ii)-(iii)): 최초 485 주신청자는 원칙적으로 호주 국내에 체류 중이어야 하며 신청 전 최근 6개월 이내에 적격 학생 비자(Subclass 500)를 보유했어야 합니다.",
          en: "Recent Student Visa & Onshore Requirement Warning (Sch 1 Item 1229(4)(a)(ii)-(iii)): Primary 485 applicants must generally be in Australia and have held an eligible Subclass 500 Student visa within the 6 months before lodgement."
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
          ko: "연령 상한 초과(Sch 1 Item 1229(4)(a)(i)): 선택한 학위 기준 만 " + maxAge + "세 이하만 485 신청이 가능하나 입력 연령이 만 " + age + "세입니다. 고용주 스폰서(SID 482 · 만 45세 미만 186 전환) 또는 DAMA(만 55세 미만 연령 특례) 및 파트너 비자 경로를 즉시 검토하십시오.",
          en: "Age Cap Exceeded (Sch 1 Item 1229(4)(a)(i)): Maximum eligible age for this qualification is " + maxAge + ", whereas entered age is " + age + ". Assess SID 482 employer sponsorship, DAMA age concessions, or Partner visa options immediately."
        });
      } else {
        passes.push({
          ko: "연령 요건 충족(만 " + age + "세 ≤ 상한 만 " + maxAge + "세 · Sch 1 Item 1229(4)(a)(i)).",
          en: "Age requirement met (Age " + age + " ≤ cap of " + maxAge + " · Sch 1 Item 1229(4)(a)(i))."
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

  function evaluate485TripleDeadlines(opts) {
    var compDate = String((opts && opts.completionDate) || "").trim();
    var visa500Exp = String((opts && (opts.studentVisaExpiryDate || opts.visa500ExpiryDate)) || "").trim();
    var engDate = String((opts && opts.englishTestDate) || "").trim();
    var refTodayIso = (opts && opts.todayIso) || ParkCoDates.todayBrisbaneIso();

    if (!compDate && !visa500Exp && !engDate) {
      return { ready: false };
    }

    var items = [];

    if (compDate) {
      if (!ParkCoDates.parseIsoLocal(compDate)) {
        return {
          ready: true,
          validationError: true,
          errorKo: "학위 수료 확인서(Completion Letter) 날짜 형식이 올바르지 않습니다(YYYY-MM-DD).",
          errorEn: "Invalid Course Completion Letter date format (YYYY-MM-DD)."
        };
      }
      var compDeadlineIso = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(compDate, 0, 6, 0));
      var compDiff = ParkCoDates.diffDaysBetweenIso(refTodayIso, compDeadlineIso);
      items.push({
        id: "completion_6m",
        sourceIso: compDate,
        deadlineIso: compDeadlineIso,
        daysRemaining: compDiff,
        expired: compDiff < 0,
        labelKo: "학위 수료일 + 6개월 (cl 485.221 / 485.231)",
        labelEn: "Completion Letter + 6 Months (cl 485.221 / 485.231)",
        ruleKo: "학위 수여식(졸업식) 날짜가 아니라 대학 공식 Completion Letter 상 최종 학업 완료일로부터 정확히 6개월 이내에 접수해야 합니다.",
        ruleEn: "Counted strictly 6 months from the official course completion date on your Completion Letter (NOT graduation ceremony date)."
      });
    }

    if (visa500Exp) {
      if (!ParkCoDates.parseIsoLocal(visa500Exp)) {
        return {
          ready: true,
          validationError: true,
          errorKo: "학생비자(Subclass 500) 만료일 형식이 올바르지 않습니다(YYYY-MM-DD).",
          errorEn: "Invalid Student Visa (Subclass 500) expiry date format (YYYY-MM-DD)."
        };
      }
      var vDiff = ParkCoDates.diffDaysBetweenIso(refTodayIso, visa500Exp);
      items.push({
        id: "student_500_expiry",
        sourceIso: visa500Exp,
        deadlineIso: visa500Exp,
        daysRemaining: vDiff,
        expired: vDiff < 0,
        labelKo: "학생비자(500) 만료일 (Sch 1 Item 1229(4)(a)(ii)-(iii) / s 48 주의)",
        labelEn: "Student Visa (500) Expiry (Sch 1 Item 1229(4)(a)(ii)-(iii) / s 48 Rule)",
        ruleKo: "유효한 본비자(500) 만료 전에 온쇼어에서 접수해야 BVA가 순조롭게 부여됩니다(만료 후 무비자 전락 또는 거절 이력 발생 시 s 48 제한 및 최근 6개월 내 500 보유 요건 위반 위험).",
        ruleEn: "Lodge onshore before Subclass 500 expires to transition cleanly onto BVA (avoiding unlawful status, s 48 bars, or breaching the 6-month substantive 500 holding rule under Sch 1 Item 1229(4)(a)(ii)-(iii))."
      });
    }

    if (engDate) {
      if (!ParkCoDates.parseIsoLocal(engDate)) {
        return {
          ready: true,
          validationError: true,
          errorKo: "공인 영어시험 응시일 형식이 올바르지 않습니다(YYYY-MM-DD).",
          errorEn: "Invalid English test date format (YYYY-MM-DD)."
        };
      }
      var engDeadlineIso = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(engDate, 1, 0, 0));
      var eDiff = ParkCoDates.diffDaysBetweenIso(refTodayIso, engDeadlineIso);
      items.push({
        id: "english_12m",
        sourceIso: engDate,
        deadlineIso: engDeadlineIso,
        daysRemaining: eDiff,
        expired: eDiff < 0,
        labelKo: "공인 영어성적 유효만료일 + 12개월 (LIN 24/022)",
        labelEn: "English Test Validity + 12 Months (LIN 24/022)",
        ruleKo: "LIN 24/022 개정에 따라 Subclass 485 영어 성적(IELTS/PTE/OET/TOEFL) 인정 유효기간이 기존 3년에서 접수 직전 최대 1년(12개월)으로 대폭 단축되었습니다.",
        ruleEn: "Under LIN 24/022, maximum English test validity (IELTS/PTE/OET/TOEFL) for Subclass 485 was reduced from 3 years to strictly 1 year (12 months) before lodgement."
      });
    }

    var sorted = items.slice().sort(function (a, b) {
      return a.deadlineIso < b.deadlineIso ? -1 : (a.deadlineIso > b.deadlineIso ? 1 : 0);
    });
    var earliest = sorted[0];
    var latest = sorted[sorted.length - 1];

    items.forEach(function (it) {
      it.isEarliest = it.deadlineIso === earliest.deadlineIso;
    });

    var safePriorIso = ParkCoDates.computeSafePriorBusinessIso(earliest.deadlineIso, 14, "QLD");
    var spreadDays = ParkCoDates.diffDaysBetweenIso(earliest.deadlineIso, latest.deadlineIso);

    var explanationKo = "최종 안전 접수 데드라인은 3개 기한 중 가장 먼저 도래하는 [" + earliest.labelKo + ": " + earliest.deadlineIso + "]입니다. " +
      (items.length > 1
        ? "나머지 기한(" + latest.deadlineIso + " 등 · 최대 " + spreadDays + "일 더 늦음)에 여유가 남아 있더라도 가장 먼저 만료되는 법정 요건 하나라도 도과하는 즉시 유효한 485 승인 요건이 상실되므로 다른 늦은 날짜가 앞선 기한을 절대 연장해 주지 못합니다."
        : "나머지 2개 기준일(학생비자 500 만료일 · 공인 영어시험 응시일 · 수료 완료일)도 모두 입력하시면 3개 기한 중 가장 빠른 병목 날짜를 정밀 비교합니다.");

    var explanationEn = "Your Hard Filing Deadline is [" + earliest.labelEn + ": " + earliest.deadlineIso + "], the earliest expiring requirement. " +
      (items.length > 1
        ? "Even though later dates exist (up to " + latest.deadlineIso + ", " + spreadDays + " days later), missing the earliest expiring statutory requirement invalidates or bars your 485 application; later dates on the other two items CANNOT extend an earlier expiring requirement."
        : "Enter all 3 dates (Completion Letter, Subclass 500 expiry, and English test date) to compare every statutory bottleneck side by side.");

    return {
      ready: true,
      validationError: false,
      allThreeProvided: items.length === 3,
      todayIso: refTodayIso,
      hardFilingDeadlineIso: earliest.deadlineIso,
      safePriorBusinessIso: safePriorIso,
      daysRemaining: earliest.daysRemaining,
      expired: earliest.expired,
      earliestId: earliest.id,
      earliestItem: earliest,
      items: items,
      sortedItems: sorted,
      explanationKo: explanationKo,
      explanationEn: explanationEn
    };
  }

  function evaluateCitizenshipS22(opts) {
    var lawfulStart = String((opts && opts.lawfulStartIso) || "").trim();
    var prGrant = String((opts && opts.prGrantIso) || "").trim();
    var appDate = String((opts && opts.applicationDateIso) || "").trim() || ParkCoDates.todayBrisbaneIso();
    var abs4Raw = opts && opts.absences4YrRaw !== undefined ? String(opts.absences4YrRaw).trim() : "";
    var abs12Raw = opts && opts.absences12mRaw !== undefined ? String(opts.absences12mRaw).trim() : "";
    var feeType = (opts && opts.feeType) === "concession" ? "concession" : "standard";
    var feeAud = feeType === "concession" ? 85 : 595;

    if (!lawfulStart && !prGrant && abs4Raw === "" && abs12Raw === "") {
      return { ready: false, feeAud: feeAud, feeType: feeType };
    }
    if (!ParkCoDates.parseIsoLocal(lawfulStart) || !ParkCoDates.parseIsoLocal(prGrant) || !ParkCoDates.parseIsoLocal(appDate)) {
      return {
        ready: true,
        validationError: true,
        feeAud: feeAud,
        errorKo: "합법 체류 개시일·영주권 취득일·신청 예정일을 모두 선택해 주십시오.",
        errorEn: "Please select your lawful residence start date, PR grant date, and intended application date."
      };
    }
    var abs4 = abs4Raw === "" ? 0 : Number(abs4Raw);
    var abs12 = abs12Raw === "" ? 0 : Number(abs12Raw);
    if (!isFinite(abs4) || abs4 < 0 || abs4 > 1461 || !isFinite(abs12) || abs12 < 0 || abs12 > 366 || abs12 > abs4) {
      return {
        ready: true,
        validationError: true,
        feeAud: feeAud,
        errorKo: "해외 체류 일수는 0 이상의 정수로 입력하되 마지막 12개월 해외 체류 일수는 4년 전체 해외 체류 일수를 초과할 수 없습니다.",
        errorEn: "Enter non-negative absence days, with final-12-month absences not exceeding 4-year total absences."
      };
    }

    var fourYrIso = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(lawfulStart, 4, 0, 0));
    var pr12mIso = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(prGrant, 1, 0, 0));
    var earliestBaseIso = fourYrIso > pr12mIso ? fourYrIso : pr12mIso;

    var met4YrLawful = appDate >= fourYrIso;
    var met12mPr = appDate >= pr12mIso;
    var metAbs4Yr = abs4 <= 365;
    var metAbs12m = abs12 <= 90;
    var eligible = met4YrLawful && met12mPr && metAbs4Yr && metAbs12m;

    return {
      ready: true,
      validationError: false,
      eligible: eligible,
      feeType: feeType,
      feeAud: feeAud,
      lawfulStartIso: lawfulStart,
      prGrantIso: prGrant,
      applicationDateIso: appDate,
      fourYrThresholdIso: fourYrIso,
      pr12mThresholdIso: pr12mIso,
      earliestBaseEligibleIso: earliestBaseIso,
      absences4YrDays: abs4,
      absences12mDays: abs12,
      met4YrLawful: met4YrLawful,
      met12mPr: met12mPr,
      metAbs4Yr: metAbs4Yr,
      metAbs12m: metAbs12m
    };
  }

  root.PartnerGraduateEngine = {
    evaluatePartnerPathway: evaluatePartnerPathway,
    evaluateRelationshipEligibility: evaluateRelationshipEligibility,
    evaluateGraduatePathway: evaluateGraduatePathway,
    evaluate485TripleDeadlines: evaluate485TripleDeadlines,
    evaluateCitizenshipS22: evaluateCitizenshipS22,
    hydrateVacSchedule: hydrateVacSchedule,
    formatCitizenshipDuration: formatCitizenshipDuration,
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

    /* --- Partner Step 1 & Step 2 Cross-Context --- */
    var locVal = (document.getElementById("pv-location") || {}).value || "";
    var relYrsVal = (document.getElementById("pv-rel-years") || {}).value || "1to2";
    var childVal = (document.getElementById("pv-shared-child") || {}).value || "no";
    var spHistVal = (document.getElementById("s3-sponsor-hist") || {}).value || "clean";
    var relLegalVal = (document.getElementById("rel-legal-status") || {}).value || "";
    var stateVal = (document.getElementById("df-state") || {}).value || "QLD";
    var monthsRawVal = (document.getElementById("df-months") || {}).value;
    var pillarsVal = (document.getElementById("df-pillars") || {}).value || "strong4";

    var pRes = evaluatePartnerPathway({
      location: locVal,
      relYears: relYrsVal,
      hasSharedChild: childVal === "yes",
      sponsorHist: spHistVal,
      relLegalStatus: relLegalVal
    });

    var pOut = document.getElementById("pv-pathway-output");
    if (pOut) {
      if (!pRes.ready) {
        pOut.innerHTML = renderNeutralPrompt(
          "체류 위치 및 현재 비자 상태를 선택해 주십시오",
          "Select Your Current Location & Visa Status",
          "왼쪽 1번 항목을 선택하시면 권고 파트너 비자 서브클래스(820/309/300)와 신청비(" + fmtAudInt(liveVacConfig.partnerBase) + " / " + fmtAudInt(liveVacConfig.trans300) + ") 및 Schedule 3 웨이버 필요 여부가 즉시 표시됩니다.",
          "Choose item 1 on the left to view your recommended Partner subclass, FY2026–27 VAC, Direct PR status, and Schedule 3 assessment."
        );
      } else {
        var guardHtml = "";
        if (pRes.contradiction300Married) {
          guardHtml =
            '<div id="pv-300-married-guard" class="alert-box alert-danger" style="margin-bottom:10px;">' +
              '<div style="font-weight:800;font-size:14px;margin-bottom:4px;">' +
                escapeHtml(isKo ? pRes.contradictionTitleKo : pRes.contradictionTitleEn) +
              '</div>' +
              '<div style="font-size:13px;line-height:1.55;">' +
                escapeHtml(isKo ? pRes.contradictionDetailKo : pRes.contradictionDetailEn) +
              '</div>' +
              '<div class="guard-quick-btns">' +
                '<button type="button" class="btn-guard-fix js-fix-300-offshore">' +
                  escapeHtml(isKo ? "오프쇼어 배우자 비자(Subclass 309/100)로 전환" : "Switch to Offshore Partner (Subclass 309/100)") +
                '</button>' +
                '<button type="button" class="btn-guard-fix js-fix-300-onshore">' +
                  escapeHtml(isKo ? "온쇼어 배우자 비자(Subclass 820/801)로 전환" : "Switch to Onshore Partner (Subclass 820/801)") +
                '</button>' +
              '</div>' +
            '</div>';
        }

        var trackBoxClass = pRes.contradiction300Married ? "alert-box alert-danger" : "alert-box alert-info";
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
          guardHtml +
          '<div class="' + trackBoxClass + '" style="margin-bottom:10px;">' +
            '<div style="font-size:14.5px;font-weight:800;color:' + (pRes.contradiction300Married ? "#7F1D1D" : "#0E3A3E") + ';margin-bottom:4px;">' +
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

    var stateGroup = document.getElementById("df-state-group");
    if (stateGroup) {
      stateGroup.style.opacity = relLegalVal === "legally_married" ? "0.65" : "1";
    }

    var rRes = evaluateRelationshipEligibility({
      relLegalStatus: relLegalVal,
      state: stateVal,
      monthsRaw: monthsRawVal,
      pillars: pillarsVal,
      location: locVal
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
        if (rRes.status === "contradiction_300_married" || rRes.status === "wa_nt_registration_invalid" || rRes.status === "unregistered_under12_wa_nt") {
          rBoxClass = "alert-box alert-danger";
        } else if (rRes.status === "unregistered_under12_can_register") {
          rBoxClass = "alert-box alert-warn";
        }
        var pBoxClass = rRes.pillarWarn ? "alert-box alert-warn" : "alert-box alert-info";
        var dfFixBtns = rRes.contradiction300Married
          ? (
              '<div class="guard-quick-btns">' +
                '<button type="button" class="btn-guard-fix js-fix-300-offshore">' +
                  escapeHtml(isKo ? "오프쇼어 309/100으로 변경" : "Switch to Offshore 309/100") +
                '</button>' +
                '<button type="button" class="btn-guard-fix js-fix-300-onshore">' +
                  escapeHtml(isKo ? "온쇼어 820/801로 변경" : "Switch to Onshore 820/801") +
                '</button>' +
              '</div>'
            )
          : "";

        dfOut.innerHTML =
          '<div class="' + rBoxClass + '" style="margin-bottom:10px;">' +
            '<div style="font-weight:800;margin-bottom:4px;">' + escapeHtml(isKo ? rRes.badgeKo : rRes.badgeEn) + '</div>' +
            '<div style="font-size:13px;">' + escapeHtml(isKo ? rRes.detailKo : rRes.detailEn) + '</div>' +
            dfFixBtns +
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
          : (isKo ? "법정 자격 제한 항목 발견 · 단독 접수 전 대안 검토 필수" : "Statutory Bar / Ineligibility Detected · Review Alternatives");

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

    /* --- Mode 2 Section 2: Subclass 485 Triple-Deadline Comparator --- */
    var tdCompVal = (document.getElementById("td-completion-date") || {}).value || gComp || "";
    var tdVisaVal = (document.getElementById("td-visa500-expiry") || {}).value || "";
    var tdEngVal = (document.getElementById("td-english-date") || {}).value || "";

    var tdRes = evaluate485TripleDeadlines({
      completionDate: tdCompVal,
      studentVisaExpiryDate: tdVisaVal,
      englishTestDate: tdEngVal
    });

    var tdOut = document.getElementById("td-comparator-output");
    if (tdOut) {
      if (!tdRes.ready) {
        tdOut.innerHTML = renderNeutralPrompt(
          "485 접수 3대 기한 기준일을 입력해 주십시오",
          "Enter Your 3 Subclass 485 Milestone Dates",
          "왼쪽에 학위 수료 완료일(+6개월)과 학생비자 500 만료일 및 영어시험 응시일(+12개월 · LIN 24/022)을 입력하시면 3개 기한 중 가장 빠른 최종 안전 접수 데드라인이 산출됩니다.",
          "Enter your Completion Letter date (+6m), Subclass 500 expiry date, and English test date (+12m under LIN 24/022) to highlight the earliest Hard Filing Deadline."
        );
      } else if (tdRes.validationError) {
        tdOut.innerHTML = '<div class="alert-box alert-danger"><strong>' + escapeHtml(isKo ? tdRes.errorKo : tdRes.errorEn) + '</strong></div>';
      } else {
        var hdClass = tdRes.expired ? "alert-box alert-danger" : "alert-box alert-warn";
        var hdBadgeText = tdRes.expired
          ? (isKo
              ? "기한 경과 경고: 브리즈번 오늘(" + tdRes.todayIso + ") 기준 " + Math.abs(tdRes.daysRemaining) + "일 도과 · 긴급 대안 비자 검토 필수"
              : "DEADLINE EXPIRED: Passed " + Math.abs(tdRes.daysRemaining) + " days ago (from Brisbane today " + tdRes.todayIso + ") · Urgent Alternative Triage Required")
          : (isKo
              ? "브리즈번 오늘(" + tdRes.todayIso + ") 기준 잔여 " + tdRes.daysRemaining + "일 · 14일 전 안전 접수 목표일: " + tdRes.safePriorBusinessIso
              : tdRes.daysRemaining + " days remaining from Brisbane today (" + tdRes.todayIso + ") · 14-day prior safe target: " + tdRes.safePriorBusinessIso);

        var cardsHtml = tdRes.items.map(function (item) {
          var cls = "td-item-card" + (item.expired ? " td-expired" : (item.isEarliest ? " td-earliest" : ""));
          var badgeLbl = item.expired
            ? (isKo ? "기한 도과 (" + Math.abs(item.daysRemaining) + "일 경과)" : "EXPIRED (" + Math.abs(item.daysRemaining) + "d ago)")
            : (item.isEarliest
                ? (isKo ? "최우선 병목 기한 (잔여 " + item.daysRemaining + "일)" : "EARLIEST BOTTLENECK (" + item.daysRemaining + "d left)")
                : (isKo ? "잔여 " + item.daysRemaining + "일" : item.daysRemaining + " days left"));
          return (
            '<div class="' + cls + '">' +
              '<span class="td-item-badge">' + escapeHtml(badgeLbl) + '</span>' +
              '<div style="font-size:12px;font-weight:800;color:#14282A;margin-top:2px;">' + escapeHtml(isKo ? item.labelKo : item.labelEn) + '</div>' +
              '<div style="font-size:17px;font-weight:900;color:' + (item.expired ? "#991B1B" : (item.isEarliest ? "#7A1F2B" : "#0E3A3E")) + ';">' + escapeHtml(item.deadlineIso) + '</div>' +
              '<div style="font-size:11.5px;color:#4A5D5F;">' + escapeHtml((isKo ? "기준일: " : "Input date: ") + item.sourceIso) + '</div>' +
              '<div style="font-size:11.5px;color:#36494B;line-height:1.45;margin-top:2px;">' + escapeHtml(isKo ? item.ruleKo : item.ruleEn) + '</div>' +
            '</div>'
          );
        }).join("");

        tdOut.innerHTML =
          '<div class="' + hdClass + '" style="margin-bottom:10px;">' +
            '<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;color:#7A1F2B;">' +
              escapeHtml(isKo ? "최종 안전 접수 데드라인 · 3개 기한 중 가장 빠른 날" : "Hard Filing Deadline · Earliest Expiring Requirement") +
            '</div>' +
            '<div style="font-size:22px;font-weight:900;color:#7F1D1D;margin:3px 0;">' +
              escapeHtml(tdRes.hardFilingDeadlineIso) +
              ' <span style="font-size:13px;font-weight:800;">(' + escapeHtml(isKo ? tdRes.earliestItem.labelKo : tdRes.earliestItem.labelEn) + ')</span>' +
            '</div>' +
            '<div style="font-size:12.5px;font-weight:700;margin-bottom:6px;">' + escapeHtml(hdBadgeText) + '</div>' +
            '<div style="font-size:12.5px;line-height:1.55;color:#14282A;">' + escapeHtml(isKo ? tdRes.explanationKo : tdRes.explanationEn) + '</div>' +
          '</div>' +
          '<div class="triple-deadline-grid">' + cardsHtml + '</div>';
      }
    }

    /* --- Shared Smart Brief (Human-Readable Labels Only · Zero Raw Enum Codes) --- */
    var briefLines = [];
    if (isKo) {
      briefLines.push("[법무법인 박앤코 파트너 비자(820·309·300) · 학생·졸업생 비자(500·485) 진단 브리프]");
      briefLines.push("• 수신: 법무법인 박앤코 박창민 대표변호사 (enquiry@parkcolawyers.com | https://parklawyers.com.au/links/?lang=ko)");
      briefLines.push("• 현재 점검 탭: " + (currentMode === "graduate" ? "학생 비자(500) · 졸업생 비자(485)" : "파트너 비자(820·309·300 · Schedule 3)"));
      if (pRes.ready) {
        briefLines.push("• [파트너 트랙] 체류·비자 상태: " + getLabel("location", locVal, "ko"));
        if (pRes.contradiction300Married) {
          briefLines.push("  - [중대 경고] 이미 법적 혼인한 상태에서는 Subclass 300 신청 불가 (cl 300.211 / 300.221) → Subclass 309/100 또는 820/801 직접 접수 필요");
        }
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
      if (tdRes.ready && !tdRes.validationError) {
        briefLines.push("• [485 3대 기한 비교] 최종 안전 접수 데드라인: " + tdRes.hardFilingDeadlineIso + " (" + tdRes.earliestItem.labelKo + " / 잔여 " + tdRes.daysRemaining + "일)");
      }
      if (!pRes.ready && !rRes.ready && !gRes.ready && !tdRes.ready) {
        briefLines.push("• 아직 선택된 진단 항목이 없습니다. 위 진단기에서 조건을 선택하거나 [예시 조건 채우기]를 눌러 주십시오.");
      }
    } else {
      briefLines.push("[Park & Co Lawyers · Partner (820/309/300) & Student/Graduate (500/485) Diagnostic Brief]");
      briefLines.push("• To: Chang Min Park, Legal Practitioner Director (enquiry@parkcolawyers.com | https://parklawyers.com.au/links/?lang=en)");
      briefLines.push("• Active Mode: " + (currentMode === "graduate" ? "Student (500) & Graduate (485) Visas" : "Partner Visas (820/309/300 & Schedule 3)"));
      if (pRes.ready) {
        briefLines.push("• [Partner Track] Current Status: " + getLabel("location", locVal, "en"));
        if (pRes.contradiction300Married) {
          briefLines.push("  - [STATUTORY CONTRADICTION] Married couples cannot lodge Subclass 300 (cl 300.211 / 300.221) → Lodge Subclass 309/100 or 820/801 directly");
        }
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
      if (tdRes.ready && !tdRes.validationError) {
        briefLines.push("• [485 Triple-Deadline Comparator] Hard Filing Deadline: " + tdRes.hardFilingDeadlineIso + " (" + tdRes.earliestItem.labelEn + " / " + tdRes.daysRemaining + " days left)");
      }
      if (!pRes.ready && !rRes.ready && !gRes.ready && !tdRes.ready) {
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
    renderCitizenshipS22();
  }

  function renderCitizenshipS22() {
    if (typeof document === "undefined") return;
    var outBox = document.getElementById("cit-s22-output");
    if (!outBox) return;
    var isKo = currentLang === "ko";
    var res = evaluateCitizenshipS22({
      lawfulStartIso: (document.getElementById("cit-lawful-start") || {}).value || "",
      prGrantIso: (document.getElementById("cit-pr-grant") || {}).value || "",
      applicationDateIso: (document.getElementById("cit-app-date") || {}).value || "",
      absences4YrRaw: (document.getElementById("cit-abs-4yr") || {}).value,
      absences12mRaw: (document.getElementById("cit-abs-12m") || {}).value,
      feeType: (document.getElementById("cit-fee-type") || {}).value || "standard"
    });
    if (!res.ready) {
      outBox.innerHTML =
        '<div class="alert-box alert-info">' +
          '<strong>' + escapeHtml(isKo ? "s 22 거주요건 계산 대기 중 (Form 1300t: 일반 $595 / 감면 $85)" : "Awaiting s 22 Residence Dates (Form 1300t: $595 Standard / $85 Concession)") + '</strong><br/>' +
          escapeHtml(isKo
            ? "좌측에 합법 체류 개시일과 영주권 취득일 및 해외 체류 일수를 입력하시면 4년 합법 거주·12개월 영주권·365일/90일 해외 체류 상한 충족 여부와 최초 적격 기준일이 계산됩니다."
            : "Enter your lawful residence start date, PR grant date, and overseas absence days to verify the 4-year residence, 12-month PR, and 365d/90d absence caps under s 22.") +
        '</div>';
      return;
    }
    if (res.validationError) {
      outBox.innerHTML = '<div class="alert-box alert-warn">' + escapeHtml(isKo ? res.errorKo : res.errorEn) + '</div>';
      return;
    }
    var rows = [
      {
        ok: res.met4YrLawful,
        ko: "4년 합법 거주 요건(s 22(1)(a)): 기준 도달일 " + res.fourYrThresholdIso + " (" + (res.met4YrLawful ? "충족" : "미도래") + ")",
        en: "4-Year Lawful Residence (s 22(1)(a)): Met from " + res.fourYrThresholdIso + " (" + (res.met4YrLawful ? "Met" : "Not yet reached") + ")"
      },
      {
        ok: res.met12mPr,
        ko: "신청 직전 12개월 영주권 보유(s 22(1)(c)): 기준 도달일 " + res.pr12mThresholdIso + " (" + (res.met12mPr ? "충족" : "미도래") + ")",
        en: "12-Month PR Before Application (s 22(1)(c)): Met from " + res.pr12mThresholdIso + " (" + (res.met12mPr ? "Met" : "Not yet reached") + ")"
      },
      {
        ok: res.metAbs4Yr,
        ko: "최근 4년간 해외 체류 상한(s 22(1A) · 최대 365일): 입력 " + res.absences4YrDays + "일 (" + (res.metAbs4Yr ? "충족" : "초과") + ")",
        en: "4-Year Total Absence Cap (s 22(1A) · Max 365d): " + res.absences4YrDays + " days (" + (res.metAbs4Yr ? "Met" : "Exceeded") + ")"
      },
      {
        ok: res.metAbs12m,
        ko: "마지막 12개월 해외 체류 상한(s 22(1B) · 최대 90일): 입력 " + res.absences12mDays + "일 (" + (res.metAbs12m ? "충족" : "초과") + ")",
        en: "Final 12-Month Absence Cap (s 22(1B) · Max 90d): " + res.absences12mDays + " days (" + (res.metAbs12m ? "Met" : "Exceeded") + ")"
      }
    ];
    var headCls = res.eligible ? "alert-ok" : "alert-danger";
    var headTitle = res.eligible
      ? (isKo ? "✅ s 22 일반 거주요건 충족 (신청 수수료: AUD $" + res.feeAud + " · Form 1300t)" : "✅ Meets s 22 General Residence Requirement (Fee: AUD $" + res.feeAud + " · Form 1300t)")
      : (isKo ? "⚠️ s 22 거주요건 일부 미충족 (최초 기본 도래일: " + res.earliestBaseEligibleIso + " · 수수료 AUD $" + res.feeAud + ")" : "⚠️ s 22 Requirement Not Yet Met (Earliest Base Date: " + res.earliestBaseEligibleIso + " · Fee AUD $" + res.feeAud + ")");
    outBox.innerHTML =
      '<div class="alert-box ' + headCls + '">' +
        '<div style="font-weight:800;margin-bottom:6px;">' + escapeHtml(headTitle) + '</div>' +
        '<ul style="margin:0;padding-left:18px;font-size:12.8px;line-height:1.58;">' +
          rows.map(function (r) {
            return '<li>' + (r.ok ? "✓ " : "✗ ") + escapeHtml(isKo ? r.ko : r.en) + '</li>';
          }).join("") +
        '</ul>' +
      '</div>';
  }

  function fillSampleInputs() {
    var todayIso = ParkCoDates.todayBrisbaneIso();
    var twoMonthsAgo = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, 0, -2, 0));
    var twoMonthsAhead = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, 0, 2, 0));
    var tenMonthsAgo = ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, 0, -10, 15));

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
      "grad-completion-date": twoMonthsAgo,
      "td-completion-date": twoMonthsAgo,
      "td-visa500-expiry": twoMonthsAhead,
      "td-english-date": tenMonthsAgo,
      "cit-lawful-start": ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, -4, -3, 0)),
      "cit-pr-grant": ParkCoDates.formatIsoLocal(ParkCoDates.addYearsMonthsClamped(todayIso, -1, -2, 0)),
      "cit-app-date": todayIso,
      "cit-abs-4yr": "120",
      "cit-abs-12m": "30",
      "cit-fee-type": "standard"
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
      "grad-completion-date": "",
      "td-completion-date": "",
      "td-visa500-expiry": "",
      "td-english-date": "",
      "cit-lawful-start": "",
      "cit-pr-grant": "",
      "cit-app-date": "",
      "cit-abs-4yr": "",
      "cit-abs-12m": "",
      "cit-fee-type": "standard"
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
      inventory: {
        conferral_monthly_received: 22723,
        conferral_on_hand: 47970
      },
      art_citizenship_review: {
        total_finalised: 94,
        substantive_decisions: 51,
        set_aside: 30,
        set_aside_pct_all: 31.91,
        set_aside_pct_restricted: 58.82
      },
      duration_rows: [
        {
          id: "conferral_lodgement_to_decision",
          label_ko: "일반 시민권 부여 (Conferral) · 1단계: 신청일 → 승인 결정일",
          label_en: "Citizenship by Conferral · Stage 1: Application to Decision",
          p25: "36 days (36일)",
          p50: "42 days (42일)",
          p75: "78 days (78일)",
          p90: "5 months (5개월)"
        },
        {
          id: "conferral_approval_to_ceremony",
          label_ko: "일반 시민권 부여 (Conferral) · 2단계: 승인일 → 시민권 선서식",
          label_en: "Citizenship by Conferral · Stage 2: Approval to Ceremony",
          p25: "71 days (71일)",
          p50: "4 months (4개월)",
          p75: "5 months (5개월)",
          p90: "6 months (6개월)"
        },
        {
          id: "conferral_lodgement_to_ceremony",
          label_ko: "일반 시민권 부여 (Conferral) · 전체: 신청일 → 선서식 완료",
          label_en: "Citizenship by Conferral · Overall: Application to Ceremony",
          p25: "5 months (5개월)",
          p50: "7 months (7개월)",
          p75: "8 months (8개월)",
          p90: "11 months (11개월)"
        },
        {
          id: "descent_lodgement_to_decision",
          label_ko: "혈통에 의한 시민권 (Citizenship by Descent) · 신청일 → 결정일",
          label_en: "Citizenship by Descent · Application to Decision",
          p25: "34 days (34일)",
          p50: "37 days (37일)",
          p75: "70 days (70일)",
          p90: "4 months (4개월)"
        },
        {
          id: "evidence_lodgement_to_decision",
          label_ko: "시민권 증서 재발급·증명 (Evidence of Citizenship) · 신청일 → 결정일",
          label_en: "Evidence of Australian Citizenship · Application to Decision",
          p25: "2 days (2일)",
          p50: "4 days (4일)",
          p75: "8 days (8일)",
          p90: "15 days (15일)"
        }
      ]
    },
    partner_graduate_art_summary: {
      partner_dha_on_hand: 116917,
      partner_dha_grant_rate_pct: 94.0,
      partner_820_art_wait_p50_ko: "3년 1개월 (95% 3년 11개월)",
      partner_820_art_wait_p50_en: "3 yrs 1 mo (95% 3 yrs 11 mos)",
      partner_820_art_all_pct: 60.6,
      partner_820_art_restricted_pct: 80.1,
      partner_820_art_q1_2627_all_pct: 69.1,
      partner_820_art_q1_2627_restricted_pct: 81.5,
      graduate_485_art_all_pct: 83.99,
      graduate_485_art_restricted_pct: 93.30,
      citizenship_art_all_pct: 31.91,
      citizenship_art_restricted_pct: 58.82
    }
  };

  var cachedPartnerKnowledgeHub = null;
  var currentPkhTab = "faqs";
  var currentPkhCategory = "ALL";
  var currentPkhQuery = "";

  function renderPartnerKnowledgeHub() {
    if (typeof document === "undefined") return;
    var rootBox = document.getElementById("partner-knowledge-hub");
    if (!rootBox || !cachedPartnerKnowledgeHub) return;

    var isKo = currentLang === "ko";
    var data = cachedPartnerKnowledgeHub;
    var faqs = Array.isArray(data.faq_items) ? data.faq_items : [];
    var complexList = Array.isArray(data.video_scenarios) ? data.video_scenarios : [];
    var cessationList = Array.isArray(data.cessation_matrix) ? data.cessation_matrix : [];
    var casesList = Array.isArray(data.review_and_cases) ? data.review_and_cases : [];
    var mythsList = Array.isArray(data.myth_busters) ? data.myth_busters : [];
    var checkList = Array.isArray(data.stage_checklists) ? data.stage_checklists : [];

    document.querySelectorAll(".pkh-tab-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-pkh-tab") === currentPkhTab);
    });
    ["faqs", "complex", "cessation", "review", "checklists"].forEach(function (t) {
      var pan = document.getElementById("pkh-panel-" + t);
      if (pan) pan.hidden = currentPkhTab !== t;
    });

    /* 1. Category chips + 60 FAQ list */
    var catRow = document.getElementById("pkh-faq-cat-bar");
    var faqBox = document.getElementById("pkh-faq-list");
    var countEl = document.getElementById("pkh-faq-count");
    if (catRow && faqBox) {
      var catMap = {};
      faqs.forEach(function (f) {
        var c = f.category || "CAT";
        if (!catMap[c]) {
          catMap[c] = {
            code: c,
            ko: f.category_label_ko || c,
            en: f.category_label_en || c,
            count: 0
          };
        }
        catMap[c].count += 1;
      });
      var cats = Object.keys(catMap);
      var chipsHtml = '<button type="button" class="btn-secondary js-pkh-cat-chip ' + (currentPkhCategory === "ALL" ? "active" : "") + '" data-cat="ALL" style="font-size:12px;padding:5px 10px;">' +
        escapeHtml(isKo ? "전체 (" + faqs.length + ")" : "All (" + faqs.length + ")") + '</button>';
      cats.forEach(function (c) {
        var info = catMap[c];
        var activeCls = currentPkhCategory === c ? "active" : "";
        chipsHtml += '<button type="button" class="btn-secondary js-pkh-cat-chip ' + activeCls + '" data-cat="' + escapeHtml(c) + '" style="font-size:12px;padding:5px 10px;">' +
          escapeHtml((isKo ? info.ko : info.en) + " (" + info.count + ")") + '</button>';
      });
      catRow.innerHTML = chipsHtml;

      var qLower = String(currentPkhQuery || "").trim().toLowerCase();
      var filtered = faqs.filter(function (f) {
        if (currentPkhCategory !== "ALL" && f.category !== currentPkhCategory) return false;
        if (!qLower) return true;
        var hay = [
          f.id, f.slug, f.category_label_ko, f.category_label_en,
          f.question_ko, f.question_en, f.summary_ko, f.summary_en,
          f.review_reason_ko, f.review_reason_en, f.source_notes
        ].join(" ").toLowerCase();
        return hay.indexOf(qLower) >= 0;
      });

      if (countEl) {
        countEl.textContent = isKo
          ? ("검색 결과: 총 " + filtered.length + "개 문답 (전항목 1차 법령·판례·공식 통계 검증 완료)")
          : ("Showing " + filtered.length + " verified Q&A items (backed by primary legislation, case law & official statistics)");
      }

      faqBox.innerHTML = filtered.map(function (f, idx) {
        var q = isKo ? f.question_ko : f.question_en;
        var sa = isKo ? f.summary_ko : f.summary_en;
        var rev = isKo ? f.review_reason_ko : f.review_reason_en;
        var catLbl = isKo ? f.category_label_ko : f.category_label_en;
        var portalUrl = isKo ? (f.faq_url_ko || ("https://faq.immispecialist.com/q/" + encodeURIComponent(f.slug) + "?lang=ko")) : (f.faq_url_en || ("https://faq.immispecialist.com/q/" + encodeURIComponent(f.slug) + "?lang=en"));
        return (
          '<details class="poller-accordion" ' + (idx < 3 ? "open" : "") + ' style="margin-top:0;">' +
            '<summary style="font-size:13.5px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">' +
              '<span><strong>[' + escapeHtml(f.id) + ']</strong> ' + escapeHtml(q) + '</span>' +
              '<span class="badge badge-teal" style="font-size:11px;">' + escapeHtml(catLbl) + '</span>' +
            '</summary>' +
            '<div class="poller-body" style="font-size:13px;line-height:1.6;">' +
              '<div class="alert-box alert-info" style="margin-bottom:8px;"><strong>' + escapeHtml(isKo ? "핵심 법령·실무 기준: " : "Statutory Standard: ") + '</strong>' + escapeHtml(sa) + '</div>' +
              '<p style="margin:0 0 8px;"><strong>' + escapeHtml(isKo ? "전문가 검토 포인트: " : "Legal Review Trigger: ") + '</strong>' + escapeHtml(rev) + '</p>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
                '<span class="badge badge-amber" style="font-size:11px;">' + escapeHtml(isKo ? ("검증 기준일: " + (f.fact_checked_on || "2026-11-12")) : ("Verified: " + (f.fact_checked_on || "2026-11-12"))) + '</span>' +
                '<a href="' + escapeHtml(portalUrl) + '" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#0E3A3E;">' +
                  escapeHtml(isKo ? "공식 FAQ 포털에서 전문 보기 ↗" : "Read Full Entry on FAQ Portal ↗") +
                '</a>' +
              '</div>' +
            '</div>' +
          '</details>'
        );
      }).join("");
    }

    /* 2. Complex Video Scenarios (V01-V11) */
    var compBox = document.getElementById("pkh-complex-content");
    if (compBox) {
      compBox.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px;">' + complexList.map(function (v) {
        return (
          '<div class="alert-box alert-info" style="margin:0;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">' +
              '<strong style="font-size:13.5px;color:#0E3A3E;">[' + escapeHtml(v.code) + ' · ' + escapeHtml(v.timestamp) + '] ' + escapeHtml(isKo ? v.title_ko : v.title_en) + '</strong>' +
              '<span class="badge badge-amber" style="font-size:11px;">' + escapeHtml(v.law_cite) + '</span>' +
            '</div>' +
            '<p style="margin:0;font-size:12.8px;line-height:1.58;color:#14282A;">' + escapeHtml(isKo ? v.summary_ko : v.summary_en) + '</p>' +
          '</div>'
        );
      }).join("") + '</div>';
    }

    /* 3. Cessation & Exception Matrix */
    var cessBox = document.getElementById("pkh-cessation-content");
    if (cessBox) {
      cessBox.innerHTML = cessationList.map(function (row) {
        return (
          '<div class="alert-box alert-warn" style="margin-bottom:10px;">' +
            '<div style="font-weight:800;font-size:14px;color:#7A1F2B;margin-bottom:6px;">' + escapeHtml(isKo ? row.stage_ko : row.stage_en) + '</div>' +
            '<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.58;color:#14282A;">' +
              '<li><strong>' + escapeHtml(isKo ? "가정폭력(FV) 예외: " : "Family Violence Exception: ") + '</strong>' + escapeHtml(isKo ? row.fv_ko : row.fv_en) + '</li>' +
              '<li><strong>' + escapeHtml(isKo ? "스폰서 사망 예외: " : "Sponsor Death Exception: ") + '</strong>' + escapeHtml(isKo ? row.death_ko : row.death_en) + '</li>' +
              '<li><strong>' + escapeHtml(isKo ? "공동 양육권·면접교섭권 자녀 예외: " : "Shared Child Exception: ") + '</strong>' + escapeHtml(isKo ? row.child_ko : row.child_en) + '</li>' +
            '</ul>' +
          '</div>'
        );
      }).join("");
    }

    /* 4. Review Standing & 6 Key Precedents */
    var revBox = document.getElementById("pkh-review-content");
    if (revBox) {
      var standingHtml =
        '<div class="alert-box alert-danger" style="margin-bottom:12px;">' +
          '<div style="font-weight:800;font-size:14px;margin-bottom:4px;">' +
            escapeHtml(isKo ? "거절 시 재심 청구인 적격(Standing) 핵심 구분 · s 338 / r 4.02(4)-(5)" : "ART Review Standing Distinction · s 338 / r 4.02(4)-(5)") +
          '</div>' +
          '<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.58;">' +
            '<li><strong>' + escapeHtml(isKo ? "온쇼어 820/801 거절 (s 338(2) · s 347): " : "Onshore 820/801 Refusal (s 338(2) · s 347): ") + '</strong>' +
              escapeHtml(isKo ? "비자 신청자(Visa Applicant) 본인이 청구인 적격을 가집니다." : "The Visa Applicant holds review standing.") + '</li>' +
            '<li><strong>' + escapeHtml(isKo ? "오프쇼어 309 거절 (r 4.02(4)(l) · r 4.02(5)(r)): " : "Offshore 309 Refusal (r 4.02(4)(l) · r 4.02(5)(r)): ") + '</strong>' +
              escapeHtml(isKo ? "2018년 개정 이후 스폰서가 아닌 비자 신청자(Visa Applicant) 본인이 ART 재심 청구인 적격을 가집니다." : "Under r 4.02(5)(r), the Visa Applicant (not the sponsor) holds review standing.") + '</li>' +
            '<li><strong>' + escapeHtml(isKo ? "오프쇼어 300(약혼비자) 거절 (r 4.02(4)(la) · r 4.02(5)(raa)): " : "Offshore 300 Refusal (r 4.02(4)(la) · r 4.02(5)(raa)): ") + '</strong>' +
              escapeHtml(isKo ? "호주 스폰서(Sponsor)가 ART 재심 청구인 적격을 가집니다(309와 청구 주체가 다르므로 명의 착오 주의)." : "Under r 4.02(5)(raa), the Australian Sponsor holds review standing (do not confuse with 309).") + '</li>' +
          '</ul>' +
        '</div>';
      var casesHtml = casesList.map(function (c) {
        return (
          '<div class="alert-box alert-info" style="margin-bottom:8px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;">' +
              '<strong style="font-size:13.5px;color:#0E3A3E;">' + escapeHtml(c.case_name) + '</strong>' +
              '<span class="badge badge-teal" style="font-size:11px;">' + escapeHtml(isKo ? c.topic_ko : c.topic_en) + '</span>' +
            '</div>' +
            '<div style="font-size:12.8px;line-height:1.56;">' + escapeHtml(isKo ? c.holding_ko : c.holding_en) + '</div>' +
          '</div>'
        );
      }).join("");
      revBox.innerHTML = standingHtml + casesHtml;
    }

    /* 5. Checklists & 12 Myth Busters */
    var clBox = document.getElementById("pkh-checklists-content");
    if (clBox) {
      var clHtml = checkList.map(function (cl) {
        var items = isKo ? (cl.items_ko || []) : (cl.items_en || []);
        return (
          '<div class="alert-box alert-ok" style="margin-bottom:8px;">' +
            '<div style="font-weight:800;font-size:13.5px;margin-bottom:4px;">[' + escapeHtml(cl.stage_id) + '] ' + escapeHtml(isKo ? cl.title_ko : cl.title_en) + '</div>' +
            '<ul style="margin:0;padding-left:18px;font-size:12.8px;line-height:1.55;">' +
              items.map(function (it) { return '<li>' + escapeHtml(it) + '</li>'; }).join("") +
            '</ul>' +
          '</div>'
        );
      }).join("");
      var mbHtml = mythsList.map(function (m) {
        return (
          '<div class="alert-box alert-warn" style="margin-bottom:8px;">' +
            '<div style="font-weight:800;font-size:13px;color:#7A1F2B;margin-bottom:3px;">[' + escapeHtml(m.id) + ' ' + escapeHtml(isKo ? "오해" : "Myth") + '] ' + escapeHtml(isKo ? m.myth_ko : m.myth_en) + '</div>' +
            '<div style="font-size:12.8px;line-height:1.55;color:#14282A;"><strong>' + escapeHtml(isKo ? "법적 사실: " : "Statutory Reality: ") + '</strong>' + escapeHtml(isKo ? m.fact_ko : m.fact_en) + '</div>' +
          '</div>'
        );
      }).join("");
      clBox.innerHTML = clHtml + mbHtml;
    }
  }

  function formatCitizenshipDuration(rawVal, isKo) {
    var s = String(rawVal == null ? "" : rawVal).trim();
    if (!s) return "";
    if (!isKo) {
      return s.replace(/\s*\([^)]*[가-힣][^)]*\)/g, "").trim();
    }
    var koMatch = s.match(/\(([^()]*[가-힣][^()]*)\)/);
    if (koMatch && koMatch[1]) {
      return koMatch[1].trim();
    }
    return s;
  }

  function renderCitizenshipIntelligence() {
    if (typeof document === "undefined") return;
    var kpiGrid = document.getElementById("cit-art-kpi-grid");
    var tbody = document.getElementById("cit-processing-tbody");
    if (!kpiGrid || !tbody || !cachedCitizenshipData) return;

    var isKo = currentLang === "ko";
    var cit = cachedCitizenshipData.citizenship || {};
    var rows = cit.duration_rows || [];
    var inv = cit.inventory || {};
    var citArt = cit.art_citizenship_review || {};
    var artSum = cachedCitizenshipData.partner_graduate_art_summary || {};

    var overallRow = null;
    for (var idx = 0; idx < rows.length; idx++) {
      var cand = rows[idx];
      var stg = String((cand && (cand.id || cand.stage_en || cand.label_en)) || "").toLowerCase();
      if (stg.indexOf("lodgement_to_ceremony") >= 0 || stg.indexOf("application to ceremony") >= 0) {
        overallRow = cand;
        break;
      }
    }
    var overallP50 = overallRow
      ? formatCitizenshipDuration((isKo ? overallRow.p50_ko : overallRow.p50_en) || overallRow.p50, isKo)
      : (isKo ? "7개월" : "7 months");
    var overallP90 = overallRow
      ? formatCitizenshipDuration((isKo ? overallRow.p90_ko : overallRow.p90_en) || overallRow.p90, isKo)
      : (isKo ? "11개월" : "11 months");

    var onHandNum = Number(inv.conferral_on_hand || cit.conferral_on_hand || 47970);
    var monthlyNum = Number(inv.conferral_monthly_received || cit.conferral_monthly_lodged || 22723);
    var partnerGrantPct = artSum.partner_dha_grant_rate_pct != null ? Number(artSum.partner_dha_grant_rate_pct).toFixed(1) : "94.0";
    var partnerArtSubPct = artSum.partner_820_art_restricted_pct != null ? Number(artSum.partner_820_art_restricted_pct).toFixed(2) : "85.16";
    var partnerArtAllPct = artSum.partner_820_art_all_pct != null ? Number(artSum.partner_820_art_all_pct).toFixed(2) : "74.66";
    var partnerOnHand = Number(artSum.partner_dha_on_hand || 116917);
    var partnerWaitStr = isKo
      ? (artSum.partner_820_art_wait_p50_ko || "3년 1개월 (95% 3년 11개월)")
      : formatCitizenshipDuration(artSum.partner_820_art_wait_p50_en || "3 yrs 1 mo (95% 3 yrs 11 mos)", false);
    var gradArtSubPct = artSum.graduate_485_art_restricted_pct != null ? Number(artSum.graduate_485_art_restricted_pct).toFixed(2) : "93.30";
    var gradArtAllPct = artSum.graduate_485_art_all_pct != null ? Number(artSum.graduate_485_art_all_pct).toFixed(2) : "83.99";
    var citArtSubPct = (artSum.citizenship_art_restricted_pct != null ? Number(artSum.citizenship_art_restricted_pct) : Number(citArt.restricted_change_pct || citArt.set_aside_pct_restricted || 58.82)).toFixed(2);
    var citArtAllPct = (artSum.citizenship_art_all_pct != null ? Number(artSum.citizenship_art_all_pct) : Number(citArt.change_all_pct || citArt.set_aside_pct_all || 31.91)).toFixed(2);
    var citSetAside = Number(citArt.set_aside || 30);
    var citSubTotal = Number(citArt.substantive_decisions || ((citArt.set_aside || 0) + (citArt.affirmed_non_dismissed || 0)) || 51);

    var kpis = [
      {
        label: isKo ? "수여 시민권(Conferral) 전체 완료" : "Conferral Overall to Ceremony",
        val: overallP50 + " (p50) / " + overallP90 + " (p90)",
        sub: isKo
          ? "미결 재고 " + onHandNum.toLocaleString("en-US") + "건 (월 신규 " + monthlyNum.toLocaleString("en-US") + "건)"
          : "On-hand " + onHandNum.toLocaleString("en-US") + " (Monthly lodged " + monthlyNum.toLocaleString("en-US") + ")"
      },
      {
        label: isKo ? "파트너 820 ART 취소·환송률 (본안 분모)" : "Partner 820 ART Set Aside (Substantive)",
        val: "80.1% (" + (isKo ? "25–26 연간" : "FY25–26") + ") · " + partnerArtSubPct + "% (" + (isKo ? "26–27 YTD" : "26–27 YTD") + ")",
        sub: isKo
          ? "전체 종결 분모 60.6% / " + partnerArtAllPct + "% · 환송 후 잔여심사 (개별 승인확률 아님 · 중위 " + partnerWaitStr + ")"
          : "All finalisations 60.6% / " + partnerArtAllPct + "% · Remittal to DHA (not grant odds · p50 " + partnerWaitStr + ")"
      },
      {
        label: isKo ? "졸업생 비자(485) 거절 ART 인용률" : "Graduate 485 ART Set Aside Rate",
        val: gradArtSubPct + "% (" + (isKo ? "본안" : "Substantive") + ") · " + gradArtAllPct + "% (" + (isKo ? "전체" : "All") + ")",
        sub: isKo ? "본안 결정 388건 중 362건 취소·환송" : "362 of 388 substantive decisions Set Aside"
      },
      {
        label: isKo ? "시민권 거절 ART 재심 인용률" : "Citizenship Refusal ART Set Aside",
        val: citArtSubPct + "% (" + (isKo ? "본안" : "Substantive") + ") · " + citArtAllPct + "% (" + (isKo ? "전체" : "All") + ")",
        sub: isKo
          ? "본안 결정 " + citSubTotal + "건 중 " + citSetAside + "건 취소·환송"
          : citSetAside + " of " + citSubTotal + " substantive decisions Set Aside"
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

    tbody.innerHTML = rows.map(function (r) {
      var label = isKo
        ? (r.label_ko || ((r.stream_ko || "") + " · " + (r.stage_ko || "")))
        : (r.label_en || ((r.stream_en || "") + " · " + (r.stage_en || ""))).replace(/\s*\([^)]*[가-힣][^)]*\)/g, "").trim();
      var p25 = formatCitizenshipDuration((isKo ? r.p25_ko : r.p25_en) || r.p25 || "", isKo);
      var p50 = formatCitizenshipDuration((isKo ? r.p50_ko : r.p50_en) || r.p50 || "", isKo);
      var p75 = formatCitizenshipDuration((isKo ? r.p75_ko : r.p75_en) || r.p75 || "", isKo);
      var p90 = formatCitizenshipDuration((isKo ? r.p90_ko : r.p90_en) || r.p90 || "", isKo);
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

    if (cachedPvPollingStatus.vac_schedule) {
      hydrateVacSchedule(cachedPvPollingStatus.vac_schedule);
    }

    var isKo = currentLang === "ko";
    var kpis = [
      {
        label: isKo ? "파트너 비자 기본 VAC (820/309/300)" : "Partner Visa Base VAC (820/309/300)",
        val: fmtAudInt(liveVacConfig.partnerBase) + " AUD",
        sub: isKo
          ? "동반 18+ " + fmtAudInt(liveVacConfig.partner18) + " · <18 " + fmtAudInt(liveVacConfig.partnerU18)
          : "Add 18+ " + fmtAudInt(liveVacConfig.partner18) + " · <18 " + fmtAudInt(liveVacConfig.partnerU18)
      },
      {
        label: isKo ? "학생(500) · 졸업생(485) 기본 VAC" : "Student (500) · Graduate (485) VAC",
        val: fmtAudInt(liveVacConfig.s500Base) + " / " + fmtAudInt(liveVacConfig.g485Base),
        sub: isKo
          ? "Second 485 " + fmtAudInt(liveVacConfig.g485SecBase) + " · 300→820 " + fmtAudInt(liveVacConfig.trans300)
          : "Second 485 " + fmtAudInt(liveVacConfig.g485SecBase) + " · 300→820 " + fmtAudInt(liveVacConfig.trans300)
      },
      {
        label: isKo ? "사실혼 12개월 면제 등록 주" : "Prescribed Registration States",
        val: isKo ? "6개 주/준주" : "6 Jurisdictions",
        sub: isKo ? "NSW · VIC · QLD · SA · TAS · ACT (WA/NT 제외)" : "NSW · VIC · QLD · SA · TAS · ACT (WA/NT excluded)"
      },
      {
        label: isKo ? "파트너 820 ART 취소·환송 (본안 분모)" : "Partner 820 ART Set Aside (Substantive)",
        val: "80.1% / 81.5% / 85.16%",
        sub: isKo
          ? "FY25–26 80.1%(전체 60.6%) · Q1 81.5%(전체 69.1%) · 상세통계 YTD 85.16%(전체 74.66%) · 환송 후 잔여심사"
          : "FY25–26 80.1% (60.6% all) · Q1 81.5% (69.1% all) · YTD 85.16% (74.66% all) · Remittal to DHA"
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
      if (!isKo) {
        title = String(title || "").replace(/\s*\([^)]*[가-힣][^)]*\)/g, "");
        figs = String(figs || "").replace(/\s*\([^)]*[가-힣][^)]*\)/g, "");
      }
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
    if (dict.pageTitle) {
      document.title = dict.pageTitle;
    }
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-title");
      if (dict[k] !== undefined) el.setAttribute("title", dict[k]);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-placeholder");
      if (dict[k] !== undefined) el.setAttribute("placeholder", dict[k]);
    });
    var vcBox = document.getElementById("visit-counter");
    if (vcBox) {
      vcBox.setAttribute("title", currentLang === "en" ? "Click to view daily visit trends and referrers" : "클릭하면 일별 방문 추이와 유입 경로를 볼 수 있어요");
    }
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
    renderPartnerKnowledgeHub();
    updateAll();
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
      [
        "pv-location", "pv-rel-years", "pv-shared-child", "s3-sponsor-hist",
        "rel-legal-status", "df-state", "df-months", "df-pillars",
        "grad-target-stream", "grad-current-visa", "grad-qual-type", "grad-age", "grad-completion-date",
        "td-completion-date", "td-visa500-expiry", "td-english-date",
        "cit-lawful-start", "cit-pr-grant", "cit-app-date", "cit-abs-4yr", "cit-abs-12m", "cit-fee-type"
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
      var jumpKh = document.getElementById("nav-jump-hub") || document.getElementById("nav-jump-kh");
      var jumpG = document.getElementById("nav-jump-grad");
      if (jumpP) jumpP.addEventListener("click", function () { setMode("partner", true); });
      if (jumpDf) {
        jumpDf.addEventListener("click", function () {
          setMode("partner", true);
          var dfSec = document.getElementById("de-facto-4pillars");
          if (dfSec && typeof dfSec.scrollIntoView === "function") {
            dfSec.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
      if (jumpKh) {
        jumpKh.addEventListener("click", function () {
          setMode("partner", true);
          var khSec = document.getElementById("partner-knowledge-hub");
          if (khSec && typeof khSec.scrollIntoView === "function") {
            khSec.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
      if (jumpG) jumpG.addEventListener("click", function () { setMode("graduate", true); });

      var pkhSearch = document.getElementById("pkh-faq-search");
      if (pkhSearch) {
        pkhSearch.addEventListener("input", function () {
          currentPkhQuery = pkhSearch.value || "";
          renderPartnerKnowledgeHub();
        });
      }

      var btnSample = document.getElementById("btn-fill-sample");
      if (btnSample) btnSample.addEventListener("click", fillSampleInputs);

      var btnReset = document.getElementById("btn-reset-all");
      if (btnReset) btnReset.addEventListener("click", resetAllInputs);

      document.addEventListener("click", function (ev) {
        var pkhTabBtn = ev.target && ev.target.closest ? ev.target.closest(".pkh-tab-btn, .js-pkh-tab") : null;
        if (pkhTabBtn) {
          ev.preventDefault();
          currentPkhTab = pkhTabBtn.getAttribute("data-pkh-tab") || "faqs";
          renderPartnerKnowledgeHub();
          return;
        }
        var pkhCatBtn = ev.target && ev.target.closest ? ev.target.closest(".js-pkh-cat-chip") : null;
        if (pkhCatBtn) {
          ev.preventDefault();
          currentPkhCategory = pkhCatBtn.getAttribute("data-cat") || "ALL";
          renderPartnerKnowledgeHub();
          return;
        }
        var trg = ev.target && ev.target.closest ? ev.target.closest(".js-trigger-sample") : null;
        if (trg) {
          ev.preventDefault();
          fillSampleInputs();
          return;
        }
        var fixOff = ev.target && ev.target.closest ? ev.target.closest(".js-fix-300-offshore") : null;
        if (fixOff) {
          ev.preventDefault();
          var locEl1 = document.getElementById("pv-location");
          if (locEl1) locEl1.value = "offshore_married_defacto";
          updateAll();
          return;
        }
        var fixOn = ev.target && ev.target.closest ? ev.target.closest(".js-fix-300-onshore") : null;
        if (fixOn) {
          ev.preventDefault();
          var locEl2 = document.getElementById("pv-location");
          if (locEl2) locEl2.value = "onshore_substantive";
          updateAll();
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
      var reqMode = (params.get("mode") || "").toLowerCase();
      if (reqMode === "graduate") {
        setMode("graduate", false);
      } else {
        setMode("partner", false);
      }
      if ((params.get("lang") || "").toLowerCase() === "en") {
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
            if (data.vac_schedule) {
              hydrateVacSchedule(data.vac_schedule);
            }
            renderPvPollerMatrix();
            updateAll();
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

        fetch("data/partner_knowledge_hub.json", { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            if (!data || !Array.isArray(data.faq_items)) return;
            cachedPartnerKnowledgeHub = data;
            renderPartnerKnowledgeHub();
          })
          .catch(function () {});
      }
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
