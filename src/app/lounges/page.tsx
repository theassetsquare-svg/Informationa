import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('lounge');
const venues = getVenuesByCategory('lounge');

export const metadata: Metadata = {
  title: '분위기 좋은 라운지 3선 — 대화가 되는 바를 찾는다면', description: cat.description,
  alternates: { canonical: SITE_URL + '/lounges/' },
  openGraph: { title: '분위기 좋은 라운지 3선 — 대화가 되는 바를 찾는다면', description: cat.description, url: SITE_URL + '/lounges/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/lounges.png', width: 1200, height: 1200 }] },
};

export default function LoungesPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="라운지는 대화가 중심이 되는 밤 공간이다. 클럽처럼 음악이 몸을 지배하는 곳이 아니라, 낮은 볼륨의 재즈나 보사노바가 배경이 되어 옆 사람의 말소리가 선명하게 들린다. 편안한 소파에 앉아 바텐더가 만들어주는 칵테일 한 잔을 기울이는 것, 그것이 라운지의 본질이다. 소개팅 장소로 인기가 높고, 비즈니스 미팅이나 소규모 기념일 모임에도 적합하다. 압구정과 청담 일대가 라운지 문화의 중심지이며, 바텐더의 실력이 곧 그 공간의 수준을 결정한다. 시그니처 칵테일을 주문해보면 그 집의 방향성과 퀄리티를 단번에 가늠할 수 있다. 와인, 위스키, 창작 칵테일 등 주류 라인업이 다양하고, 안주도 파인다이닝에 가까운 수준을 갖춘 곳이 늘고 있다. 주말 저녁에는 자리가 빠르게 차기 때문에 사전 예약을 권장한다. 평일 방문은 여유롭게 바 카운터에서 바텐더와 대화하며 분위기를 즐기기에 좋다. 2인 이상이 방문할 경우 소파석을 요청하면 보다 편안한 시간을 보낼 수 있다. 놀쿨에서 분위기·음료 퀄리티·예약 여부를 확인하고, 조용하면서도 세련된 밤을 설계해보자."
      guide={{
        title: '처음이세요?',
        items: [
          '예약을 추천한다. 인기 있는 곳은 주말 당일 워크인이 어렵다',
          '복장: 스마트 캐주얼이 기본이다. 셔츠에 깔끔한 바지면 충분하다',
          '혼자 가도 괜찮다. 바 카운터석은 1인 손님을 위한 자리다',
          '시그니처 칵테일부터 시작하면 그 집의 수준과 방향을 바로 파악할 수 있다',
          '대화가 목적이라면 볼륨이 낮은 자리를 요청하자. 바텐더에게 말하면 된다',
          '안주 퀄리티가 좋은 곳이 많으니 음식 메뉴도 함께 확인해보자',
          '평일 저녁은 여유롭게 분위기를 즐기기에 가장 좋은 타이밍이다',
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
