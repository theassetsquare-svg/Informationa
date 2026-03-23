import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('lounge');
const venues = getVenuesByCategory('lounge');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/lounges/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/lounges/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/lounges.png', width: 1200, height: 630 }] },
};

export default function LoungesPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="시끄러운 곳이 싫은 사람들을 위한 곳이다. 조용한 음악, 편안한 소파, 좋은 술. 대화가 가능한 밤을 원한다면 여기가 정답이다. 볼륨이 낮아 옆 사람 말이 들린다. 와인, 칵테일, 위스키 등 음료 퀄리티가 핵심이다. 소개팅이나 비즈니스 미팅, 소규모 모임 장소로 택하는 경우가 많다. 압구정 일대가 주 무대이고, 바텐더의 실력이 곧 그 집의 수준이다. 시그니처 한 잔을 주문해보면 분위기를 가늠할 수 있다. 주말 저녁에는 자리가 빨리 차니 예약을 추천한다. 강남부터 청담, 압구정까지 분위기 좋은 곳만 골라 정리했다."
      guide={{
        title: '처음이세요?',
        items: [
          '예약 추천. 인기 있는 곳은 당일 워크인이 어렵다',
          '복장: 스마트 캐주얼. 셔츠에 깔끔한 바지면 충분',
          '혼자 가도 됨. 바 카운터는 1인 손님을 위한 자리',
          '시그니처 칵테일부터 시작하면 그 집 수준을 파악 가능',
          '전화로 미리 분위기와 시스템을 확인하면 편안하게 방문할 수 있다',
        ],
      }}
      timeslots={[
        { time: '평일 저녁', level: '여유', bar: '35%' },
        { time: '금요일 20~23시', level: '활발', bar: '80%' },
        { time: '토요일 20~23시', level: '피크', bar: '90%' },
        { time: '일요일', level: '한산', bar: '20%' },
      ]}
      venues={venues}
      catLabel="대화 와인"
      year={new Date().getFullYear()}
    />
  );
}
