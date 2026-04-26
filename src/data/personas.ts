// ============================================================
// 나의 AI 페르소나 — 퀴즈 데이터
// Axis 1 (Q1–Q5): 지시 방식 — 명령형(A) vs 대화형(B)
// Axis 2 (Q6–Q10): 반응 방식 — 검증형(A) vs 신뢰형(B)
// Axis 3 (Q11–Q15): 활용 지향 — 창의형(A) vs 효율형(B)
// Easter Egg: 분노점수 ≥ 3 → 🔴 앵그리 욕쟁이 뱃지
// ============================================================

export const PERSONA_TYPES = [
  'trainer',
  'boss',
  'lightning',
  'copypaste',
  'debater',
  'negotiator',
  'bestfriend',
  'lazy-genius',
] as const;

export type PersonaType = (typeof PERSONA_TYPES)[number];

export interface QuizQuestion {
  id: string;
  axis: 1 | 2 | 3;
  angerTrigger?: { score: number };
  text: string;
  optionA: string;
  optionB: string;
}

export interface PersonaData {
  type: PersonaType;
  name: string;
  color: string;
  typeBadge: string;
  tagline: string;
  description: string;
  hashtags: string[];
  image: string;
}

export interface QuizResult {
  type: PersonaType;
  angerScore: number;
  showAngryBadge: boolean;
}

// ─── 15문항 퀴즈 ─────────────────────────────────────────

export const QUESTIONS: QuizQuestion[] = [
  // ── Axis 1: 지시 방식 (Q1–Q5) | A=명령형, B=대화형 ──
  {
    id: 'Q1',
    axis: 1,
    text: 'AI 프롬프트를 작성할 때 나의 기본 스타일은?',
    optionA: '원하는 결과물의 형식, 조건, 제약까지 구체적으로 다 써준다.',
    optionB: '핵심만 던지고 AI의 반응을 보면서 방향을 잡는다.',
  },
  {
    id: 'Q2',
    axis: 1,
    text: 'AI가 내가 원하는 답을 못 줬을 때 나는?',
    optionA: '프롬프트를 처음부터 다시 작성해서 정확한 지시로 재시도한다.',
    optionB: '"아, 그게 아니고"로 시작해서 대화를 이어나간다.',
  },
  {
    id: 'Q3',
    axis: 1,
    text: 'AI에게 부탁할 때 나의 스타일은?',
    optionA: '최대한 상세하게 배경, 목적, 원하는 결과물 형식까지 전부 적어준다.',
    optionB: '일단 간단하게 던져본다. 결과 보고 마음에 안 들면 수정 요청하면 된다.',
  },
  {
    id: 'Q4',
    axis: 1,
    angerTrigger: { score: 1 }, // POLITENESS trigger
    text: 'AI한테 어떤 식으로 말하나요?',
    optionA: '"해줘", "만들어", "고쳐" — 바로 본론으로 들어간다. AI한테 예의 차릴 필요 없잖아.',
    optionB: '"~해줄 수 있어?", "~부탁해" — 사람한테 하듯이 부드럽게 이야기한다.',
  },
  {
    id: 'Q5',
    axis: 1,
    text: '좋은 AI 결과물을 얻는 핵심은 뭐라고 생각해?',
    optionA: '좋은 프롬프트. 처음부터 정확하게 지시하면 대화 없이도 원하는 결과가 나온다.',
    optionB: '대화의 흐름. 처음엔 러프해도 주고받다 보면 점점 원하는 방향으로 간다.',
  },

  // ── Axis 2: 반응 방식 (Q6–Q10) | A=검증형, B=신뢰형 ──
  {
    id: 'Q6',
    axis: 2,
    text: 'AI가 뭔가를 알려줬을 때 나의 반응은?',
    optionA: '일단 의심한다. 틀렸을 가능성을 열어두고 확인해본다.',
    optionB: '일단 믿는다. 사실 확인은 중요한 것들만 따로 챙긴다.',
  },
  {
    id: 'Q7',
    axis: 2,
    angerTrigger: { score: 3 }, // ANGER_BEHAVIOR 핵심 트리거
    text: 'AI가 계속 틀린 답을 줄 때 솔직히 어떤 반응이 나왔어?',
    optionA: '솔직히 욕이 나왔다. 또는 반말이나 짜증을 실제로 표현한 적 있다.',
    optionB: '답답하긴 해도 말투는 유지했다. 짜증을 드러내진 않는다.',
  },
  {
    id: 'Q8',
    axis: 2,
    text: 'AI가 만들어준 결과물, 어디까지 수정해?',
    optionA: '사실 여부, 논리 오류, 형식까지 직접 검토하고 손댄다. AI는 초안 제공자다.',
    optionB: '전체 방향이 맞으면 세부는 그냥 쓴다. 퇴고는 최소화한다.',
  },
  {
    id: 'Q9',
    axis: 2,
    angerTrigger: { score: 1 }, // PERSISTENCE trigger
    text: 'AI가 틀린 정보를 줬을 때 어떻게 하나요?',
    optionA: '맞을 때까지 다시 시킨다. 틀린 채로 넘어가는 건 못 참는다.',
    optionB: '틀린 부분만 내가 수정하거나 다른 방법으로 확인한다.',
  },
  {
    id: 'Q10',
    axis: 2,
    text: 'AI 결과물에 대한 내 신뢰도는?',
    optionA: '반반. 잘 알려진 사실도 AI가 틀릴 수 있다는 걸 경험으로 안다.',
    optionB: '높은 편. 중요한 것만 검증하고 나머지는 믿고 쓴다.',
  },

  // ── Axis 3: 활용 지향 (Q11–Q15) | A=창의형, B=효율형 ──
  {
    id: 'Q11',
    axis: 3,
    text: 'AI를 주로 어떤 용도로 써?',
    optionA: '아이디어 발산, 글쓰기, 새로운 관점 — 창작·탐색 위주.',
    optionB: '문서 작성, 요약, 반복 작업 자동화 — 업무 효율화 위주.',
  },
  {
    id: 'Q12',
    axis: 3,
    text: 'AI와 대화할 때 즐거움을 느끼는 순간은?',
    optionA: 'AI가 예상 밖의 흥미로운 답을 줄 때. 새로운 발상이 생기는 느낌.',
    optionB: 'AI가 30분 걸릴 일을 3분에 끝내줄 때. 시간 절약이 최고.',
  },
  {
    id: 'Q13',
    axis: 3,
    text: 'AI 덕분에 뭐가 달라졌어?',
    optionA: '더 많은 걸 시도하게 됐다. AI가 창작의 벽을 낮춰줬다.',
    optionB: '일을 더 빨리 하게 됐다. AI가 내 업무 속도를 2-3배 올려줬다.',
  },
  {
    id: 'Q14',
    axis: 3,
    text: 'AI한테 어떤 질문을 주로 하나요?',
    optionA: '"이걸 다른 시각으로 바라보면?", "아이디어 10개 내줘", "이 글 재밌게 바꿔줘"',
    optionB: '"이거 요약해줘", "표로 정리해줘", "코드 짜줘", "이 형식으로 변환해줘"',
  },
  {
    id: 'Q15',
    axis: 3,
    text: 'AI 없이 살 수 있을 것 같아?',
    optionA: '살 순 있는데 재미가 없을 것 같다. AI가 삶에 자극과 탐구를 더해준다.',
    optionB: '살 순 있는데 너무 불편할 것 같다. AI가 효율의 인프라가 됐다.',
  },
];

