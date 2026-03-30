import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: '클럽 추천 | 전국 35곳 완전 가이드', description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: { title: '클럽 추천 | 전국 35곳 완전 가이드', description: cat.description, url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/clubs.png', width: 1200, height: 1200 }] },
};

export default function ClubsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="클럽은 DJ의 선곡과 사운드 시스템이 만들어내는 공간 자체가 콘텐츠다. 같은 장르라도 스피커 배치와 음향 튜닝에 따라 체감이 완전히 달라진다. 강남권은 대형 플로어와 VIP 부스가 밀집해 있고, EDM·하우스 중심의 메인스트림 라인업이 주를 이룬다. 압구정·청담은 소규모 부티크 클럽이 많아 트렌디한 분위기에서 테크노·딥하우스를 즐길 수 있다. 홍대는 언더그라운드 씬의 본거지로 힙합·인디일렉트로닉 라이브가 강하고, 이태원은 해외 DJ 게스트 셋이 가장 활발한 지역이다. 드레스코드는 대부분 적용되며 슬리퍼·트레이닝복은 입장이 거절된다. 셔츠에 깔끔한 신발이면 거의 모든 곳에서 통과된다. 금·토요일 자정 전후가 피크타임이고, 23시 이전에 도착하면 대기 없이 바로 입장할 수 있다. 수요일이나 목요일 레이디스 나이트를 운영하는 곳도 있으니 평일 방문도 고려해볼 만하다. 주차는 대부분 인근 유료 주차장을 이용하며, 대중교통이나 택시 이용을 권장한다. 놀쿨에서 전국 35곳의 사운드·분위기·접근성을 직접 확인하고, 나에게 맞는 플로어를 찾아보자."
      guide={{
        title: '처음이세요?',
        items: [
          '복장: 셔츠에 깔끔한 신발이면 대부분 통과한다. 슬리퍼·반바지·트레이닝복은 입장 불가',
          '준비물: 신분증은 필수, 현금과 카드 모두 챙기고 보조배터리도 가져가자',
          '혼자 가도 괜찮다. 바 카운터나 스탠딩 구역에서 자연스럽게 분위기에 합류할 수 있다',
          '피크타임: 금·토 23시~01시가 가장 뜨겁다. 일찍 도착하면 대기 없이 입장 가능',
          '귀중품은 최소한으로 챙기고, 휴대폰과 카드만 주머니에 넣는 게 안전하다',
          '물을 충분히 마셔두면 다음 날 컨디션이 훨씬 낫다. 중간중간 수분 보충 필수',
          '강남·홍대·이태원은 분위기가 전혀 다르니 취향에 맞는 지역부터 정하자',
        ],
      }}
      timeslots={[
        { time: '금요일 22~24시', level: '활발', bar: '75%' },
        { time: '금요일 24~02시', level: '피크', bar: '95%' },
        { time: '토요일 23~02시', level: '붐빔', bar: '90%' },
        { time: '평일', level: '한산', bar: '20%' },
      ]}
      venues={venues}
      catLabel="플로어"
      year={new Date().getFullYear()}
    />
  );
}
