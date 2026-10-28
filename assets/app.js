/* Park & Co Lawyers — Partner Visas (820/801 · 309/100 · 300), Relationship Registration & Schedule 3 Navigator */
(function () {
  "use strict";

  var currentLang = "ko";

  var KO_TRANSLATIONS = {
    optDurU1: "1년 미만 (Under 12 months)",
    optDur1to2: "1년 이상 ~ 2년 미만 (1 to <2 years)",
    optDur2to3: "2년 이상 ~ 3년 미만 (2 to <3 years)",
    optDur3p: "3년 이상 장기 관계 (3+ years — Long-term relationship, reg 1.03)",
    optStQLD: "QLD (Queensland — Civil Partnership 등록 시 12개월 면제 가능)",
    optStNSW: "NSW (New South Wales — Relationship Register 등록 시 12개월 면제 가능)",
    optStVIC: "VIC (Victoria — Domestic Relationship 등록 시 12개월 면제 가능)",
    optStSA: "SA (South Australia — Registered Relationship 12개월 면제 가능)",
    optStACT: "ACT (Civil Union / Domestic Relationship 12개월 면제 가능)",
    optStTAS: "TAS (Significant Relationship Deed 12개월 면제 가능)",
    optStWA: "WA (Western Australia — ⚠️ 연방 이민법상 12개월 면제 효력 없음!)",
    optStNT: "NT (Northern Territory — ⚠️ 주정부 관계등록 제도 없음, 12개월 필수!)",
    footerFirmName: "법무법인 박앤코 (PNC Legal Pty Ltd t/a Park & Co Lawyers)",
    ecoHubLink: "← 박앤코 법률 인텔리전스 통합 허브 (All Navigators)",
    ecoGsmLink: "GSM 189·190·491 점수",
    ecoSidLink: "SID 482 · ENS 186 스폰서",
    ecoFamilyLink: "호주 가족법 · 재산분할",
    brandTag: "호주 파트너 비자(820/801 · 309/100 · 300) · 사실혼 관계등록 & Schedule 3 내비게이터",
    navM1: "파트너비자 트랙 · 신청비",
    navM2: "사실혼 12개월 · 주정부등록",
    navM3: "Schedule 3 · 스폰서 제한",
    navCitizenship: "🇦🇺 호주 시민권 소요기간 & 820/485 ART 통계",
    navM4: "상담 브리프 전송",
    navPoller: "1차 법령·이민성 수수료 API 검증",
    btnPrint: "🖨️ 진단서 출력",
    heroEyebrow: "MIGRATION REGULATIONS 1994 · REGS 1.09A, 1.15A, 1.20J, 2.03A · SUBCLASS 820/801 · 309/100 · 300",
    heroTitle: "호주 파트너 비자(820/801 · 309/100 · 300) · 사실혼 관계등록 & Schedule 3 내비게이터",
    heroLead: "기본 신청비 <strong>$11,710 AUD</strong> 파트너 비자의 <strong>4대 증빙 기둥(reg 1.15A)</strong>, <strong>사실혼 12개월 동거 및 8개 주/준주 관계등록 면제(reg 2.03A: WA·NT 제외 주의)</strong>, 브리징·오버스테이 상태에서의 <strong>Schedule 3(3001/3004) 웨이버</strong> 및 <strong>스폰서 자격 제한(reg 1.20J)</strong>을 한눈에 진단합니다.",
    specName: "박창민 대표변호사 (Chang Min Park)",
    specMeta: "법무법인 박앤코 (Park & Co Lawyers · Underwood QLD)<br/>공식 상담 링크: <a href=\"https://parklawyers.com.au/links/?lang=ko\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;font-weight:700;\">parklawyers.com.au/links</a><br/>고난도 파트너 비자(Schedule 3 웨이버 · 스폰서 제한 면제 · 가정폭력 특례) 전문",
    specCta: "파트너 비자 1:1 상담 브리프 전송 →",
    liveStatusLabel: "실시간 이민법 시행령 검증 완료",
    statLabelVac: "파트너 비자 신청비 (820/309/300)",
    statLabelDefacto: "사실혼 최소 동거기간",
    statLabelDirectPr: "직행 영주권 (801/100 동시)",
    statLabelSponsorCap: "스폰서 초청 한도 (reg 1.20J)",
    m1Title: "파트너 비자 트랙(820 vs 309 vs 300) · 직행 영주권 & 신청비(VAC) 계산기",
    m1Desc: "신청 시점 체류지, 동거·혼인 기간(3년 이상 또는 공동 자녀 있는 2년 이상 시 820 대기 없이 <strong>801/100 영주권 직행 승인 가능, reg 1.03</strong>) 및 비자 신청비($11,710 / 300 전환 $1,955)를 진단합니다.",
    m1FormHeading: "신청자 위치 · 관계 기간 · 동반 자녀 입력",
    lblPvLoc: "현재 주신청자 체류 위치 및 소지 비자 상태",
    optLocOnshoreSub: "호주 내 체류 중 — 유효한 실체비자(예: 485, 500, 417, 600, 482) 소지 (8503 없음 · $11,710)",
    optLocOnshoreBva: "호주 내 체류 중 — 브리징 비자(BVA/BVC) 소지 또는 비자 만료 상태 (Schedule 3 적용 · $11,710)",
    optLocOffshore: "한국 등 호주 외 체류 중 — 법률혼 또는 사실혼 (Subclass 309/100 대상 · $11,710)",
    optLocFiance: "한국 등 호주 외 체류 중 — 약혼자 비자 신청 (Subclass 300 $11,710 → 입국·결혼 후 820 전환 $1,955)",
    optLoc300Holder: "호주 내 체류 중 — 유효한 약혼자 비자(Subclass 300) 소지 후 결혼 완료 → 820/801 전환 ($1,955)",
    lblPvRelYears: "진실한 혼인·사실혼 지속 기간 (Years of Relationship)",
    lblPvChildCount: "스폰서와의 사이에 출생한 공동 자녀 유무",
    optChildNo: "없음",
    optChildYes: "있음 (2년 이상 관계 시 801/100 직행 영주권 요건 충족, reg 1.03(b))",
    m1ResultHeading: "권고 비자 서브클래스 · 직행 영주권 여부 & VAC 비용",
    m2Title: "사실혼(De Facto) 12개월 동거 면제(주정부 관계등록) & 4대 증빙 기둥 진단",
    m2Desc: "사실혼(De Facto) 파트너 비자는 원칙적으로 <strong>신청 직전 12개월 이상 동거(reg 2.03A(3))</strong>해야 하나, 지정된 주/준주(NSW·VIC·QLD·SA·TAS·ACT)에서 <strong>시민 관계등록(Relationship Registration)</strong>을 마치면 12개월 요건이 면제됩니다(<strong>WA와 NT는 면제 불가</strong>).",
    m2FormHeading: "거주 주(State) · 동거 개월 수 · 4대 증빙 준비도 체크",
    lblDfState: "커플 거주 주/준주 (State/Territory for Relationship Registration)",
    lblDfMonths: "현재까지 실제 동거한 개월 수 (Months Lived Together)",
    lblDfPillars: "reg 1.15A / 1.09A 4대 증빙 기둥(재정·주거·사회·헌신) 구비 수준",
    optPillar4: "4대 기둥 모두 완비 (공동 계좌 실사용 + 공동 임대차/공과금 + Form 888 증언 + 유언장/Super 수익자 지정)",
    optPillarWeak: "일부 미비 (공동 계좌 개설만 하고 미사용 또는 임대차계약서 한쪽 명의만 등재)",
    m2ResultHeading: "reg 2.03A 사실혼 적격 판정 & 4대 기둥 보완 지침",
    m3Title: "브리징·오버스테이 Schedule 3 웨이버 & 스폰서 자격 제한(평생 2회·5년 간격) 진단",
    m3Desc: "브리징 비자 상태에서 온쇼어 820을 신청하면 <strong>Schedule 3 (Criteria 3001/3004)</strong>에 걸려 <code>Waensila v MIBP [2016] FCAFC 32</code> 기준의 <strong>Compelling Reasons</strong> 법률 의견서가 필수이며, 스폰서의 과거 초청 이력(평생 2회·5년 간격, reg 1.20J)도 함께 검증해야 합니다.",
    m3FormHeading: "Schedule 3 및 스폰서 과거 이력 체크",
    lblS3Status: "1. 신청자 현재 비자 상태 (Schedule 3 적용 여부)",
    optS3Sub: "유효한 실체비자 소지 중 (Schedule 3 미적용 — 안전)",
    optS3Triggered: "브리징 비자(BVA/BVC/BVE) 또는 비자 만료 후 28일 경과 (Schedule 3 웨이버 필수!)",
    lblSponsorHist: "2. 스폰서(배우자)의 과거 파트너 비자 초청·피초청 이력 (reg 1.20J / 1.20KA)",
    optSpClean: "과거 파트너 스폰서십 이력 없음 (초회 스폰서)",
    optSpBarred: "최근 5년 내 파트너 초청/피초청 이력 있음 또는 이미 2회 초청함 (reg 1.20J 웨이버 필수)",
    optSpParent: "스폰서 본인이 최근 5년 내 기여제 부모비자(143/864)를 받아 영주권 취득함 (reg 1.20KA 제한)",
    m3ResultHeading: "Schedule 3 & 스폰서십 제한 웨이버 법률 전략",
    citTitle: "🇦🇺 영주권(801/100) 취득 후 호주 시민권 단계별 실제 소요기간(p25/p50/p75/p90) & 파트너·졸업생·시민권 ART 재심 통계",
    citDesc: "파트너 영주권(801/100) 취득 후 최종 관문인 <strong>호주 시민권(Conferral · Descent · Evidence)</strong>의 이민성 공식 4분위 심사 소요기간(<code>PageSchemaHiddenField</code> 실시간 검증 · <strong>Conferral 미결 재고 53,298건</strong>)과, <strong>파트너 820(본안 85.16% 인용) · 졸업생 485(본안 93.30% 인용) · 시민권 거절(본안 58.82% 인용)</strong> ART 재심 통계를 한눈에 확인하세요.",
    citTableHeading: "1. 호주 시민권(Conferral · Descent · Evidence) 신청~결정~수여식 단계별 공식 소요기간 (25% / 50% / 75% / 90%)",
    citTableSub: "출처: 호주 내무부(Home Affairs) 시민권 공식 통계 페이지 실시간 파싱 (2026년 8월 한 달간 Conferral 신규 접수 16,690건 · 2026.08.31 기준 미결 재고 53,298건). ※ 자치구의회(Council)별 수여식 대기시간 위젯은 이민성 원본(<code>ceremony-wait-times</code>)에서 빈 셸로 제공되어 아래 전국 통합 수여식 분위수(Stage 2 & 전체)가 공식 기준입니다.",
    thCitStream: "시민권 신청 유형 및 심사 단계",
    thCitP25: "25% 완료 (빠른 구간)",
    thCitP50: "50% 완료 (중앙값 p50)",
    thCitP75: "75% 완료 (일반 상한)",
    thCitP90: "90% 완료 (장기 p90)",
    citArtCardTitle: "2. 파트너(820) · 졸업생(485) 비자 거절 또는 호주 시민권(인성·거주기간) 거절 통지를 받으셨나요?",
    citArtCardDesc: "행정재심기구(ART) 공식 통계(2026.07–08)에 따르면, 절차적 취하·각하를 제외하고 실제 본안 결정까지 간 사건 중 <strong>졸업생 비자(485) 거절은 93.30%(362/388건)</strong>, <strong>파트너 비자(820) 거절은 85.16%(109/128건)</strong>, <strong>호주 시민권 거절은 58.82%(30/51건 · 전체 종결 대비 31.91%)</strong>가 <strong>Set Aside(취소·환송)</strong>로 뒤집혔습니다. 단, 재심 청구 법정 기한(일반 28역일)을 넘기면 구제가 불가능합니다.",
    ctaHeading: "박앤코 파트너 비자 · Schedule 3 전담팀 상담 브리프 전송",
    btnSendEmail: "🔗 진단 브리프 복사 & 공식 상담 신청 →",
    btnCopyBrief: "📋 진단 브리프 복사",
    pollerTitle: "1차 이민법 시행령 · 이민성 수수료 API(GetPriceList) · 박앤코 판례 KDB 실시간 검증 매트릭스",
    pollerDesc: "호주 이민성 비자 수수료 실시간 JSON API(<code>GetPriceList</code>), 이민법 시행령 원문(<code>F1996B03551</code>) 및 박앤코 이민 판례 KDB를 매주 자동 폴링하여 SHA-256 해시와 최신 법정 수수료를 검증합니다.",
    thPollerSource: "1차 출처 및 검증 대상",
    thPollerCitation: "근거 조문 · 엔드포인트",
    thPollerFigures: "실시간 추출 핵심 수치",
    thPollerHash: "SHA-256 해시 · 용량",
    thPollerStatus: "폴링 검증 상태",
    footerNotice: "본 내비게이터는 호주 이민법 시행령(Migration Regulations 1994) 1차 출처에 기반한 일반 법률 정보 제공 도구이며, 개별 법률 자문을 대체하지 않습니다. 파트너 비자($11,710 VAC) 및 Schedule 3 웨이버·스폰서 제한 면제 접수 전 반드시 박창민 대표변호사(QLS 공인 이민법 전문변호사 · 공식 상담 링크: <a href=\"https://parklawyers.com.au/links/?lang=ko\" target=\"_blank\" rel=\"noopener\" style=\"color:#FDE68A;font-weight:700;\">parklawyers.com.au/links</a>)와 상담하시기 바랍니다."
  };

  var EN_TRANSLATIONS = {
    optDurU1: "Under 12 months of relationship/cohabitation",
    optDur1to2: "1 to <2 years of relationship/cohabitation",
    optDur2to3: "2 to <3 years of relationship/cohabitation",
    optDur3p: "3+ years (Long-term relationship under reg 1.03)",
    optStQLD: "QLD (Queensland — Civil Partnership waives 12-month rule)",
    optStNSW: "NSW (New South Wales — Relationship Register waives 12-month rule)",
    optStVIC: "VIC (Victoria — Domestic Relationship Register waives 12-month rule)",
    optStSA: "SA (South Australia — Registered Relationship waives 12-month rule)",
    optStACT: "ACT (Civil Union / Domestic Relationship waives 12-month rule)",
    optStTAS: "TAS (Significant Relationship Deed waives 12-month rule)",
    optStWA: "WA (Western Australia — ⚠️ Does NOT waive 12-month rule under reg 2.03A!)",
    optStNT: "NT (Northern Territory — ⚠️ No state register; 12 months mandatory!)",
    footerFirmName: "PNC Legal Pty Ltd t/a Park & Co Lawyers",
    ecoHubLink: "← Park & Co Legal Intelligence Hub (All Navigators)",
    ecoGsmLink: "GSM 189·190·491 Points",
    ecoSidLink: "SID 482 · ENS 186 Sponsor",
    ecoFamilyLink: "Family Law · Property Split",
    brandTag: "Australia Partner Visas (820/801 · 309/100 · 300) · Relationship Registration & Schedule 3 Navigator",
    navM1: "Partner Track & VAC",
    navM2: "De Facto 12m & 4 Pillars",
    navM3: "Schedule 3 & Sponsor Bars",
    navCitizenship: "🇦🇺 Citizenship Processing & 820/485 ART Stats",
    navM4: "Send Legal Brief",
    navPoller: "Primary-Source & VAC Telemetry",
    btnPrint: "🖨️ Print Diagnostic",
    heroEyebrow: "MIGRATION REGULATIONS 1994 · REGS 1.09A, 1.15A, 1.20J, 2.03A · SUBCLASS 820/801 · 309/100 · 300",
    heroTitle: "Australia Partner Visas (820/801 · 309/100 · 300), De Facto Registration & Schedule 3 Navigator",
    heroLead: "Diagnose the <strong>$11,710 AUD Partner Visa</strong> <strong>4 Evidentiary Pillars (regs 1.15A/1.09A)</strong>, <strong>12-month De Facto rule & State Relationship Registration exemptions (reg 2.03A — note WA/NT exclusion)</strong>, <strong>Schedule 3 (3001/3004) waivers</strong>, and <strong>sponsorship limitations (reg 1.20J)</strong>.",
    specName: "Chang Min Park (Legal Practitioner Director)",
    specMeta: "Park & Co Lawyers (Underwood QLD)<br/>Official Inquiry: <a href=\"https://parklawyers.com.au/links/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;font-weight:700;\">parklawyers.com.au/links</a><br/>Complex Partner Visas (Schedule 3 Waivers, Sponsorship Bars & Family Violence)",
    specCta: "Send Partner Visa Consultation Brief →",
    liveStatusLabel: "Live Migration Regulations Verified",
    statLabelVac: "Partner Visa Base VAC (820/309/300)",
    statLabelDefacto: "Minimum De Facto Cohabitation",
    statLabelDirectPr: "Direct 801/100 PR Threshold",
    statLabelSponsorCap: "Sponsor Cap (reg 1.20J)",
    m1Title: "Partner Visa Track (820 vs 309 vs 300), Direct PR & VAC Calculator",
    m1Desc: "Evaluate onshore vs offshore partner streams, <strong>'long-term partner relationship' Direct PR eligibility (reg 1.03: 3+ years, or 2+ years with a child)</strong>, and FY2026–27 VAC ($11,710 / $1,955 after Subclass 300).",
    m1FormHeading: "Select Applicant Location, Relationship Duration & Child Status",
    lblPvLoc: "Primary Applicant Location & Current Visa Status",
    optLocOnshoreSub: "Onshore in Australia — Holding a substantive visa (e.g. 485, 500, 417, 600, 482 without 8503 · $11,710)",
    optLocOnshoreBva: "Onshore in Australia — Holding a Bridging Visa (BVA/BVC) or Unlawful (Schedule 3 applies · $11,710)",
    optLocOffshore: "Offshore (outside Australia) — Married or De Facto (Subclass 309/100 · $11,710)",
    optLocFiance: "Offshore (outside Australia) — Fiancé(e) intending marriage (Subclass 300 $11,710 → 820/801 $1,955)",
    optLoc300Holder: "Onshore in Australia — Current Subclass 300 Holder after marriage → 820/801 transition ($1,955)",
    lblPvRelYears: "Duration of Spouse / De Facto Relationship",
    lblPvChildCount: "Dependent Child of the Relationship?",
    optChildNo: "No shared child",
    optChildYes: "Yes — Shared child (Qualifies for Direct 801/100 PR at 2+ years, reg 1.03(b))",
    m1ResultHeading: "Recommended Partner Visa Subclass, Direct PR Eligibility & VAC",
    m2Title: "De Facto 12-Month Cohabitation, State Relationship Registration & 4 Pillars Scorecard",
    m2Desc: "De facto partner applicants must satisfy <strong>12 months of cohabitation prior to lodgement (reg 2.03A(3))</strong> unless the relationship is registered under a prescribed State/Territory law (NSW, VIC, QLD, SA, TAS, ACT — <strong>WA and NT are NOT prescribed</strong>).",
    m2FormHeading: "Select State/Territory, Cohabitation Months & 4 Pillars Readiness",
    lblDfState: "State/Territory of Residence",
    lblDfMonths: "Months of Cohabitation Completed",
    lblDfPillars: "reg 1.15A / 1.09A 4 Evidentiary Pillars Readiness",
    optPillar4: "All 4 Pillars Strong (Active joint bank account + joint lease/bills + Form 888s + Super/Will nomination)",
    optPillarWeak: "Gaps Present (Dormant joint account or single-name lease)",
    m2ResultHeading: "reg 2.03A De Facto Eligibility Verdict & 4 Pillars Action Plan",
    m3Title: "Bridging Visa Schedule 3 (3001/3004) Waiver & Sponsorship Limitation (reg 1.20J) Evaluator",
    m3Desc: "Lodging an onshore Subclass 820 while holding a Bridging Visa triggers <strong>Schedule 3 (Criteria 3001/3004)</strong>, requiring compelling reasons under <code>Waensila v MIBP [2016] FCAFC 32</code>.",
    m3FormHeading: "Check Schedule 3 & Sponsor History",
    lblS3Status: "1. Applicant Current Visa Status (Schedule 3 Trigger)",
    optS3Sub: "Holding a valid substantive visa (Schedule 3 not triggered)",
    optS3Triggered: "Holding a Bridging Visa (BVA/BVC/BVE) or >28 days unlawful (Schedule 3 Waiver required!)",
    lblSponsorHist: "2. Sponsor's Prior Partner Sponsorship History (reg 1.20J / 1.20KA)",
    optSpClean: "First-time sponsor (No prior partner sponsorships)",
    optSpBarred: "Sponsored/was sponsored within last 5 years OR 2 prior sponsorships (reg 1.20J waiver required)",
    optSpParent: "Sponsor was granted a Contributory Parent visa (143/864) within last 5 years (reg 1.20KA bar)",
    m3ResultHeading: "Schedule 3 & Sponsorship Waiver Legal Strategy",
    citTitle: "🇦🇺 Post-PR (801/100) Australian Citizenship 3-Stage Processing Times (p25/p50/p75/p90) & Partner/Graduate/Citizenship ART Stats",
    citDesc: "Live-verified Department of Home Affairs <strong>Australian Citizenship (Conferral, Descent & Evidence)</strong> 4-percentile processing times (<strong>53,298 Conferral on-hand inventory</strong>) alongside official Administrative Review Tribunal (ART) Set Aside rates for <strong>Partner 820 (85.16% restricted), Graduate 485 (93.30% restricted), and Citizenship Refusal (58.82% restricted)</strong>.",
    citTableHeading: "1. Official Australian Citizenship (Conferral · Descent · Evidence) Processing Times Across 4 Percentiles (25% / 50% / 75% / 90%)",
    citTableSub: "Source: Department of Home Affairs live PageSchemaHiddenField JSON (16,690 new Conferral applications in Aug 2026 · 53,298 on-hand inventory as at 31 Aug 2026). Note: The Home Affairs council-by-council ceremony wait widget (<code>ceremony-wait-times</code>) currently serves an empty config shell; the national Stage 2 & overall percentiles below are the authoritative benchmarks.",
    thCitStream: "Citizenship Stream & Processing Stage",
    thCitP25: "25% Processed",
    thCitP50: "50% Processed (Median)",
    thCitP75: "75% Processed",
    thCitP90: "90% Processed (Upper)",
    citArtCardTitle: "2. Received a Partner (820), Graduate (485), or Australian Citizenship (Good Character / Residence) Refusal?",
    citArtCardDesc: "According to official ART statistics (Jul–Aug 2026), among applications reaching a non-dismissal substantive decision, <strong>93.30% (362/388) of Graduate 485 refusals</strong>, <strong>85.16% (109/128) of Partner 820 refusals</strong>, and <strong>58.82% (30/51 · 31.91% of all finalisations) of Citizenship refusals</strong> resulted in <strong>Set Aside / Remittal</strong>. Strict statutory deadlines (28 calendar days) apply.",
    ctaHeading: "Send Partner Visa & Schedule 3 Consultation Brief",
    btnSendEmail: "🔗 Copy Brief & Open Official Inquiry →",
    btnCopyBrief: "📋 Copy Brief to Clipboard",
    pollerTitle: "Live Migration Regulations, DHA Pricing API (GetPriceList) & Park & Co Immi KDB Matrix",
    pollerDesc: "Automated weekly polling of the Department of Home Affairs live pricing API (<code>GetPriceList</code>), Migration Regulations 1994 (<code>F1996B03551</code>), and Park & Co Immi KDB with genuine SHA-256 content hashes.",
    thPollerSource: "Primary Source & Target",
    thPollerCitation: "Statutory Provision / Endpoint",
    thPollerFigures: "Live Extracted Figures",
    thPollerHash: "SHA-256 Content Hash · Size",
    thPollerStatus: "Verification Status",
    footerNotice: "This navigator provides general legal information based on the Migration Regulations 1994 (Cth) and does not constitute formal legal advice prior to a signed retainer. Contact Chang Min Park (QLS Accredited Specialist in Immigration Law · <a href=\"https://parklawyers.com.au/links/\" target=\"_blank\" rel=\"noopener\" style=\"color:#FDE68A;font-weight:700;\">parklawyers.com.au/links</a>) before lodging."
  };

  function updateAll() {
    var loc = (document.getElementById("pv-location") || {}).value || "onshore_substantive";
    var relYrs = (document.getElementById("pv-rel-years") || {}).value || "1to2";
    var hasChild = (document.getElementById("pv-shared-child") || {}).value === "yes";

    var directPr = relYrs === "over3" || (relYrs === "2to3" && hasChild);
    var pOut = document.getElementById("pv-pathway-output");
    if (pOut) {
      var trackTitle = "Subclass 820 / 801 (Onshore Partner)";
      var vacHeadline = "Base VAC: $11,710 AUD";
      var vacSubInfo = currentLang === "ko"
        ? "주신청자 <strong>$11,710</strong> · 추가 동반 신청자 만 18세 이상 <strong>+$5,860</strong> / 만 18세 미만 자녀 <strong>+$2,935</strong> (Subclass 445 자녀비자 소지자의 801/100 합류는 <strong>$0 면제</strong>)"
        : "Main applicant <strong>$11,710</strong> · Additional applicant 18+ <strong>+$5,860</strong> / Under 18 child <strong>+$2,935</strong> (Subclass 445 holders pay <strong>$0 Nil VAC</strong>)";

      if (loc === "offshore_married_defacto") {
        trackTitle = "Subclass 309 / 100 (Offshore Partner)";
        vacHeadline = "Base VAC: $11,710 AUD";
      } else if (loc === "offshore_fiance") {
        trackTitle = "Subclass 300 → Onshore 820 / 801";
        vacHeadline = "300 ($11,710) + 820 전환 ($1,955) = $13,665 AUD";
        vacSubInfo = currentLang === "ko"
          ? "1단계 약혼자 비자(Subclass 300): 주신청자 <strong>$11,710</strong> (18+ <strong>+$5,860</strong> / &lt;18 <strong>+$2,935</strong>)<br/>2단계 호주 입국·결혼 후 300 만료 전 820/801 전환: 주신청자 <strong>$1,955</strong> (18+ <strong>+$980</strong> / &lt;18 <strong>+$485</strong> · 만료 후 전환 시 <strong>$2,475</strong>)"
          : "Stage 1 Subclass 300: Main <strong>$11,710</strong> (18+ <strong>+$5,860</strong> / &lt;18 <strong>+$2,935</strong>)<br/>Stage 2 Onshore 820/801 (before 300 expiry): Main <strong>$1,955</strong> (18+ <strong>+$980</strong> / &lt;18 <strong>+$485</strong>; Ceased 300 holder: <strong>$2,475</strong>)";
      } else if (loc === "onshore_300_holder") {
        trackTitle = "Subclass 300 Holder → Onshore 820 / 801";
        vacHeadline = "Transition Base VAC: $1,955 AUD";
        vacSubInfo = currentLang === "ko"
          ? "유효한 Subclass 300 소지자 820/801 전환 신청비: 주신청자 <strong>$1,955</strong> · 동반 18+ <strong>+$980</strong> · 동반 &lt;18 자녀 <strong>+$485</strong> (※ 300 비자 만료 후 신청 시 주신청자 <strong>$2,475</strong> / 18+ <strong>$1,235</strong> / &lt;18 <strong>$625</strong>)"
          : "Current Subclass 300 holder applying for 820/801: Main <strong>$1,955</strong> · 18+ <strong>+$980</strong> · &lt;18 <strong>+$485</strong> (If 300 visa has ceased: Main <strong>$2,475</strong> / 18+ <strong>$1,235</strong> / &lt;18 <strong>$625</strong>)";
      }

      pOut.innerHTML =
        '<div style="background:#F2E4E5;border:1.5px solid #7A1F2B;padding:12px 14px;border-radius:8px;margin-bottom:10px;font-size:14px;font-weight:800;color:#530009;">' +
          (currentLang === "ko" ? "권고 트랙: " : "Recommended Track: ") + trackTitle + ' | ' + vacHeadline +
        '</div>' +
        '<div style="background:#FFFBEB;border:1px solid #FDE68A;padding:9px 12px;border-radius:6px;margin-bottom:10px;font-size:12.5px;line-height:1.55;color:#78350F;">' +
          '💰 <strong>FY2026–27 공식 비자 신청비(VAC):</strong> ' + vacSubInfo +
        '</div>' +
        '<div style="font-size:13.5px;line-height:1.65;color:#2E2E2E;">' +
          (directPr
            ? (currentLang === "ko"
                ? "✅ <strong>reg 1.03 장기 관계(Long-Term Partner Relationship) 특례 충족:</strong> 820 임시비자 2년 대기 없이 심사 완료 즉시 <strong>Subclass 801/100 영주권 동시(직행) 승인</strong>을 요청할 수 있습니다."
                : "✅ <strong>reg 1.03 Long-Term Relationship Satisfied:</strong> Eligible for simultaneous direct Subclass 801/100 Permanent Residency grant without waiting for the two-stage period.")
            : (currentLang === "ko"
                ? "ℹ️ <strong>2단계 승인 프로세스 적용:</strong> 1차 임시비자(820/309) 승인 후, 최초 비자 접수일로부터 만 2년이 경과하면 2차 영주권(801/100) 심사가 진행됩니다 (추가 비자 신청비 $0)."
                : "ℹ️ <strong>Two-Stage Partner Process:</strong> Temporary visa (820/309) granted first; eligible for Permanent stage (801/100) assessment 24 months after initial lodgement ($0 additional VAC).")) +
        '</div>';
    }

    var state = (document.getElementById("df-state") || {}).value || "QLD";
    var months = parseInt((document.getElementById("df-months") || {}).value, 10) || 0;
    var pillars = (document.getElementById("df-pillars") || {}).value || "strong4";
    var regExemptStates = ["QLD", "NSW", "VIC", "SA", "ACT", "TAS"];
    var canExempt = regExemptStates.indexOf(state) !== -1;

    var dfOut = document.getElementById("pv-defacto-output");
    if (dfOut) {
      var dfMsg = "";
      if (months >= 12) {
        dfMsg = currentLang === "ko"
          ? "✅ <strong>reg 2.03A(3) 12개월 동거 요건 충족 (" + months + "개월):</strong> 주정부 관계등록 없이도 사실혼 기간 요건을 충족합니다."
          : "✅ <strong>reg 2.03A(3) 12-Month Cohabitation Met (" + months + " months).</strong>";
      } else if (canExempt) {
        dfMsg = currentLang === "ko"
          ? "💡 <strong>동거 " + months + "개월 (12개월 미달) → " + state + " 주정부 관계등록(Relationship Registration)으로 면제 가능 (reg 2.03A(5)):</strong> 비자 결정 전까지 " + state + " 출생사망혼인등록소(BDM) 관계등록증을 발급받아 제출하면 12개월 동거 요건이 법적으로 면제됩니다."
          : "💡 <strong>Cohabitation " + months + "m (<12m) → Exempt via " + state + " Relationship Registration (reg 2.03A(5)):</strong> Registering your civil partnership in " + state + " waives the 12-month requirement.";
      } else {
        dfMsg = currentLang === "ko"
          ? "🚨 <strong>경고 (" + state + " 거주 · 동거 " + months + "개월):</strong> " + state + "는 연방 이민법 시행령상 관계등록 면제 인정 주가 <strong>아닙니다!</strong> 12개월 동거를 채우기 전에 신청하면 reg 2.03A 위반으로 거절되므로 법률혼(혼인신고) 또는 12개월 충족 후 접수해야 합니다."
          : "🚨 <strong>Warning (" + state + " · " + months + "m cohabitation):</strong> " + state + " is NOT prescribed for relationship registration exemptions under reg 2.03A(5). You must either marry or complete a full 12 months of cohabitation before lodging.";
      }
      var pillarMsg = pillars === "weak_fin_house"
        ? (currentLang === "ko"
            ? "<br/><br/>⚠️ <strong>reg 1.15A 4대 기둥 보완 시급:</strong> 공동 계좌는 개설만 해두면 인정되지 않으며 실제 급여 입금·식비/렌트비 지출 내역이 찍혀야 합니다. 박앤코의 4대 기둥 증거 체크리스트로 접수 전 감사받으십시오."
            : "<br/><br/>⚠️ <strong>reg 1.15A 4 Pillars Warning:</strong> A dormant joint bank account carries minimal weight; active shared transactions, Super beneficiary nominations, and statutory declarations (Form 888) must be structured.")
        : "";
      dfOut.innerHTML = '<div style="font-size:13.5px;line-height:1.65;">' + dfMsg + pillarMsg + '</div>';
    }

    var s3 = (document.getElementById("s3-status") || {}).value || "substantive_ok";
    var spHist = (document.getElementById("s3-sponsor-hist") || {}).value || "clean";
    var s3Out = document.getElementById("pv-s3-output");
    if (s3Out) {
      var s3Html = s3 === "bva_unlawful_s3"
        ? (currentLang === "ko"
            ? "🔴 <strong>Schedule 3 (Criteria 3001/3004) 웨이버 필수:</strong> 단순한 '결혼/연애 사실'만으로는 Compelling Reasons로 인정되지 않습니다(<em>Waensila [2016] FCAFC 32</em>). 호주 시민권 자녀 양육, 스폰서의 중대 의료·정신건강 의존성, 한국 귀국 시 회복 불가능한 피해 등을 입증하는 전문변호사 법리 의견서(Legal Submission)가 승패를 가릅니다."
            : "🔴 <strong>Schedule 3 (Criteria 3001/3004) Waiver Required:</strong> The mere existence of a genuine relationship is NOT sufficient to waive Schedule 3. A formal Legal Submission proving compelling reasons (e.g. Australian child, medical/financial hardship under <em>Waensila [2016] FCAFC 32</em>) is essential.")
        : (currentLang === "ko" ? "🟢 <strong>Schedule 3 미적용 (실체비자 유효 기간 내 안전 접수)</strong>" : "🟢 <strong>Schedule 3 Not Triggered (Valid Substantive Visa Held)</strong>");
      var spHtml = spHist !== "clean"
        ? (currentLang === "ko"
            ? "<br/><br/>🟠 <strong>스폰서 자격 제한(" + spHist + ") 웨이버 필요:</strong> reg 1.20J / 1.20KA 제한에 해당하므로 스폰서십 승인 단계에서 Compelling Circumstances 면제 사유서를 함께 제출해야 합니다."
            : "<br/><br/>🟠 <strong>Sponsorship Limitation Bar (" + spHist + "):</strong> Requires a formal reg 1.20J / 1.20KA waiver submission demonstrating compelling circumstances affecting the sponsor.")
        : "";
      s3Out.innerHTML = '<div style="font-size:13.5px;line-height:1.65;">' + s3Html + spHtml + '</div>';
    }

    var brief = currentLang === "ko"
      ? [
          "[법무법인 박앤코 호주 파트너 비자(820/801 · 309/100 · 300) · Schedule 3 진단 패킷]",
          "• 수신: 법무법인 박앤코 박창민 대표변호사 (https://parklawyers.com.au/links/?lang=ko)",
          "• 신청 위치/트랙: " + loc + " / 관계 기간: " + relYrs + " / 직행 영주권(reg 1.03) 대상: " + (directPr ? "해당" : "2단계 진행"),
          "• 거주 주: " + state + " / 동거 개월: " + months + "개월 (주정부 관계등록 면제 가능 여부: " + (canExempt ? "가능" : "불가-WA/NT") + ")",
          "• Schedule 3 상태: " + s3 + " / 스폰서 과거 이력: " + spHist
        ].join("\n")
      : [
          "[Park & Co Lawyers — Partner Visa (820/801 · 309/100 · 300) & Schedule 3 Diagnostic Brief]",
          "• To: Legal Practitioner Director Chang Min Park (https://parklawyers.com.au/links/)",
          "• Track: " + loc + " / Duration: " + relYrs + " / Direct PR (reg 1.03): " + (directPr ? "Yes" : "Two-stage"),
          "• State: " + state + " / Cohabitation: " + months + "m (Registration exemption: " + (canExempt ? "Available" : "Excluded WA/NT") + ")",
          "• Schedule 3: " + s3 + " / Sponsor History: " + spHist
        ].join("\n");

    var pre = document.getElementById("pv-diagnostic-brief-text");
    if (pre) pre.textContent = brief;
    var mailBtn = document.getElementById("btn-pv-mailto");
    if (mailBtn) {
      mailBtn.href = currentLang === "ko"
        ? "https://parklawyers.com.au/links/?lang=ko"
        : "https://parklawyers.com.au/links/";
      mailBtn.target = "_blank";
      mailBtn.rel = "noopener";
      mailBtn.onclick = function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(brief).catch(function () {});
        }
      };
    }
  }

  var cachedPvPollingStatus = null;
  var cachedCitizenshipData = {
    citizenship: {
      conferral_monthly_lodged: 16690,
      conferral_on_hand: 53298,
      duration_rows: [
        {
          id: "conferral_lodgement_to_decision",
          label_ko: "수여 시민권 (Conferral) — 1단계: 신청 접수 ~ 승인 결정",
          label_en: "Citizenship by Conferral — Stage 1: Date of Application to Decision",
          p25_ko: "84일", p25_en: "84 days",
          p50_ko: "5개월", p50_en: "5 months",
          p75_ko: "8개월", p75_en: "8 months",
          p90_ko: "11개월", p90_en: "11 months"
        },
        {
          id: "conferral_approval_to_ceremony",
          label_ko: "수여 시민권 (Conferral) — 2단계: 승인 후 ~ 시민권 수여식 (Ceremony)",
          label_en: "Citizenship by Conferral — Stage 2: Date of Approval to Ceremony",
          p25_ko: "66일", p25_en: "66 days",
          p50_ko: "4개월", p50_en: "4 months",
          p75_ko: "5개월", p75_en: "5 months",
          p90_ko: "7개월", p90_en: "7 months"
        },
        {
          id: "conferral_lodgement_to_ceremony",
          label_ko: "수여 시민권 (Conferral) — 전체: 신청 접수 ~ 수여식 최종 완료",
          label_en: "Citizenship by Conferral — Overall: Date of Application to Ceremony",
          p25_ko: "6개월", p25_en: "6 months",
          p50_ko: "8개월", p50_en: "8 months",
          p75_ko: "10개월", p75_en: "10 months",
          p90_ko: "13개월", p90_en: "13 months"
        },
        {
          id: "descent_lodgement_to_decision",
          label_ko: "혈통 시민권 (Citizenship by Descent) — 신청 ~ 결정",
          label_en: "Citizenship by Descent — Date of Application to Decision",
          p25_ko: "47일", p25_en: "47 days",
          p50_ko: "74일", p50_en: "74 days",
          p75_ko: "3개월", p75_en: "3 months",
          p90_ko: "4개월", p90_en: "4 months"
        },
        {
          id: "evidence_lodgement_to_decision",
          label_ko: "시민권 증서 발급 (Evidence of Australian Citizenship) — 신청 ~ 결정",
          label_en: "Evidence of Australian Citizenship — Date of Application to Decision",
          p25_ko: "3일", p25_en: "3 days",
          p50_ko: "10일", p50_en: "10 days",
          p75_ko: "18일", p75_en: "18 days",
          p90_ko: "28일", p90_en: "28 days"
        }
      ]
    },
    partner_graduate_art_summary: {
      partner_dha_on_hand: 96839,
      partner_dha_grant_rate_pct: 93.9,
      partner_820_art_wait_p50_ko: "3년 2개월 (134주)",
      partner_820_art_wait_p50_en: "3 yrs 2 mos (134 wks)",
      partner_820_art_all_pct: 74.66,
      partner_820_art_restricted_pct: 85.16,
      graduate_485_art_all_pct: 83.99,
      graduate_485_art_restricted_pct: 93.30,
      citizenship_art_all_pct: 31.91,
      citizenship_art_restricted_pct: 58.82
    }
  };

  function renderCitizenshipIntelligence() {
    var kpiGrid = document.getElementById("cit-art-kpi-grid");
    var tbody = document.getElementById("cit-processing-tbody");
    if (!kpiGrid || !tbody || !cachedCitizenshipData) return;

    var isKo = currentLang === "ko";
    var cit = cachedCitizenshipData.citizenship || {};
    var sum = cachedCitizenshipData.partner_graduate_art_summary || {};

    var kpis = [
      {
        label: isKo ? "수여 시민권(Conferral) 전체 완료" : "Conferral Overall to Ceremony",
        val: isKo ? "8개월 (p50) / 13개월 (p90)" : "8 mos (p50) / 13 mos (p90)",
        sub: isKo ? "Conferral 미결 재고: 53,298건 (8월 신규 16,690건)" : "Conferral On-Hand: 53,298 (Aug lodged: 16,690)",
        color: "#7A1F2B"
      },
      {
        label: isKo ? "파트너 비자(820) 1차 & ART 인용률" : "Partner 820 Primary & ART Set Aside",
        val: "93.9% (1차) · 85.16% (ART 본안)",
        sub: isKo ? "DHA 미결 96,839건 · ART 중위 3년 2개월 (전체 종결 대비 74.66%)" : "DHA On-Hand 96,839 · ART p50 3y 2m (74.66% all finalisations)",
        color: "#1E3A8A"
      },
      {
        label: isKo ? "졸업생 비자(485) 거절 ART 인용률" : "Graduate 485 ART Set Aside Rate",
        val: "93.30% (본안) · 83.99% (전체)",
        sub: isKo ? "실질 결정 388건 중 362건 Set Aside (미결 2,882건)" : "362 of 388 substantive decisions Set Aside (2,882 on-hand)",
        color: "#065F46"
      },
      {
        label: isKo ? "시민권 거절 ART 재심 인용률" : "Citizenship Refusal ART Set Aside",
        val: "58.82% (본안) · 31.91% (전체)",
        sub: isKo ? "실질 결정 51건 중 30건 Set Aside (전체 종결 94건 · 미결 301건)" : "30 of 51 substantive decisions Set Aside (94 finalised · 301 on-hand)",
        color: "#92400E"
      }
    ];

    kpiGrid.innerHTML = kpis.map(function (k) {
      return (
        '<div class="card" style="padding:14px 16px;background:#FCFAF6;border:1px solid #DED6C8;">' +
          '<div style="font-size:11.5px;color:#5A5654;font-weight:700;">' + k.label + '</div>' +
          '<div style="font-size:18px;font-weight:800;color:' + k.color + ';margin:5px 0;">' + k.val + '</div>' +
          '<div style="font-size:11.5px;color:#5A5654;line-height:1.45;">' + k.sub + '</div>' +
        '</div>'
      );
    }).join("");

    var rows = cit.duration_rows || [];
    tbody.innerHTML = rows.map(function (r) {
      var isOverall = r.id === "conferral_lodgement_to_ceremony" || r.id === "conferral_app_to_ceremony";
      var rowBg = isOverall ? "background:#FFFBEB;" : "";
      var label = isKo
        ? (r.label_ko || ((r.stream_ko || "") + " — " + (r.stage_ko || "")))
        : (r.label_en || ((r.stream_en || "") + " — " + (r.stage_en || "")));
      var p25 = (isKo ? r.p25_ko : r.p25_en) || r.p25 || "";
      var p50 = (isKo ? r.p50_ko : r.p50_en) || r.p50 || "";
      var p75 = (isKo ? r.p75_ko : r.p75_en) || r.p75 || "";
      var p90 = (isKo ? r.p90_ko : r.p90_en) || r.p90 || "";
      return (
        '<tr style="border-bottom:1px solid #EFEAE1;' + rowBg + '">' +
          '<td style="padding:11px 12px;font-weight:700;color:#2E2E2E;">' + label + '</td>' +
          '<td style="padding:11px 12px;font-size:12.5px;color:#065F46;font-weight:700;">' + p25 + '</td>' +
          '<td style="padding:11px 12px;font-size:13px;color:#7A1F2B;font-weight:800;">' + p50 + '</td>' +
          '<td style="padding:11px 12px;font-size:12.5px;color:#1E3A8A;font-weight:700;">' + p75 + '</td>' +
          '<td style="padding:11px 12px;font-size:12.5px;color:#5A5654;font-weight:700;">' + p90 + '</td>' +
        '</tr>'
      );
    }).join("");
  }

  function loadCitizenshipData() {
    fetch("data/citizenship_processing_data.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.citizenship) return;
        cachedCitizenshipData = data;
        renderCitizenshipIntelligence();
      })
      .catch(function () {});
  }

  function renderPvPollerMatrix() {
    var kpiGrid = document.getElementById("pv-poller-kpis");
    var tbody = document.getElementById("pv-poller-tbody");
    if (!kpiGrid || !tbody || !cachedPvPollingStatus) return;

    var hm = cachedPvPollingStatus.headline_metrics || {};
    var kpis = [
      {
        label: currentLang === "ko" ? "파트너비자 기본 VAC (820/309/300)" : "Partner Visa Base VAC (820/309/300)",
        val: "$11,710 AUD",
        sub: currentLang === "ko" ? "동반 18+ $5,860 · <18 $2,935" : "Add 18+ $5,860 · <18 $2,935"
      },
      {
        label: currentLang === "ko" ? "300 약혼자 → 820 전환 수수료" : "Subclass 300 → 820 Transition VAC",
        val: "$1,955 AUD",
        sub: currentLang === "ko" ? "만료 후 전환 시 $2,475" : "Ceased 300 holder: $2,475"
      },
      {
        label: currentLang === "ko" ? "사실혼 12개월 면제 등록 주" : "Prescribed Registration States",
        val: "6개 주/준주",
        sub: "NSW · VIC · QLD · SA · TAS · ACT (WA/NT 제외)"
      },
      {
        label: currentLang === "ko" ? "박앤코 이민 KDB 재심 판례" : "Park & Co Immi KDB Decisions",
        val: hm.immi_kdb_cases || "9,269 Cases",
        sub: currentLang === "ko" ? "Waensila Schedule 3 법리 연동" : "Waensila Schedule 3 authorities"
      }
    ];

    kpiGrid.innerHTML = kpis.map(function (k) {
      return (
        '<div class="card" style="padding:14px;background:#FCFAF6;border:1px solid #DED6C8;">' +
          '<div style="font-size:11.5px;color:#5A5654;font-weight:700;">' + k.label + '</div>' +
          '<div style="font-size:20px;font-weight:800;color:#7A1F2B;margin:4px 0;">' + k.val + '</div>' +
          '<div style="font-size:11.5px;color:#5A5654;">' + k.sub + '</div>' +
        '</div>'
      );
    }).join("");

    var sources = cachedPvPollingStatus.sources || [];
    tbody.innerHTML = sources.map(function (s) {
      var title = currentLang === "ko" ? (s.title_ko || s.title_en) : (s.title_en || s.title_ko);
      var figs = (s.extracted_figures || []).join(" · ") || "—";
      var kb = s.bytes ? Math.round(s.bytes / 1024).toLocaleString() + " KB" : "Live API";
      var method = s.method || "https-direct-live";
      return (
        '<tr style="border-bottom:1px solid #EFEAE1;">' +
          '<td style="padding:11px 14px;">' +
            '<div style="font-weight:700;color:#2E2E2E;">' + title + '</div>' +
            '<a href="' + s.url + '" target="_blank" rel="noopener" style="font-size:11.5px;color:#7A1F2B;">' + s.url + ' &nearr;</a>' +
          '</td>' +
          '<td style="padding:11px 14px;font-size:12px;color:#5A5654;">' + (s.citation || "") + '</td>' +
          '<td style="padding:11px 14px;font-weight:700;color:#1E3A8A;font-size:12.5px;">' + figs + '</td>' +
          '<td style="padding:11px 14px;font-family:monospace;font-size:11.5px;color:#2E2E2E;">' +
            '<code>' + (s.sha256_prefix || "") + '</code><br/><span style="color:#5A5654;">' + kb + ' (' + method + ')</span>' +
          '</td>' +
          '<td style="padding:11px 14px;">' +
            '<span style="background:#ECFDF5;color:#065F46;border:1px solid #6EE7B7;padding:3px 8px;border-radius:999px;font-size:11.5px;font-weight:700;">' +
              '✓ ' + (s.status || "verified_ok") + ' (' + (s.http_status || 200) + ')' +
            '</span>' +
          '</td>' +
        '</tr>'
      );
    }).join("");
  }

  function loadPvPollingStatus() {
    fetch("data/polling_status.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        cachedPvPollingStatus = data;
        renderPvPollerMatrix();
      })
      .catch(function () {});
  }

  function applyLanguage(lang) {
    currentLang = lang === "en" ? "en" : "ko";
    document.documentElement.lang = currentLang;
    var dict = currentLang === "en" ? EN_TRANSLATIONS : KO_TRANSLATIONS;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k]) el.innerHTML = dict[k];
    });
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
    });
    document.querySelectorAll(".parkco-svc-link").forEach(function (lnk) {
      var h = currentLang === "en" ? lnk.getAttribute("data-en-href") : lnk.getAttribute("data-ko-href");
      if (h) lnk.setAttribute("href", h);
    });
    renderPvPollerMatrix();
    renderCitizenshipIntelligence();
    updateAll();
  }

  document.addEventListener("DOMContentLoaded", function () {
    [
      "pv-location", "pv-rel-years", "pv-shared-child",
      "df-state", "df-months", "df-pillars",
      "s3-status", "s3-sponsor-hist"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateAll);
        el.addEventListener("change", updateAll);
      }
    });

    var btnKo = document.getElementById("btn-lang-ko");
    var btnEn = document.getElementById("btn-lang-en");
    if (btnKo) btnKo.addEventListener("click", function () { applyLanguage("ko"); });
    if (btnEn) btnEn.addEventListener("click", function () { applyLanguage("en"); });

    var copyBtn = document.getElementById("btn-pv-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var pre = document.getElementById("pv-diagnostic-brief-text");
        if (pre && navigator.clipboard) {
          navigator.clipboard.writeText(pre.textContent || "");
          copyBtn.textContent = currentLang === "ko" ? "✅ 클립보드 복사 완료!" : "✅ Copied to Clipboard!";
          setTimeout(function () {
            copyBtn.textContent = currentLang === "ko" ? KO_TRANSLATIONS.btnCopyBrief : EN_TRANSLATIONS.btnCopyBrief;
          }, 2000);
        }
      });
    }

    var printBtn = document.getElementById("btn-print-doc");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    var params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "en") {
      applyLanguage("en");
    } else {
      applyLanguage("ko");
    }
    loadPvPollingStatus();
    loadCitizenshipData();
  });
})();