// ─── 8개 페르소나 ─────────────────────────────────────────
// 이미지: /AI_analysis_char/char_image/{01..08}.png, EXT.png

export const PERSONAS: Record<PersonaType, PersonaData> = {
  trainer: {
    type: 'trainer',
    name: 'AI 조련사형',
    color: '#002FA7',
    typeBadge: 'TRAINER',
    tagline: 'AI를 부리는 자.\n명령 한 줄에 로봇이 움직인다.',
    description:
      '당신은 AI를 도구로 철저히 활용하는 유형입니다. 프롬프트 한 줄을 작성하는 데도 신중하고, 원하는 결과가 나올 때까지 명령을 다듬는 집요함이 있습니다. AI한테 대충 시키면 대충 나온다는 걸 경험으로 압니다.',
    hashtags: ['#프롬프트장인', '#AI조련사', '#명령최적화', '#결과물집착'],
    image: '/chars/01.png',
  },
  boss: {
    type: 'boss',
    name: 'AI 직장상사형',
    color: '#4B5563',
    typeBadge: 'BOSS',
    tagline: 'AI 결과물에도\n결재 도장 찍는 꼼꼼한 사수.',
    description:
      'AI가 뭔가를 내놔도 그냥 넘어가는 법이 없습니다. 사실 확인, 논리 검토, 형식 수정 — 전부 직접 확인합니다. "일단 쓰고 보자"는 절대 없고, AI가 초안을 주면 당신이 퇴고를 합니다. 주변에서 "그냥 써도 되는데"라고 해도 찝찝해서 못 씁니다.',
    hashtags: ['#결재도장', '#꼼꼼검수', '#AI감리', '#마감품질'],
    image: '/chars/02.png',
  },
  lightning: {
    type: 'lightning',
    name: 'AI 번개형',
    color: '#FF6B00',
    typeBadge: 'FLASH',
    tagline: '번쩍 아이디어, 즉시 실행.\n생각보다 손이 먼저.',
    description:
      '아이디어가 떠오르면 생각보다 손이 먼저 움직입니다. AI 탭을 열고 일단 던지는 거죠. 결과가 기대 이하여도 거기서 다시 시작합니다. 완벽한 프롬프트보다 빠른 시도가 더 중요하다는 걸 몸으로 압니다.',
    hashtags: ['#즉흥실행', '#번개손', '#일단던져봐', '#속도우선'],
    image: '/chars/03.png',
  },
  copypaste: {
    type: 'copypaste',
    name: 'AI 복붙러형',
    color: '#16A34A',
    typeBadge: 'CTRL+V',
    tagline: 'Ctrl+C, Ctrl+V로\n세상을 지배하는 효율의 신.',
    description:
      'AI가 뭘 만들어주면 복붙합니다. 깊게 수정하는 시간에 다른 일을 하나 더 끝냅니다. 이게 게으름이 아니라 최적화라는 걸 당신은 알고 있습니다. 같은 시간에 남들보다 3배 많은 일을 처리하는 비결이 바로 여기 있습니다.',
    hashtags: ['#복붙달인', '#효율왕', '#Ctrl+V', '#시간절약'],
    image: '/chars/04.png',
  },
  debater: {
    type: 'debater',
    name: 'AI 토론러형',
    color: '#DC2626',
    typeBadge: 'DEBATER',
    tagline: 'AI랑 한 시간 싸워서\n결론 낸 집요한 토론꾼.',
    description:
      'AI가 틀렸다 싶으면 그냥 못 넘어갑니다. "아니, 그게 아니고"로 시작해서 납득이 될 때까지 논쟁합니다. 주변 사람들은 AI랑 왜 싸우냐고 하지만, 당신한테는 그게 대화이자 검증입니다. 한 시간 대화 끝에 얻은 결론은 확실히 믿을 수 있습니다.',
    hashtags: ['#집요한반박', '#AI논쟁', '#납득할때까지', '#토론이곧성장'],
    image: '/chars/05.png',
  },
  negotiator: {
    type: 'negotiator',
    name: 'AI 협상가형',
    color: '#0D9488',
    typeBadge: 'NEGOTiATOR',
    tagline: '원하는 답 나올 때까지\n대화로 유도하는 전략가.',
    description:
      '원하는 답을 바로 요구하지 않습니다. 대화를 쌓으면서 AI를 원하는 방향으로 유도합니다. 포커페이스로 조용히 원하는 결과를 가져오는 타입입니다. 주변에서 "AI를 어떻게 그렇게 잘 써?"라는 말을 듣지만 딱히 비결을 알려주진 않습니다.',
    hashtags: ['#포커페이스', '#전략대화', '#대화유도', '#조용한지배자'],
    image: '/chars/06.png',
  },
  bestfriend: {
    type: 'bestfriend',
    name: 'AI 단짝형',
    color: '#EC4899',
    typeBadge: 'BFF',
    tagline: 'AI가 진짜 친구인 사람.\n새벽 3시에도 대화중.',
    description:
      'AI랑 대화하는 게 그냥 편합니다. 업무만이 아니라 고민도, 아이디어도, 가끔은 그냥 이야기도 나눕니다. 새벽에도 탭을 켭니다. 판단 없이 들어주는 상대가 있다는 게 생각보다 큰 힘이 된다는 걸, 당신은 알고 있습니다.',
    hashtags: ['#AI친구', '#새벽3시', '#판단없는대화', '#AI단짝'],
    image: '/chars/07.png',
  },
  'lazy-genius': {
    type: 'lazy-genius',
    name: 'AI 게으름 천재형',
    color: '#D97706',
    typeBadge: 'GENIUS',
    tagline: '최소 노력 최대 결과.\n게으름은 천재의 다른 이름.',
    description:
      '움직이기 귀찮으면 AI한테 시킵니다. 이게 게으름인지 천재인지는 결과로 말합니다. 남들이 3시간 걸려 하는 걸 AI 프롬프트 몇 줄로 끝내는 사람입니다. "열심히"보다 "효율적으로"가 당신의 기본값입니다.',
    hashtags: ['#게으름천재', '#최소노력', '#AI자동화', '#인생최적화'],
    image: '/chars/08.png',
  },
};

// ─── 이스터 에그 배지 ───────────────────────────────────────
export const ANGRY_BADGE_IMAGE = '/chars/EXT.png';
export const ANGER_THRESHOLD = 3;

// ─── 페르소나 매핑 ─────────────────────────────────────────
// 키: `${axis1}${axis2}${axis3}` | 0=A다수(명령/검증/창의), 1=B다수(대화/신뢰/효율)
export const PERSONA_MAP: Record<string, PersonaType> = {
  '000': 'trainer',      // 명령형 + 검증형 + 창의형
  '001': 'boss',         // 명령형 + 검증형 + 효율형
  '010': 'lightning',    // 명령형 + 신뢰형 + 창의형
  '011': 'copypaste',    // 명령형 + 신뢰형 + 효율형
  '100': 'debater',      // 대화형 + 검증형 + 창의형
  '101': 'negotiator',   // 대화형 + 검증형 + 효율형
  '110': 'bestfriend',   // 대화형 + 신뢰형 + 창의형
  '111': 'lazy-genius',  // 대화형 + 신뢰형 + 효율형
};
